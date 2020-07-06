import getWalkSequence from "../hexapod/solvers/walkSequenceSolver"

const DEFAULT_DIMENSIONS = {
    front: 100,
    side: 100,
    middle: 100,
    coxia: 100,
    femur: 100,
    tibia: 100,
}

const POSITION_NAMES_LIST = [
    "rightMiddle",
    "rightFront",
    "leftFront",
    "leftMiddle",
    "leftBack",
    "rightBack",
]

const cases = [
    {
        params: {
            rx: 0,
            ry: 0,
            legStance: 45,
            hipStance: 45,
            hipSwing: 20,
            liftSwing: 45,
            stepCount: 10,
            dimensions: DEFAULT_DIMENSIONS,
        },
        result: { answer: true },
        description: "first sequence",
    },
]

test.each(cases)("test walkSequence:", example => {
    const sequence = getWalkSequence(example.params)
    const actualStepCount = example.params.stepCount * 4

    POSITION_NAMES_LIST.forEach(position => {
        const alphaSeq = sequence[position].alpha
        const betaSeq = sequence[position].beta
        const gammaSeq = sequence[position].gamma

        expect(alphaSeq).toBeDefined()
        expect(alphaSeq).toHaveLength(actualStepCount)

        expect(betaSeq).toBeDefined()
        expect(betaSeq).toHaveLength(actualStepCount)

        expect(gammaSeq).toBeDefined()
        expect(gammaSeq).toHaveLength(actualStepCount)
    })
})
