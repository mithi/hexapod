import getWalkSequence from "../hexapod/solvers/walkSequenceSolver"
import { DEFAULT_DIMENSIONS, DEFAULT_GAIT_PARAMS } from "../templates"
import { POSITION_NAMES_LIST } from "../hexapod/constants"

const JOINT_NAMES = ["alpha", "beta", "gamma"]

const cases = [
    { gaitType: "tripod", walkMode: "walking", frameMultiplier: 4 },
    { gaitType: "ripple", walkMode: "walking", frameMultiplier: 6 },
    { gaitType: "tripod", walkMode: "rotating", frameMultiplier: 4 },
]

test.each(cases)("generates a reachable IK gait", example => {
    const sequence = getWalkSequence(
        DEFAULT_DIMENSIONS,
        DEFAULT_GAIT_PARAMS,
        example.gaitType,
        example.walkMode
    )

    expect(sequence).not.toBeNull()
    expectSequence(sequence, DEFAULT_GAIT_PARAMS.stepCount * example.frameMultiplier)
})

const expectSequence = (sequence, expectedFrameCount) => {
    POSITION_NAMES_LIST.forEach(position => {
        const legSequence = sequence[position]
        expect(legSequence).toBeDefined()

        JOINT_NAMES.forEach(joint => {
            expect(legSequence[joint]).toHaveLength(expectedFrameCount)
            legSequence[joint].forEach(angle => expect(Number.isFinite(angle)).toBe(true))
        })
    })
}
