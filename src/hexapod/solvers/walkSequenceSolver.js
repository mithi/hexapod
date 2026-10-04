import { solveHexapodParams } from "./ik/hexapodSolver"
import IKSolver from "./ik/IKSolver"
import { POSITION_NAMES_LIST } from "../constants"
import Vector from "../Vector"
import VirtualHexapod from "../VirtualHexapod"

// Match the prototype controller's first tripod: RF, LM, RR.
const TRIPOD_A = new Set(["rightFront", "leftMiddle", "rightBack"])
const RIPPLE_PHASES = {
    leftBack: 0 / 6,
    rightFront: 1 / 6,
    leftMiddle: 2 / 6,
    rightBack: 3 / 6,
    leftFront: 4 / 6,
    rightMiddle: 5 / 6,
}

/*
 * Generate a cyclic Cartesian foot path, then solve the hexapod IK for every
 * frame. `hipSwing` and `liftSwing` remain angular controls for compatibility
 * with the existing UI; they are converted to an XY stride and a Z lift using
 * the actual leg dimensions.
 */
const getWalkSequence = (
    dimensions,
    params = {
        tx: 0,
        tz: 0,
        rx: 0,
        ry: 0,
        legStance: 0,
        hipStance: 25,
        stepCount: 5,
        hipSwing: 25,
        liftSwing: 40,
    },
    gaitType = "tripod",
    walkMode = "walking"
) => {
    const {
        tx = 0,
        tz = 0,
        rx = 0,
        ry = 0,
        legStance = 0,
        hipStance = 25,
        stepCount = 5,
        hipSwing = 25,
        liftSwing = 40,
    } = params

    const rawIKparams = {
        tx,
        ty: 0,
        tz,
        legStance,
        hipStance,
        rx,
        ry,
        rz: 0,
    }

    const [stanceSolver] = solveHexapodParams(dimensions, rawIKparams, true)
    if (!stanceSolver.foundSolution || stanceSolver.hasLegsOffGround) {
        return null
    }

    const stanceHexapod = new VirtualHexapod(dimensions, stanceSolver.pose)
    if (!stanceHexapod.foundSolution || !stanceHexapod.body) {
        return null
    }

    const frameMultiplier = gaitType === "ripple" ? 6 : 4
    const numberOfFrames = Math.max(1, Math.round(stepCount) * frameMultiplier)
    const dutyFactor = gaitType === "ripple" ? 5 / 6 : 0.65
    const bodyPoints = stanceHexapod.body.verticesList
    const baseFeet = stanceHexapod.legs.map(leg => leg.footTipPoint)
    const bodyCog = stanceHexapod.body.cog
    const axes = {
        xAxis: stanceHexapod.localAxes.xAxis,
        zAxis: stanceHexapod.localAxes.zAxis,
    }

    const forwardDirection = normalize2D(
        stanceHexapod.localAxes.yAxis.x,
        stanceHexapod.localAxes.yAxis.y
    )
    const swingAngle = Math.abs(Number(hipSwing))
    const liftAngle = Math.abs(Number(liftSwing))
    const halfStrideByLeg = baseFeet.map((foot, index) => {
        const origin = walkMode === "rotating" ? bodyCog : bodyPoints[index]
        const radius = distance2D(foot.x - origin.x, foot.y - origin.y)
        return radius * Math.sin((swingAngle * Math.PI) / 180)
    })
    const nominalLift =
        (dimensions.femur + dimensions.tibia) *
        0.5 *
        Math.sin((Math.min(liftAngle, 90) * Math.PI) / 180)

    // Shrink the requested step if any target falls outside the robot's IK
    // workspace. This keeps the gait valid for different robot dimensions.
    for (const scale of [1, 0.8, 0.6, 0.4, 0.25, 0.1, 0]) {
        const sequence = buildIKSequence({
            dimensions,
            baseFeet,
            bodyPoints,
            axes,
            bodyCog,
            forwardDirection,
            halfStrideByLeg,
            nominalLift,
            numberOfFrames,
            dutyFactor,
            gaitType,
            walkMode,
            scale,
        })

        if (sequence) {
            return sequence
        }
    }

    return null
}

const buildIKSequence = ({
    dimensions,
    baseFeet,
    bodyPoints,
    axes,
    bodyCog,
    forwardDirection,
    halfStrideByLeg,
    nominalLift,
    numberOfFrames,
    dutyFactor,
    gaitType,
    walkMode,
    scale,
}) => {
    const sequences = POSITION_NAMES_LIST.reduce(
        (result, position) => {
            result[position] = { alpha: [], beta: [], gamma: [] }
            return result
        },
        {}
    )

    for (let frameIndex = 0; frameIndex < numberOfFrames; frameIndex++) {
        const cyclePhase = frameIndex / numberOfFrames
        const targetPoints = POSITION_NAMES_LIST.map((position, legIndex) => {
            const phaseOffset = getPhaseOffset(position, gaitType)
            const phase = (cyclePhase + phaseOffset) % 1
            const { strideOffset, lift } = getFootPath(
                phase,
                dutyFactor,
                halfStrideByLeg[legIndex] * scale,
                nominalLift * scale
            )
            const direction = getTravelDirection(
                walkMode,
                baseFeet[legIndex],
                bodyCog,
                forwardDirection
            )
            const foot = baseFeet[legIndex]

            return new Vector(
                foot.x + direction.x * strideOffset,
                foot.y + direction.y * strideOffset,
                foot.z + lift,
                foot.name,
                foot.id
            )
        })

        const frameSolver = new IKSolver().solve(
            {
                coxia: dimensions.coxia,
                femur: dimensions.femur,
                tibia: dimensions.tibia,
            },
            bodyPoints,
            targetPoints,
            axes
        )

        // An IK result that leaves any target unreached is not a valid gait
        // frame; try the same gait with a smaller stride/lift instead.
        if (!frameSolver.foundSolution || frameSolver.hasLegsOffGround) {
            return null
        }

        POSITION_NAMES_LIST.forEach(position => {
            const angles = frameSolver.pose[position]
            sequences[position].alpha.push(angles.alpha)
            sequences[position].beta.push(angles.beta)
            sequences[position].gamma.push(angles.gamma)
        })
    }

    return sequences
}

const getPhaseOffset = (position, gaitType) => {
    if (gaitType === "ripple") {
        return RIPPLE_PHASES[position]
    }
    return TRIPOD_A.has(position) ? 0 : 0.5
}

/*
 * In stance, the foot moves from ahead of its neutral point to behind it.
 * During swing, it returns forward along a raised half-sine path.
 */
const getFootPath = (phase, dutyFactor, halfStride, liftHeight) => {
    if (phase < dutyFactor) {
        const progress = phase / dutyFactor
        const easedProgress = smoothstep(progress)
        return {
            strideOffset: halfStride - 2 * halfStride * easedProgress,
            lift: 0,
        }
    }

    const progress = (phase - dutyFactor) / (1 - dutyFactor)
    const easedProgress = smoothstep(progress)
    return {
        strideOffset: -halfStride + 2 * halfStride * easedProgress,
        lift: liftHeight * Math.sin(Math.PI * progress) ** 2,
    }
}

const smoothstep = value => value * value * (3 - 2 * value)

const getTravelDirection = (walkMode, foot, cog, forwardDirection) => {
    if (walkMode !== "rotating") {
        return forwardDirection
    }

    const radialX = foot.x - cog.x
    const radialY = foot.y - cog.y
    return normalize2D(-radialY, radialX)
}

const normalize2D = (x, y) => {
    const length = Math.sqrt(x * x + y * y)
    return length === 0 ? { x: 0, y: 1 } : { x: x / length, y: y / length }
}

const distance2D = (x, y) => Math.sqrt(x * x + y * y)

export default getWalkSequence
