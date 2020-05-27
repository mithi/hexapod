import CASE1 from "./cases/linkage/case1"
import CASE2 from "./cases/linkage/case2"
import Linkage from "../hexapod/Linkage"
import { POSITION_ID_MAP } from "../hexapod/constants"

const CASES = [CASE1, CASE2]

const areEqualPoints = (point1, point2) => {
    expect(point1.id).toBe(point2.id)
    expect(point1.name).toBe(point2.name)
    expect(point1.x).toBeCloseTo(point2.x)
    expect(point1.y).toBeCloseTo(point2.y)
    expect(point1.z).toBeCloseTo(point2.z)
}

test.each(CASES)("Should Initialize Linkage: %p", thisCase => {
    const { params, result } = thisCase
    const linkage = new Linkage(
        params.dimensions,
        params.position,
        params.bodyContactPoint,
        params.pose
    )

    const { pointsMap, allPointsList } = linkage

    expect(linkage.id).toBe(POSITION_ID_MAP[params.position])
    expect(linkage.name).toBe(POSITION_ID_MAP[params.position] + "Leg")

    expect(linkage.pointNameIdMap).toEqual(result.pointNameIdMap)
    expect(linkage.givenBodyContactPoint).toEqual(linkage.pointsMap.bodyContactPoint)

    expect(pointsMap.bodyContactPoint).toBe(allPointsList[0])
    expect(pointsMap.coxiaPoint).toBe(allPointsList[1])
    expect(pointsMap.femurPoint).toBe(allPointsList[2])
    expect(pointsMap.footTipPoint).toBe(allPointsList[3])

    areEqualPoints(pointsMap.bodyContactPoint, result.bodyContactPoint)
    areEqualPoints(pointsMap.coxiaPoint, result.coxiaPoint)
    areEqualPoints(pointsMap.femurPoint, result.femurPoint)
    areEqualPoints(pointsMap.footTipPoint, result.footTipPoint)
})
