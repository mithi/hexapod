import { solveHexapodParams } from "./ik/hexapodSolver"

/* * *

  poseSequence = {
    leftMiddle: {
        alpha: [],
        beta: [],
        gamma: [],
    }
  }

powerStroke aka stancePhase
returnStroke aka swingPhase

startPowerStroke / endReturnStroke

       \
        \
         *--*--*
        /   |   \   /
       * -- * -- * /
      \ \   |   /
       \ *--*--*

endPowerStroke / startReturnStroke

     --- *--*--*
        /   |   \
       * -- * -- * ---
        \   |   /
    ---- *--*--*

 TRIPOD1 - leftFront, rightMiddle, leftBack

 |----- powerStroke ----------|------- returnStroke -------|
                              |-- liftUp --|-- shoveDown --|

 TRIPOD2 rightFront, leftMiddle, rightBack

 |------- returnStroke -------|----- powerStroke ----------|
 |-- liftUp --|-- shoveDown --|


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
    }
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
    const aHipSwing = Math.abs(hipSwing)

    return tripodSequence(ikSolver.pose, liftSwing, aHipSwing, stepCount)
}

const tripodSequence = (pose, liftSwing, aHipSwing, stepCount) => {
    const { forwardAlphaSeqs, liftBetaSeqs, liftGammaSeqs } = buildSequences(
        pose,
        liftSwing,
        aHipSwing,
        stepCount
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

const buildSequences = (startPose, liftSwing, aHipSwing, stepCount) => {
    const doubleStepCount = 2 * stepCount

    const hipSwingForward = {
        leftFront: -aHipSwing,
        rightMiddle: aHipSwing,
        leftBack: -aHipSwing,
        rightFront: aHipSwing,
        leftMiddle: -aHipSwing,
        rightBack: aHipSwing,
    }

    const legPositions = Object.keys(startPose)

    let forwardAlphaSeqs = {}
    let liftBetaSeqs = {}
    let liftGammaSeqs = {}

    legPositions.forEach(legPosition => {
        const { alpha, beta, gamma } = startPose[legPosition]
        const deltaAlpha = hipSwingForward[legPosition]
        forwardAlphaSeqs[legPosition] = buildSequence(
            alpha - deltaAlpha,
            2 * deltaAlpha,
            doubleStepCount
        )
        liftBetaSeqs[legPosition] = buildSequence(beta, Math.abs(liftSwing), stepCount)
        liftGammaSeqs[legPosition] = buildSequence(
            gamma,
            -Math.abs(liftSwing) / 2,
            stepCount
        )
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

/* * *


a - lift-up
b - shove-down
* - retract / power stroke

left-front    |-- a --|-- b --|   *   |   *   |   *   |   *   |
left-middle   |   *   |   *   |-- a --|-- b --|   *   |   *   |
left-back     |   *   |   *   |   *   |   *   |-- a --|-- b --|
right-front   |   *   |-- a --|-- b --|   *   |   *   |   *   |
right-middle  |   *   |   *   |   *   |-- a --|-- b --|   *   |
right-back    |   b   |   *   |   *   |   *   |   *   |-- a --|

 * * */
export default getWalkSequence
