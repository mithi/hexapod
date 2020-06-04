import { POSITION_NAMES_LIST, NUMBER_OF_LEGS } from "../constants"
import {
    tRotZmatrix,
    tRotXYZmatrix,
    vectorFromTo,
    angleBetween,
    isCounterClockwise,
} from "../geometry"
import Vector from "../Vector"
import VirtualHexapod from "../VirtualHexapod"
import IKSolver from "./IKSolver"

const rawParamsToNumbers = rawParams =>
    // Make sure all parameter values are numbers
    Object.entries(rawParams).reduce(
        (params, [key, val]) => ({ ...params, [key]: Number(val) }),
        {}
    )

const convertFromPercentToTranslates = (middle, side, tibia, tx, ty, tz) => {
    const shiftX = tx * middle
    const shiftY = ty * side
    const shiftZ = tz * tibia
    return new Vector(shiftX, shiftY, shiftZ)
}

const makeStartingPose = (hipStance, legStance) => {
    const betaAndGamma = { beta: legStance, gamma: -legStance }
    const alphas = [0, -hipStance, hipStance, 0, -hipStance, hipStance]

    const pose = POSITION_NAMES_LIST.reduce((pose, positionName, index) => {
        pose[positionName] = { alpha: alphas[index], ...betaAndGamma }
        return pose
    }, {})

    return pose
}

const convertIkParams = (dimensions, rawIKparams) => {
    // Organize params to what the ikSolver can understand
    const IKparams = rawParamsToNumbers(rawIKparams)

    const { middle, side, tibia } = dimensions
    const { tx, ty, tz } = IKparams

    // prettier-ignore
    const tVec = convertFromPercentToTranslates(
        middle, side, tibia, tx, ty, tz
    )

    const { hipStance, legStance } = IKparams
    const startPose = makeStartingPose(hipStance, legStance)

    const { rx, ry, rz } = IKparams
    const rotMatrix = tRotXYZmatrix(rx, ry, rz)

    return { tVec, startPose, rotMatrix }
}

const solveInverseKinematics = (dimensions, rawIKparams) => {
    const { tVec, rotMatrix, startPose } = convertIkParams(dimensions, rawIKparams)
    const startHexapod = new VirtualHexapod(dimensions, startPose)

    const targetGroundContactPoints = startHexapod.legs.map(
        leg => leg.maybeGroundContactPoint
    )
    const targetBodyContactPoints = startHexapod.body
        .cloneShift(tVec.x, tVec.y, tVec.z)
        .cloneTrot(rotMatrix).verticesList

    const targetAxes = {
        xAxis: new Vector(1, 0, 0).cloneTrot(rotMatrix),
        zAxis: new Vector(0, 0, 1).cloneTrot(rotMatrix),
    }

    // solve for the pose of the hexapod if it exists
    const solvedHexapodParams = new IKSolver().solve(
        startHexapod.legDimensions,
        targetBodyContactPoints,
        targetGroundContactPoints,
        targetAxes
    )

    if (!solvedHexapodParams.foundSolution) {
        return {
            pose: null,
            obtainedSolution: false,
            message: solvedHexapodParams.message,
            hexapod: null,
        }
    }

    // this is how the hexapod looks like if the center of gravity is at (0, 0, 0)
    const currentHexapod = new VirtualHexapod(dimensions, solvedHexapodParams.pose)
    const currentMaybeGroundContactPoints = currentHexapod.legs.map(
        leg => leg.maybeGroundContactPoint
    )
    const excludedPositions = solvedHexapodParams.legPositionsOffGround

    const { points1, points2 } = findTwoPivotPoints(
        targetGroundContactPoints,
        currentMaybeGroundContactPoints,
        excludedPositions
    )
    const targetVector = vectorFromTo(points1.target, points2.target)
    const currentVector = vectorFromTo(points1.current, points2.current)

    const twistAngleAbsolute = angleBetween(currentVector, targetVector)
    const isCCW = isCounterClockwise(currentVector, targetVector, new Vector(0, 0, 1))
    const twistAngle = isCCW ? twistAngleAbsolute : -twistAngleAbsolute
    const twistMatrix = tRotZmatrix(twistAngle)

    // twist hexapod
    const twistedCurrentPoint1 = points1.current.cloneTrot(twistMatrix)
    const translateVector = vectorFromTo(twistedCurrentPoint1, points1.target)
    const hexapod = currentHexapod
        .cloneTrot(twistMatrix)
        .cloneShift(translateVector.x, translateVector.y, 0)

    return {
        pose: solvedHexapodParams.pose,
        obtainedSolution: true,
        message: solvedHexapodParams.message,
        hexapod,
    }
}

const findTwoPivotPoints = (targetPoints, currentPoints, excludedPositions) => {
    // find two foot tips as pivot points
    // that we can use to shift and twist the current Hexapod
    // given the points on the ground where the hexapod should step on
    let [targetPoint1, currentPoint1] = [null, null]
    let [targetPoint2, currentPoint2] = [null, null]

    for (let i = 0; i < NUMBER_OF_LEGS; i++) {
        if (excludedPositions.includes(targetPoints[i].position)) {
            continue
        }

        if (targetPoint1 === null) {
            targetPoint1 = targetPoints[i]
            currentPoint1 = currentPoints[i]
        } else {
            targetPoint2 = targetPoints[i]
            currentPoint2 = currentPoints[i]
        }

        if (targetPoint2 !== null) {
            break
        }
    }

    return {
        points1: { target: targetPoint1, current: currentPoint1 },
        points2: { target: targetPoint2, current: currentPoint2 },
    }
}

export default solveInverseKinematics
