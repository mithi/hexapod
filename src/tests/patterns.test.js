/* * * *
  CASES for the patterns page
    1: all alpha != 0 and will twist
      a. femur points on the ground, foot tip, coxia and body contact not on ground
         (body plane not on ground)
         {alpha: 0, beta: -51, gamma: 178 }
      b. foot tip is on the ground, (body plane not on ground)
         {alpha: 30, beta: 38, gamma: -34}
      c: body plane is on the ground
    2. all alpha != 0 and will NOT twist because body plane is on ground
      a. all coxiaPoint on ground, femurPoint Not on ground
        {alpha: 19, beta: 98, gamma: -21}
      b: all femur point on ground, but coxia point also on ground
        { alpha: -45, beta: 0, gamma: 162 }
    3. all alpha == 0 will NOT twist on ALL cases

    All alphas are the same when using the patterns page, we need a separate test suite
    for the kinematics and inverse kinematics page, where each leg angles can be set individually
 * * * */
import VirtualHexapod from "../hexapod/VirtualHexapod"
import { POSITION_NAMES_LIST } from "../hexapod/constants"
import { expectToBeEqualPoints, expectVectorsToHaveSameXYZ } from "./helpers"
import CASE1 from "./cases/VirtualHexapod/patterns/case1"
import CASE2 from "./cases/VirtualHexapod/patterns/case2"

const CASES = [CASE1, CASE2]
test.each(CASES)("Should twist or not twist hexapod appropriately: %p", thisCase => {
    const { params, result } = thisCase
    const pose = POSITION_NAMES_LIST.reduce(
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
    Object.keys(virtualHexapod.localAxes).forEach(axis =>
        expectVectorsToHaveSameXYZ(virtualHexapod.localAxes[axis], result.localAxes[axis])
    )
})
