import solveInverseKinematics from "../hexapod/solvers/ik/hexapodSolver"
import CASE1 from "./cases/ikSolver/case1"
import CASE2 from "./cases/ikSolver/case2"
import CASE3 from "./cases/ikSolver/case3"

import { expectToBeEqualPose } from "./helpers"

const CASES = [CASE1, CASE2, CASE3]

test.each(CASES)("IK Solver %p", thisCase => {
    const { dimensions, ikParams } = thisCase.params
    const result = solveInverseKinematics(dimensions, ikParams)
    expectToBeEqualPose(result.pose, thisCase.result.pose)
    expect(result.obtainedSolution).toBe(thisCase.result.obtainedSolution)
})
