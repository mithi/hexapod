import VirtualHexapod from "../hexapod/VirtualHexapod"
import { expectToBeEqualPoints, expectVectorsToHaveSameXYZ } from "./helpers"
import CASE1 from "./cases/VirtualHexapod/forwardKinematics/case1"
import CASE2 from "./cases/VirtualHexapod/forwardKinematics/case2"

const CASES = [CASE1, CASE2]
test.each(CASES)("Should compute correct body, ground and local axes: %p", thisCase => {
    const { params, result } = thisCase

    const virtualHexapod = new VirtualHexapod(params.dimensions, params.pose)
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
