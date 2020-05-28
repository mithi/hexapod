import Linkage from "../hexapod/Linkage"
import { NUMBER_OF_LEGS, POSITION_LIST } from "../hexapod/constants"
import * as specificOSolver from "../hexapod/solvers/orientationSolverSpecific"
import CASE1 from "./cases/orientationSolverSpecific/case1"
import CASE2 from "./cases/orientationSolverSpecific/case2"

const CASES = [CASE1, CASE2]

const expectPointsSameValues = (point1, point2) => {
    expect(point1.x).toBeCloseTo(point2.x)
    expect(point1.y).toBeCloseTo(point2.y)
    expect(point1.z).toBeCloseTo(point2.z)
}

test.each(CASES)("Should return the correct orientation properties %p", thisCase => {
    // create legs
    const { legDimensions, legPoses, bodyContactPoints } = thisCase.params
    const legs = [...Array(NUMBER_OF_LEGS).keys()].map(
        i =>
            new Linkage(
                legDimensions,
                POSITION_LIST[i],
                bodyContactPoints[i],
                legPoses[i]
            )
    )
    const [
        normalVector,
        height,
        legsOnGround,
    ] = specificOSolver.computeOrientationProperties(legs)
    expectPointsSameValues(normalVector, thisCase.result.normalVector)

    expect(height).toBeCloseTo(thisCase.result.height)
    const legOnGroundPositions = legsOnGround.map(leg => leg.position)
    expect(legOnGroundPositions).toEqual(thisCase.result.legsOnGroundPositions)
})
