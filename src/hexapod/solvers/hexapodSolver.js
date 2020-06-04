import { POSITION_NAMES_LIST } from "../constants"
import { tRotXYZmatrix } from "../geometry"
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

    const { coxia, femur, tibia } = dimensions
    const legDimensions = { coxia, femur, tibia }
    const solvedHexapodParams = new IKSolver().solve(
        legDimensions,
        targetBodyContactPoints,
        targetGroundContactPoints,
        targetAxes
    )

    if (solvedHexapodParams.foundSolution) {
        return {
            pose: solvedHexapodParams.pose,
            obtainedSolution: true,
            hasLegsOff: solvedHexapodParams.hasLegsOffGround,
            message: solvedHexapodParams.message,
        }
    } else {
        return {
            pose: null,
            obtainedSolution: false,
            message: solvedHexapodParams.message,
        }
    }
}

export default solveInverseKinematics
