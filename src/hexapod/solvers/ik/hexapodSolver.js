import { POSITION_NAMES_LIST } from "../../constants"
import {
    tRotZmatrix,
    tRotXYZmatrix,
    vectorFromTo,
    angleBetween,
    isCounterClockwise,
} from "../../geometry"
import Vector from "../../Vector"
import VirtualHexapod from "../../VirtualHexapod"
import IKSolver from "./IKSolver"

const solveInverseKinematics = (
    dimensions,
    rawIKparams,
    flags = { rotateThenShift: true }
) => {
    const [ikSolver, target_groundContactPoints] = solveHexapodParams(
        dimensions,
        rawIKparams,
        flags.rotateThenShift
    )

    if (!ikSolver.foundSolution) {
        return {
            pose: null,
            obtainedSolution: false,
            message: ikSolver.message,
            hexapod: null,
        }
    }

    // How the hexapod looks like if the center of gravity is at (0, 0, _)
    const currentHexapod = new VirtualHexapod(dimensions, ikSolver.pose)
    const excludedPositions = ikSolver.legPositionsOffGround

    const pivots = findTwoPivotPoints(
        currentHexapod.groundContactPoints,
        target_groundContactPoints,
        excludedPositions
    )

    const hexapod = pivots.foundTwoPoints
        ? rotateShiftHexapodgivenPivots(currentHexapod, pivots.points1, pivots.points2)
        : currentHexapod

    return {
        pose: ikSolver.pose,
        obtainedSolution: true,
        message: ikSolver.message,
        hexapod,
    }
}

/* * *
    Returns a two-element array
    1. ikSolver: IKSolver object
    2. An array of target ground contact points
 * * */
const solveHexapodParams = (dimensions, rawIKparams, rotateThenShift) => {
    const { tVec, rotMatrix, startPose } = convertIKparams(dimensions, rawIKparams)
    const startHexapod = new VirtualHexapod(dimensions, startPose)

    const targets = buildHexapodTargets(startHexapod, rotMatrix, tVec, {
        rotateThenShift,
    })

    // Solve for the pose of the hexapod if it exists
    const ikSolver = new IKSolver().solve(
        startHexapod.legDimensions,
        targets.bodyContactPoints,
        targets.groundContactPoints,
        targets.axes
    )

    return [ikSolver, targets.groundContactPoints]
}

// Make sure all parameter values are numbers
const rawParamsToNumbers = rawParams =>
    Object.entries(rawParams).reduce(
        (params, [key, val]) => ({ ...params, [key]: Number(val) }),
        {}
    )

// tx, ty, and tz are within the range of (-1, 1)
// return the actual values we want the hexapod's center of gravity to be at
const convertFromPercentToTranslateValues = (tx, ty, tz, middle, side, tibia) => {
    const shiftX = tx * middle
    const shiftY = ty * side
    const shiftZ = tz * tibia
    return new Vector(shiftX, shiftY, shiftZ)
}

/* * *

startPose:
    - The pose of the hexapod before we
        rotate and translate the hexapod
    - The body (hexagon) is flat at this point
    - At the very end, we want the hexapod
        to step on the same place as at this pose
        (ie same ground contact points)

 * * */
const buildStartPose = (hipStance, legStance) => {
    const betaAndGamma = { beta: legStance, gamma: -legStance }
    const alphas = [0, -hipStance, hipStance, 0, -hipStance, hipStance]

    return alphas.reduce((pose, alpha, index) => {
        const positionName = POSITION_NAMES_LIST[index]
        pose[positionName] = { alpha, ...betaAndGamma }
        return pose
    }, {})
}

/* * *

compute for the following:

startPose:
    - The pose of the hexapod before we
        rotate and translate the hexapod
    - see function buildStartPose() for details

rotateMatrix:
    - The transformation matrix we would use to
        rotate the hexapod's body

tVec
    - The translation vector we would use to
        shift the hexapod's body

 * * */
const convertIKparams = (dimensions, rawIKparams) => {
    const IKparams = rawParamsToNumbers(rawIKparams)

    const { middle, side, tibia } = dimensions
    const { tx, ty, tz } = IKparams

    // prettier-ignore
    const tVec = convertFromPercentToTranslateValues(
        tx, ty, tz, middle, side, tibia
    )

    const { hipStance, legStance } = IKparams
    const startPose = buildStartPose(hipStance, legStance)

    const { rx, ry, rz } = IKparams
    const rotMatrix = tRotXYZmatrix(rx, ry, rz)

    return { tVec, startPose, rotMatrix }
}

/* * *

compute the parameters required to solve
for the hexapod's inverse kinematics

see IKSolver() class for details.

 * * */
const buildHexapodTargets = (hexapod, rotMatrix, tVec, { rotateThenShift }) => {
    const groundContactPoints = hexapod.legs.map(leg => leg.maybeGroundContactPoint)

    const bodyContactPoints = rotateThenShift
        ? hexapod.body.cloneTrot(rotMatrix).cloneShift(tVec.x, tVec.y, tVec.z)
              .verticesList
        : hexapod.body.cloneShift(tVec.x, tVec.y, tVec.z).cloneTrot(rotMatrix)
              .verticesList

    const axes = {
        xAxis: new Vector(1, 0, 0).cloneTrot(rotMatrix),
        zAxis: new Vector(0, 0, 1).cloneTrot(rotMatrix),
    }

    return { groundContactPoints, bodyContactPoints, axes }
}

/* * *

We know 2 point positions that we know are
foot tip ground contact points
(position ie "rightMiddle" etc)

The given `hexapod` is stepping at the `current` points

We want to return a hexapod that is
shifted and rotated it so that those
two points would be stepping at their
respective `target` points

 * * */
const rotateShiftHexapodgivenPivots = (hexapod, points1, points2) => {
    const targetVector = vectorFromTo(points1.target, points2.target)
    const currentVector = vectorFromTo(points1.current, points2.current)

    const twistAngleAbsolute = angleBetween(currentVector, targetVector)
    const isCCW = isCounterClockwise(currentVector, targetVector, new Vector(0, 0, 1))
    const twistAngle = isCCW ? twistAngleAbsolute : -twistAngleAbsolute
    const twistMatrix = tRotZmatrix(twistAngle)

    const twistedCurrentPoint1 = points1.current.cloneTrot(twistMatrix)
    const translateVector = vectorFromTo(twistedCurrentPoint1, points1.target)

    const pivotedHexapod = hexapod
        .cloneTrot(twistMatrix)
        .cloneShift(translateVector.x, translateVector.y, 0)

    return pivotedHexapod
}

/* * *

given the points where the hexapod should step on

Find two foot tips as pivot points
that we can use to shift and twist the current Hexapod

 * * */
const findTwoPivotPoints = (currentPoints, targetPoints, excludedPositions) => {
    const targetPointsMap = targetPoints.reduce((acc, point) => {
        acc[point.name] = point
        return acc
    }, {})

    const targetPointNames = Object.keys(targetPointsMap)

    let [currentPoint1, currentPoint2] = [null, null]
    let [targetPoint1, targetPoint2] = [null, null]

    for (let i = 0; i < currentPoints.length; i++) {
        const currentPoint = currentPoints[i]
        const currentName = currentPoint.name
        if (excludedPositions.includes(currentName)) {
            continue
        }

        if (targetPointNames.includes(currentName)) {
            if (currentPoint1 === null) {
                currentPoint1 = currentPoint
                targetPoint1 = targetPointsMap[currentName]
            } else {
                currentPoint2 = currentPoint
                targetPoint2 = targetPointsMap[currentName]
                break
            }
        }
    }

    if (currentPoint2 === null) {
        return { foundTwoPoints: false }
    }

    return {
        points1: { target: targetPoint1, current: currentPoint1 },
        points2: { target: targetPoint2, current: currentPoint2 },
        foundTwoPoints: true,
    }
}

export default solveInverseKinematics
export { solveHexapodParams }
