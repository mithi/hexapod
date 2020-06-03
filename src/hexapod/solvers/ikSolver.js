import {
    POSITION_NAME_TO_IS_LEFT_MAP,
    POSITION_NAME_TO_AXIS_ANGLE_MAP,
    POSITION_NAMES_LIST,
    NUMBER_OF_LEGS,
} from "../constants"
import VirtualHexapod from "../VirtualHexapod"
import { computeLocalAxes } from "../VirtualHexapod"

import {
    tRotXYZmatrix,
    vectorFromTo,
    projectedVectorOntoPlane,
    getUnitVector,
    scaleVector,
    addVectors,
    angleBetween,
    vectorLength,
    isCounterClockwise,
} from "../geometry"
import LegIKSolver from "./LegIKSolver"

const makeStartingPose = (hipStance, legStance) => {
    const betaAndGamma = { beta: legStance, gamma: -legStance }
    const alphas = [0, -hipStance, hipStance, 0, -hipStance, hipStance]
    const pose = POSITION_NAMES_LIST.reduce((pose, positionName, index) => {
        pose[positionName] = { alpha: alphas[index], ...betaAndGamma }
        return pose
    }, {})

    return pose
}

const hexapodNoSupport = legsNamesoffGround => {
    if (legsNamesoffGround.length < 3) {
        return [false, "Not enough information"]
    }

    if (legsNamesoffGround.length >= 4) {
        return [true, "too many legs off the floor"]
    }

    // leg count is exactly 3
    const legLeftOrRight = legsNamesoffGround.map(
        legPosition => POSITION_NAME_TO_IS_LEFT_MAP[legPosition]
    )

    if (legLeftOrRight.every(isLeft => !isLeft)) {
        return [true, "All right legs are off the floor"]
    }

    if (legLeftOrRight.every(isLeft => isLeft)) {
        return [true, "All left legs are off the floor"]
    }

    return [false, "Not enough information"]
}

const computeAlpha = (coxiaVector, legXaxisAngle, xAxis, zAxis) => {
    const sign = isCounterClockwise(coxiaVector, xAxis, zAxis) ? -1 : 1
    const alphaWrtHexapod = sign * angleBetween(coxiaVector, xAxis)
    const alpha = (alphaWrtHexapod - legXaxisAngle) % 360
    if (alpha > 180) {
        return alpha - 360
    }
    if (alpha < -180) {
        return alpha + 360
    }
    return alpha
}

const badPointReturnObject = (legPosition, badPoint) =>
    IKreturnObject({
        message: `[${legPosition}] Impossible! Atleast one point ${badPoint} would be shoved on ground.`,
        obtainedSolution: false,
    })

const someLegsOffGroundReturnObject = (pose, legPositionOffGround) => {
    const message = legPositionOffGround.reduce(
        (message, legPosition) => message + `${legPosition}\n\n`,
        "Successful! These legs are off the ground: \n\n"
    )
    return IKreturnObject({
        pose,
        message,
        someLegsOff: true,
    })
}

function IKreturnObject(options) {
    const pose = options.pose || null
    const obtainedSolution =
        options.obtainedSolution === undefined ? true : options.obtainedSolution
    const message = options.message || "Successful"
    const someLegsOff = options.someLegsOff === undefined ? false : options.someLegsOff

    if (obtainedSolution === true && pose === null) {
        throw Error("Pose can't be null when obtained solution is true")
    }

    return { pose, obtainedSolution, message, someLegsOff }
}

const getTranslationValues = (dimensions, ikParams) => {
    const tx = ikParams.tx * dimensions.middle
    const ty = ikParams.ty * dimensions.side
    const tz = ikParams.tz * dimensions.tibia
    return [tx, ty, tz]
}

const solveInitialHexapodProperties = (dimensions, rawIKParams) => {
    // Make sure all parameter values are numbers
    const ikParams = Object.entries(rawIKParams).reduce(
        (params, [key, val]) => ({ ...params, [key]: Number(val) }),
        {}
    )

    const startingPose = makeStartingPose(ikParams.hipStance, ikParams.legStance)
    const hexapod = new VirtualHexapod(dimensions, startingPose)

    const { rx, ry, rz } = ikParams
    const rotationMatrix = tRotXYZmatrix(rx, ry, rz)
    const { xAxis, zAxis } = computeLocalAxes(rotationMatrix)

    const [tx, ty, tz] = getTranslationValues(dimensions, ikParams)
    const hexagon = hexapod.body.cloneShift(tx, ty, tz).cloneTrot(rotationMatrix)

    const bodyContactPoints = hexagon.verticesList
    const groundContactPoints = hexapod.legs.map(leg => leg.maybeGroundContactPoint)
    return { bodyContactPoints, groundContactPoints, xAxis, zAxis }
}

const computeInitialLegProperties = (
    bodyContactPoint,
    groundContactPoint,
    zAxis,
    coxia
) => {
    const bodyToFootVector = vectorFromTo(bodyContactPoint, groundContactPoint)
    const coxiaDirectionVector = projectedVectorOntoPlane(bodyToFootVector, zAxis)
    const coxiaUnitVector = getUnitVector(coxiaDirectionVector)
    const coxiaVector = scaleVector(coxiaUnitVector, coxia)
    const coxiaPoint = addVectors(bodyContactPoint, coxiaVector)
    const rho = angleBetween(coxiaUnitVector, bodyToFootVector)
    const summa = vectorLength(bodyToFootVector)

    return {
        coxiaUnitVector,
        coxiaVector,
        coxiaPoint,
        rho,
        summa,
    }
}

const solveInverseKinematics = (dimensions, rawIKParams) => {
    // ......................
    // [STEP ONE]: Compute for
    //   - target body contacts [hexagon.vertices]
    //   - get ground contact points [groundContactPoint of hexapod.legs]
    //   - xAxis and zAxis of the new hexapod body coordinate frame
    // ......................
    const hexapodParams = solveInitialHexapodProperties(dimensions, rawIKParams)
    const { groundContactPoints, bodyContactPoints, xAxis, zAxis } = hexapodParams

    for (let i = 0; i < NUMBER_OF_LEGS; i++) {
        const vertex = bodyContactPoints[i]
        if (vertex.z < 0) {
            return badPointReturnObject(vertex.name, vertex)
        }
    }

    // ......................
    // [STEP TWO]: Compute for
    //   - pose of each leg position { alpha, beta, gamma }
    //   - if we can't meet criteria, return why
    // ......................
    const { coxia, femur, tibia } = dimensions
    let [legPositionsOffGround, pose] = [[], {}]

    for (let i = 0; i < NUMBER_OF_LEGS; i++) {
        const legPosition = POSITION_NAMES_LIST[i]

        // prettier-ignore
        const known = computeInitialLegProperties(
            bodyContactPoints[i], groundContactPoints[i], zAxis
        )

        if (known.coxiaPoint.z < 0) {
            return badPointReturnObject(legPosition, known.coxiaPoint)
        }

        const legXaxisAngle = POSITION_NAME_TO_AXIS_ANGLE_MAP[legPosition]
        const alpha = computeAlpha(known.coxiaUnitVector, legXaxisAngle, xAxis, zAxis)

        // prettier-ignore
        const solvedLeg = new LegIKSolver(legPosition)
            .solve(coxia, femur, tibia, known.summa, known.rho)

        if (!solvedLeg.obtainedSolution) {
            return IKreturnObject({ obtainedSolution: false, message: solvedLeg.message })
        }

        if (!solvedLeg.reachedTarget) {
            legPositionsOffGround.push(legPosition)
            const [noSupport, message] = hexapodNoSupport(legPositionsOffGround)
            if (noSupport) {
                return IKreturnObject({ obtainedSolution: false, message })
            }
        }

        pose[legPosition] = { alpha, beta: solvedLeg.beta, gamma: solvedLeg.gamma }
    }

    return legPositionsOffGround.length === 0
        ? IKreturnObject({ pose })
        : someLegsOffGroundReturnObject(pose, legPositionsOffGround)
}

export default solveInverseKinematics
