import VirtualHexapod from "../hexapod/VirtualHexapod"
import { POSITION_LIST } from "../hexapod/constants"
import { expectToBeEqualPoints } from "./helpers"
import CASE1 from "./cases/VirtualHexapod/patterns/case1"

const CASES = [CASE1]

test.each(CASES)("Should twist or not twist hexapod appropriately: %p", thisCase => {
    const { params, result } = thisCase
    const pose = POSITION_LIST.reduce(
        (pose, position) => ({ ...pose, [position]: params.patternPose }),
        {}
    )
    const virtualHexapod = new VirtualHexapod(params.dimensions, pose)

    virtualHexapod.body.allPointsList.forEach((point, index) =>
        expectToBeEqualPoints(point, result.bodyAllPointsList[index])
    )
    virtualHexapod.groundContactPoints.forEach((point, index) =>
        expectToBeEqualPoints(point, result.groundContactPointsList[index])
    )
    Object.keys(virtualHexapod.localFrame).forEach(axis =>
        expectToBeEqualPoints(
            virtualHexapod.localFrame[axis],
            result.localFrame[axis]
        )
    )

    expect(virtualHexapod.twistProperties.hasTwisted).toBe(result.hasTwisted)
    expect(virtualHexapod.twistProperties.twistedAngle).toBe(result.twistedAngle)
})
