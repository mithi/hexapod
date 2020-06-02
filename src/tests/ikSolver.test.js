import solveInverseKinematics from "../hexapod/solvers/ikSolver"
import CASE1 from "./cases/ikSolver/case1"
import { expectToBeEqualPose } from "./helpers"

const CASES = [CASE1]

test.each(CASES)("IK Solver %p", thisCase => {
    const { dimensions, ikParams } = thisCase.params
    const result = solveInverseKinematics(dimensions, ikParams)
    expectToBeEqualPose(result.pose, thisCase.result.pose)
    expect(result.obtainedSolution).toBe(thisCase.result.obtainedSolution)
})
