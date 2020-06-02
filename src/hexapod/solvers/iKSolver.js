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

const hexapodNoSupport = legsNamesUpInTheAir => {
    if (legsNamesUpInTheAir.length < 3) {
        return [false, "Not enough information"]
    }

    if (legsNamesUpInTheAir.length >= 4) {
        return [true, "too many legs off the floor"]
    }

    // leg count is exactly 3
    const legLeftOrRight = legsNamesUpInTheAir.map(
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

const IKreturnObject = (obtainedSolution, message, pose) => ({
    obtainedSolution,
    message,
    pose,
})

const getTranslationValues = (dimensions, ikParams) => {
    const tx = Number(ikParams.tx) * Number(dimensions.middle)
    const ty = Number(ikParams.ty) * Number(dimensions.side)
    const tz = Number(ikParams.tz) * Number(dimensions.tibia)
    return [tx, ty, tz]
}

const solveInverseKinematics = (dimensions, ikParams) => {
    const { rx, ry, rz } = ikParams
    const [tx, ty, tz] = getTranslationValues(dimensions, ikParams)
    const startingPose = makeStartingPose(
        Number(ikParams.hipStance),
        Number(ikParams.legStance)
    )

    console.log("dimensions", dimensions)
    console.log("starting pose", startingPose)

    const hexapod = new VirtualHexapod(dimensions, startingPose)

    const rotationMatrix = tRotXYZmatrix(rx, ry, rz)
    const hexagon = hexapod.body.cloneShift(tx, ty, tz).cloneTrot(rotationMatrix)
    const { xAxis, zAxis } = computeLocalAxes(rotationMatrix)

    hexagon.verticesList.forEach(vertex => {
        if (vertex.z < 0) {
            const message = `Impossible! Atleast one vertex would be shoved on ground. ${vertex.name}`
            return IKreturnObject(false, message, {})
        }
    })

    const { coxia, femur, tibia } = dimensions
    let legPositionsUpInTheAir = []
    let pose = {}

    hexapod.legs.forEach((leg, index) => {
        const vertex = hexagon.verticesList[index]
        const tip = leg.maybeGroundContactPoint
        const {
            coxiaPoint,
            coxiaUnitVector,
            summa,
            rho,
        } = computeInitialLegProperties(vertex, tip, zAxis)

        if (coxiaPoint.z < 0) {
            const message = `Impossible! AtLeast one coxia point would be shoved on ground. ${leg.position}`
            return IKreturnObject(false, message, {})
        }

        const legXaxisAngle = POSITION_NAME_TO_AXIS_ANGLE_MAP[leg.position]
        const alpha = computeAlpha(coxiaUnitVector, legXaxisAngle, xAxis, zAxis)

        const solvedLeg = new LegIKSolver(
            leg.position,
            coxia,
            femur,
            tibia,
            summa,
            rho
        )

        if (!solvedLeg.obtainedSolution) {
            return IKreturnObject(false, this.solvedLeg.message, {})
        }

        if (!solvedLeg.reachedTarget) {
            legPositionsUpInTheAir.push(leg.position)
            const [noSupport, message] = hexapodNoSupport(legPositionsUpInTheAir)
            if (noSupport) {
                return IKreturnObject(false, message, {})
            }
        }

        pose[leg.position] = { alpha, beta: solvedLeg.beta, gamma: solvedLeg.gamma }
    })

    return legPositionsUpInTheAir.length === 0
        ? IKreturnObject(true, "Successful! no problems encountered", pose)
        : IKreturnObject(
              true,
              `Successful! These legs are off the ground: ${legPositionsUpInTheAir}`,
              pose
          )
}

export default solveInverseKinematics
