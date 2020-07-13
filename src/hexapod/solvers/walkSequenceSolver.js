import { solveHexapodParams } from "./ik/hexapodSolver"

/* * *

Return format:
  poseSequence = {
    leftMiddle: {
        alpha: [],
        beta: [],
        gamma: [],
    }
    ....
  }

  gaitType = ["ripple", "tripod"]
  walkMode = ["rotating", "walking"]
  * * */

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
    const { hipStance, rx, ry, tx, tz, legStance } = params
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

    const [ikSolver] = solveHexapodParams(dimensions, rawIKparams, true)

    if (!ikSolver.foundSolution || ikSolver.hasLegsOffGround) {
        return null
    }

    const { hipSwing, liftSwing, stepCount } = params
    const [aHipSwing, aLiftSwing] = [Math.abs(hipSwing), Math.abs(liftSwing)]

    const hipSwings =
        walkMode === "rotating"
            ? getHipSwingRotate(aHipSwing)
            : getHipSwingForward(aHipSwing)

    return gaitType === "ripple"
        ? rippleSequence(ikSolver.pose, aLiftSwing, hipSwings, stepCount)
        : tripodSequence(ikSolver.pose, aLiftSwing, hipSwings, stepCount)
}

/* *

powerStroke aka stancePhase
returnStroke aka swingPhase

1. > startPowerStroke / endReturnStroke < 6.

       \
        \
         *--*--*
        /   |   \   /
       * -- * -- * /
      \ \   |   /
       \ *--*--*

2. > middlePowerStroke / middleReturnStroke < 5.

     --- *--*--*
        /   |   \
       * -- * -- * ---
        \   |   /
    ---- *--*--*

3. > endPowerStroke / startReturnStroke < 4.

       / *--*--*
      / /   |   \
       * -- * -- *
        \   |   / \
         *--*--*   \
       /
      /

 TRIPOD1 - leftFront, rightMiddle, leftBack

 |----- powerStroke ----------|------- returnStroke -------|
                              |-- liftUp --|-- shoveDown --|

 TRIPOD2 rightFront, leftMiddle, rightBack

 |------- returnStroke -------|----- powerStroke ----------|
 |-- liftUp --|-- shoveDown --|

 * */
const tripodSequence = (pose, aLiftSwing, hipSwings, stepCount, walkMode) => {
    const { forwardAlphaSeqs, liftBetaSeqs, liftGammaSeqs } = buildTripodSequences(
        pose,
        aLiftSwing,
        hipSwings,
        stepCount,
        walkMode
    )

    const doubleStepCount = 2 * stepCount

    const tripodA = tripodASequence(
        forwardAlphaSeqs,
        liftGammaSeqs,
        liftBetaSeqs,
        doubleStepCount
    )
    const tripodB = tripodBSequence(
        forwardAlphaSeqs,
        liftGammaSeqs,
        liftBetaSeqs,
        doubleStepCount
    )

    return { ...tripodA, ...tripodB }
}

const tripodASequence = (
    forwardAlphaSeqs,
    liftGammaSeqs,
    liftBetaSeqs,
    doubleStepCount
) =>
    ["leftFront", "rightMiddle", "leftBack"].reduce((sequences, legPosition) => {
        const forward = forwardAlphaSeqs[legPosition]
        const gammaLiftUp = liftGammaSeqs[legPosition]
        const betaLiftUp = liftBetaSeqs[legPosition]

        const gammaSeq = [
            ...gammaLiftUp,
            ...gammaLiftUp.slice().reverse(),
            ...fillArray(gammaLiftUp[0], doubleStepCount),
        ]

        const betaSeq = [
            ...betaLiftUp,
            ...betaLiftUp.slice().reverse(),
            ...fillArray(betaLiftUp[0], doubleStepCount),
        ]

        sequences[legPosition] = {
            alpha: [...forward, ...forward.slice().reverse()],
            gamma: gammaSeq,
            beta: betaSeq,
        }

        return sequences
    }, {})

const tripodBSequence = (
    forwardAlphaSeqs,
    liftGammaSeqs,
    liftBetaSeqs,
    doubleStepCount
) =>
    ["rightFront", "leftMiddle", "rightBack"].reduce((sequences, legPosition) => {
        const forward = forwardAlphaSeqs[legPosition]
        const gammaLiftUp = liftGammaSeqs[legPosition]
        const betaLiftUp = liftBetaSeqs[legPosition]

        const gammaSeq = [
            ...fillArray(gammaLiftUp[0], doubleStepCount),
            ...gammaLiftUp,
            ...gammaLiftUp.slice().reverse(),
        ]

        const betaSeq = [
            ...fillArray(betaLiftUp[0], doubleStepCount),
            ...betaLiftUp,
            ...betaLiftUp.slice().reverse(),
        ]

        sequences[legPosition] = {
            alpha: [...forward.slice().reverse(), ...forward],
            gamma: gammaSeq,
            beta: betaSeq,
        }

        return sequences
    }, {})

/* * *

RIPPLE SEQUENCE
a - lift-up
b - shove-down
[1, 2, 3, 4] - retract / power stroke sequence

left-back     |-- a --|-- b --|   1   |   2   |   3   |   4   |
left-middle   |   3   |   4   |-- a --|-- b --|   1   |   2   |
left-front    |   1   |   2   |   3   |   4   |-- a --|-- b --|
right-front   |   4   |-- a --|-- b --|   1   |   2   |   3   |
right-back    |   1   |   2   |   3   |-- a --|-- b --|   4   |
right-middle  |-- b --|   1   |   2   |   3   |   4   |-- a --|

 * * */

const rippleSequence = (startPose, aLiftSwing, hipSwings, stepCount) => {
    const legPositions = Object.keys(startPose)

    let sequences = {}
    legPositions.forEach(position => {
        const { alpha, beta, gamma } = startPose[position]
        const betaLift = buildSequence(beta, aLiftSwing, stepCount)
        const gammaLift = buildSequence(gamma, -aLiftSwing / 2, stepCount)

        const delta = hipSwings[position]
        const fw1 = buildSequence(alpha - delta, delta, stepCount)
        const fw2 = buildSequence(alpha, delta, stepCount)

        const halfDelta = delta / 2
        const bk1 = buildSequence(alpha + delta, -halfDelta, stepCount)
        const bk2 = buildSequence(alpha + halfDelta, -halfDelta, stepCount)
        const bk3 = buildSequence(alpha, -halfDelta, stepCount)
        const bk4 = buildSequence(alpha - halfDelta, -halfDelta, stepCount)

        // prettier-ignore
        sequences[position] = buildRippleLegSequence(
            position, betaLift, gammaLift, fw1, fw2, bk1, bk2, bk3, bk4
        )
    })

    return sequences
}

const buildRippleLegSequence = (position, bLift, gLift, fw1, fw2, bk1, bk2, bk3, bk4) => {
    const stepCount = fw1.length
    const revGLift = gLift.slice().reverse()
    const revBLift = bLift.slice().reverse()
    const b0 = bLift[0]
    const g0 = gLift[0]
    // n stands for neutral
    const bN = fillArray(b0, stepCount)
    const gN = fillArray(g0, stepCount)

    const alphaSeq = [fw1, fw2, bk1, bk2, bk3, bk4]
    const betaSeq = [bLift, revBLift, bN, bN, bN, bN]
    const gammaSeq = [gLift, revGLift, gN, gN, gN, gN]

    const moduloMap = {
        leftBack: 0,
        rightFront: 1,
        leftMiddle: 2,
        rightBack: 3,
        leftFront: 4,
        rightMiddle: 5,
    }

    return {
        alpha: modSequence(moduloMap[position], alphaSeq),
        beta: modSequence(moduloMap[position], betaSeq),
        gamma: modSequence(moduloMap[position], gammaSeq),
    }
}

const modSequence = (mod, seq) => {
    const sequence = [...seq, ...seq]
    return sequence.slice(mod, mod + 6).flat()
}

const buildTripodSequences = (startPose, aLiftSwing, hipSwings, stepCount, walkMode) => {
    const doubleStepCount = 2 * stepCount
    const legPositions = Object.keys(startPose)

    let forwardAlphaSeqs = {}
    let liftBetaSeqs = {}
    let liftGammaSeqs = {}

    legPositions.forEach(legPosition => {
        const { alpha, beta, gamma } = startPose[legPosition]
        const deltaAlpha = hipSwings[legPosition]
        forwardAlphaSeqs[legPosition] = buildSequence(
            alpha - deltaAlpha,
            2 * deltaAlpha,
            doubleStepCount
        )
        liftBetaSeqs[legPosition] = buildSequence(beta, aLiftSwing, stepCount)
        liftGammaSeqs[legPosition] = buildSequence(gamma, -aLiftSwing / 2, stepCount)
    })

    return {
        forwardAlphaSeqs,
        liftBetaSeqs,
        liftGammaSeqs,
    }
}

const buildSequence = (startVal, delta, stepCount) => {
    const step = delta / stepCount

    let currentItem = startVal
    let array = []
    for (let i = 0; i < stepCount; i++) {
        currentItem += step
        array.push(currentItem)
    }

    return array
}

const getHipSwingForward = aHipSwing => {
    return {
        leftFront: -aHipSwing,
        rightMiddle: aHipSwing,
        leftBack: -aHipSwing,
        rightFront: aHipSwing,
        leftMiddle: -aHipSwing,
        rightBack: aHipSwing,
    }
}

const getHipSwingRotate = aHipSwing => {
    return {
        leftFront: aHipSwing,
        rightMiddle: aHipSwing,
        leftBack: aHipSwing,
        rightFront: aHipSwing,
        leftMiddle: aHipSwing,
        rightBack: aHipSwing,
    }
}

const fillArray = (value, len) => {
    if (len === 0) {
        return []
    }
    let a = [value]

    while (a.length * 2 <= len) {
        a = a.concat(a)
    }

    if (a.length < len) {
        a = a.concat(a.slice(0, len - a.length))
    }

    return a
}

export default getWalkSequence
