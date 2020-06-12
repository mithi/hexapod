import { isStable } from "../hexapod/solvers/orient/orientSolverHelpers"

const cases = [
    {
        p0: { x: 300.0, y: 0.0, z: -100.0 },
        p1: { x: 241.42, y: 241.42, z: -100 },
        p2: { x: -300.0, y: 0, z: -100.0 },
        answer: true,
    },
]
test.each(cases)("test isStable:", example =>
    expect(isStable(example.p0, example.p1, example.p2)).toBe(example.answer)
)
