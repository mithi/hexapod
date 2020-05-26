import CASE1 from "./cases/linkage/case1"
import CASE2 from "./cases/linkage/case2"
import Linkage from "../hexapod/Linkage"
import { POSITION_ID_MAP } from "../hexapod/constants"

const CASES = [CASE1, CASE2]

const isSamePoint = (point1, point2) => {
    expect(point1.id).toBe(point2.id)
    expect(point1.name).toBe(point2.name)
    expect(point1.x).toBeCloseTo(point2.x)
    expect(point1.y).toBeCloseTo(point2.y)
    expect(point1.z).toBeCloseTo(point2.z)
}

test.each(CASES)("Should Initialize Linkage: %p", thisCase => {
    const linkage = new Linkage(
        thisCase.params.dimensions,
        thisCase.params.position,
        thisCase.params.bodyContactPoint,
        thisCase.params.pose
    )

    expect(linkage.dimensions.coxia).toBeCloseTo(thisCase.params.dimensions.coxia)
    expect(linkage.dimensions.femur).toBeCloseTo(thisCase.params.dimensions.femur)
    expect(linkage.dimensions.tibia).toBeCloseTo(thisCase.params.dimensions.tibia)

    expect(linkage.pose.alpha).toBeCloseTo(thisCase.params.pose.alpha)
    expect(linkage.pose.beta).toBeCloseTo(thisCase.params.pose.beta)
    expect(linkage.pose.gamma).toBeCloseTo(thisCase.params.pose.gamma)

    expect(linkage.position).toBe(thisCase.params.position)
    expect(linkage.id).toBe(POSITION_ID_MAP[thisCase.params.position])

    expect(linkage.pointNameIdMap).toEqual(thisCase.result.pointNameIdMap)
    expect(linkage.givenBodyContactPoint).toEqual(linkage.pointsMap.bodyContact)

    expect(linkage.pointsMap.bodyContact).toBe(linkage.allPointsList[0])
    expect(linkage.pointsMap.coxia).toBe(linkage.allPointsList[1])
    expect(linkage.pointsMap.femur).toBe(linkage.allPointsList[2])
    expect(linkage.pointsMap.footTip).toBe(linkage.allPointsList[3])

    isSamePoint(linkage.pointsMap.bodyContact, thisCase.result.bodyContactPoint)
    isSamePoint(linkage.pointsMap.coxia, thisCase.result.coxiaPoint)
    isSamePoint(linkage.pointsMap.femur, thisCase.result.femurPoint)
    isSamePoint(linkage.pointsMap.footTip, thisCase.result.footTipPoint)
})
