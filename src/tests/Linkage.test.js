import CASE1 from "./cases/linkage/case1"
import CASE2 from "./cases/linkage/case2"
import Linkage, { LEG_ID_MAPS } from "../hexapod/Linkage"

const CASES = [CASE1, CASE2]

const isSamePoint = (point1, point2) => {
    expect(point1.id).toBe(point2.id)
    expect(point1.name).toBe(point2.name)
    expect(point1.x).toBeCloseTo(point2.x)
    expect(point1.y).toBeCloseTo(point2.y)
    expect(point1.z).toBeCloseTo(point2.z)
}

test.each(CASES)("Preliminary properties were set correctly", thisCase => {
    const linkage = new Linkage(
        thisCase.params.coxia,
        thisCase.params.femur,
        thisCase.params.tibia,
        thisCase.params.name,
        thisCase.params.bodyContactPoint,
        thisCase.params.alpha,
        thisCase.params.beta,
        thisCase.params.gamma
    )
    expect(linkage.coxia).toBeCloseTo(thisCase.params.coxia)
    expect(linkage.femur).toBeCloseTo(thisCase.params.femur)
    expect(linkage.tibia).toBeCloseTo(thisCase.params.tibia)
    expect(linkage.name).toBe(thisCase.params.name)
    expect(linkage.id).toBe(LEG_ID_MAPS[thisCase.params.name])

    expect(linkage.pointNameIdMap).toEqual(thisCase.answer.pointNameIdMap)
    expect(linkage.startingBodyContactPoint).toEqual(linkage.pointsMap.bodyContact)

    expect(linkage.pointsMap.bodyContact).toBe(linkage.pointsList[0])
    expect(linkage.pointsMap.coxia).toBe(linkage.pointsList[1])
    expect(linkage.pointsMap.femur).toBe(linkage.pointsList[2])
    expect(linkage.pointsMap.footTip).toBe(linkage.pointsList[3])

    isSamePoint(linkage.pointsMap.bodyContact, thisCase.answer.bodyContactPoint)
    isSamePoint(linkage.pointsMap.coxia, thisCase.answer.coxiaPoint)
    isSamePoint(linkage.pointsMap.femur, thisCase.answer.femurPoint)
    isSamePoint(linkage.pointsMap.footTip, thisCase.answer.footTipPoint)
})
