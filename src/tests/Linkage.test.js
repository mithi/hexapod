import CASE1 from "./cases/linkage/case1"
import CASE2 from "./cases/linkage/case2"
import Linkage from "../hexapod/Linkage"
import { POSITION_NAME_TO_ID_MAP } from "../hexapod/constants"
import { expectToBeEqualPoints } from "./helpers"
const CASES = [CASE1, CASE2]

test.each(CASES)("Should Initialize Linkage: %p", thisCase => {
    const { params, result } = thisCase
    const linkage = new Linkage(
        params.dimensions,
        params.position,
        params.bodyContactPoint,
        params.pose
    )

    const { pointsMap, allPointsList } = linkage

    expect(linkage.id).toBe(POSITION_NAME_TO_ID_MAP[params.position])
    expect(linkage.name).toBe(params.position + "Leg")
    expect(pointsMap.bodyContactPoint).toBe(allPointsList[0])
    expect(pointsMap.coxiaPoint).toBe(allPointsList[1])
    expect(pointsMap.femurPoint).toBe(allPointsList[2])
    expect(pointsMap.footTipPoint).toBe(allPointsList[3])

    expectToBeEqualPoints(pointsMap.bodyContactPoint, result.bodyContactPoint)
    expectToBeEqualPoints(pointsMap.coxiaPoint, result.coxiaPoint)
    expectToBeEqualPoints(pointsMap.femurPoint, result.femurPoint)
    expectToBeEqualPoints(pointsMap.footTipPoint, result.footTipPoint)
})
