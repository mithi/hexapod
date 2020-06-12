import LinkageIKSolver from "../hexapod/solvers/ik/LinkageIKSolver"
import CAN_REACH_TARGET_CASES from "./cases/LinkageIKSolver/casesReachedTarget"

/**

OTHER CASES TO TEST

When triangle can form but obtainedSolution: false and reachedTarget: false
    When can form triangle but p2 (femurPoint) would be lower than the ground contact point

Edge cases, When triangle can't form: (reachedTarget: true)
    obtainedSolution: false
        when tibia is too long ( femur + pars < tibia )
        when femur is too long ( tibia + pars < femur )
    obtainedSolution: true
        when target ground point is too far (femur + tibia < pars )

 **/

test.each(CAN_REACH_TARGET_CASES)(
    "Leg IK Solver when it is not an edge case %p",
    thisCase => {
        const { coxia, femur, tibia, summa, rho } = thisCase.params

        // prettier-ignore
        const solved = new LinkageIKSolver("NoPositionSpecified").solve(
            coxia, femur, tibia, summa, rho
        )

        expect(solved.beta).toBeCloseTo(thisCase.result.beta)
        expect(solved.gamma).toBeCloseTo(thisCase.result.gamma)
        expect(solved.obtainedSolution).toBe(thisCase.result.obtainedSolution)
        expect(solved.reachedTarget).toBe(thisCase.result.reachedTarget)
    }
)
