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
const DEFAULT_DIMENSIONS = {
    front: 100,
    side: 100,
    middle: 100,
    coxia: 100,
    femur: 100,
    tibia: 100,
}

const getWalkSequence = (
    params = {
        rx: 0,
        ry: 0,
        tz: -0.5,
        legStance: 45,
        hipStance: 45,
        hipSwing: 20,
        liftSwing: 20,
        stepCount: 40,
        dimensions: DEFAULT_DIMENSIONS,
    }
) => {
    const { hipStance, rx, ry, tz, legStance, dimensions } = params

    const rawIKparams = {
        tx: 0,
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
        return {
            poseSequence: null,
            obtainedSolution: false,
            message: ikSolver.message,
            hasLegsOffGround: ikSolver.hasLegsOffGround,
        }
    }

    const { hipSwing, liftSwing, stepCount } = params

    const { forwardAlphaSeqs, liftBetaSeqs, liftGammaSeqs } = buildSequences(
        ikSolver.pose,
        liftSwing,
        hipSwing,
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

const buildSequences = (startPose, liftSwing, hipSwing, stepCount) => {
    const doubleStepCount = 2 * stepCount
    const aHipSwing = Math.abs(hipSwing)

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

export default getWalkSequence
