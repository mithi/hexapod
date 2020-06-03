import {
    POSITION_NAME_TO_IS_LEFT_MAP,
    POSITION_NAME_TO_AXIS_ANGLE_MAP,
    POSITION_NAMES_LIST,
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

    if (legLeftOrRight.every(isLeft => isLeft === false)) {
        return [true, "All right legs are off the floor"]
    }

    if (legLeftOrRight.every(isLeft => isLeft === false)) {
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

const badCoxiaPointReturnObject = (legPosition, coxiaPoint) =>
    IKreturnObject({
        message: `[${legPosition}] Impossible! Atleast one coxia point ${coxiaPoint} would be shoved on ground.`,
        obtainedSolution: false,
    })

const someLegsOffGroundReturnObject = (pose, legPositionOffGround) =>
    IKreturnObject({
        pose,
        message: `Successful! These legs are off the ground: ${legPositionOffGround}`,
        someLegsOff: true,
    })

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

const solveInverseKinematics = (dimensions, rawIKParams) => {
    // Make sure all parameter values are numbers
    const ikParams = Object.entries(rawIKParams).reduce(
        (params, [key, val]) => ({ ...params, [key]: Number(val) }),
        {}
    )

    // ......................
    // [STEP ONE]: Compute for
    //   - target body contacts [hexagon.vertices]
    //   - get ground contact points [groundContactPoint of hexapod.legs]
    // ......................
    const startingPose = makeStartingPose(ikParams.hipStance, ikParams.legStance)
    const hexapod = new VirtualHexapod(dimensions, startingPose)

    const { rx, ry, rz } = ikParams
    const rotationMatrix = tRotXYZmatrix(rx, ry, rz)
    const { xAxis, zAxis } = computeLocalAxes(rotationMatrix)

    const [tx, ty, tz] = getTranslationValues(dimensions, ikParams)
    const hexagon = hexapod.body.cloneShift(tx, ty, tz).cloneTrot(rotationMatrix)

    hexagon.verticesList.forEach(vertex => {
        if (vertex.z < 0) {
            const message = `Impossible! Atleast one vertex would be shoved on ground. ${vertex.name}`
            return IKreturnObject({ obtainedSolution: false, message })
        }
    })

    // ......................
    // [STEP TWO]: Compute for
    //   - pose of each leg position { alpha, beta, gamma }
    // ......................
    const { coxia, femur, tibia } = dimensions
    let [legPositionsOffGround, pose] = [[], {}]

    hexapod.legs.forEach((leg, index) => {
        const vertex = hexagon.verticesList[index]
        const footTip = leg.maybeGroundContactPoint
        const known = computeInitialLegProperties(vertex, footTip, zAxis)

        // if a coxia point would be on the ground, return
        if (known.coxiaPoint.z < 0) {
            return badCoxiaPointReturnObject(leg.position, known.coxiaPoint)
        }

        // compute alpha angle
        const legXaxisAngle = POSITION_NAME_TO_AXIS_ANGLE_MAP[leg.position]
        const alpha = computeAlpha(known.coxiaUnitVector, legXaxisAngle, xAxis, zAxis)

        // compute beta and gamma angles given known geometric parameters
        // prettier-ignore
        // if there no solution found, return why

        const solvedLeg = new LegIKSolver(leg.position)
            .solve(coxia, femur, tibia, known.summa, known.rho)

        if (!solvedLeg.obtainedSolution) {
            return IKreturnObject({ obtainedSolution: false, message: solvedLeg.message })
        }

        // make sure that hexapod can maintain its position and orientation
        // given that some legs known to be off the ground, else return
        if (!solvedLeg.reachedTarget) {
            legPositionsOffGround.push(leg.position)
            const [noSupport, message] = hexapodNoSupport(legPositionsOffGround)
            if (noSupport) {
                return IKreturnObject({ obtainedSolution: false, message })
            }
        }

        // we have successfully solved for this particular leg's pose
        pose[leg.position] = { alpha, beta: solvedLeg.beta, gamma: solvedLeg.gamma }
    })

    // Return the hexapod pose we have solved
    // remember to indicate if some legs are off the ground
    return legPositionsOffGround.length === 0
        ? IKreturnObject({ pose })
        : someLegsOffGroundReturnObject({ pose, someLegsOff: true })
}

export default solveInverseKinematics
