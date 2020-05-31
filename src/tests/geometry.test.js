import {
    angleBetween,
    projectedVectorOntoPlane,
    getNormalofThreePoints,
    angleOppositeOfLastSide,
    isCounterClockwise,
} from "../hexapod/geometry"
import { expectVectorsToHaveSameXYZ } from "./helpers"
import {
    ANGLE_BETWEEN_CASES,
    PROJECTED_VECTOR_CASES,
    NORMAL_OF_THREE_POINTS_CASES,
    ANGLE_OPPOSITE_LAST_SIDE_CASES,
    IS_CCW_CASES,
} from "./cases/geometry"

test.each(ANGLE_BETWEEN_CASES)(
    "Should yield correct results for angleBetween %p",
    thisCase => {
        const { vectorA, vectorB } = thisCase.params
        const angle = angleBetween(vectorA, vectorB)
        expect(angle).toBeCloseTo(thisCase.result.angle)
    }
)

test.each(PROJECTED_VECTOR_CASES)(
    "Should yield correct results for projectedVectorOntoPlane %p",
    thisCase => {
        const { vectorV, vectorN } = thisCase.params
        const vectorProjected = projectedVectorOntoPlane(vectorV, vectorN)
        expectVectorsToHaveSameXYZ(vectorProjected, thisCase.result.vectorProjected)
    }
)

test.each(NORMAL_OF_THREE_POINTS_CASES)(
    "Should yield correct normal vector given three points defining a plane %p",
    thisCase => {
        const { a, b, c } = thisCase.params
        const normalVector = getNormalofThreePoints(a, b, c)
        expectVectorsToHaveSameXYZ(normalVector, thisCase.result.normalVector)
    }
)

test.each(ANGLE_OPPOSITE_LAST_SIDE_CASES)(
    "Should yield correct angle of given side given three sides of the triangle %p",
    thisCase => {
        const { sideA, sideB, sideC } = thisCase.params
        const angle = angleOppositeOfLastSide(sideA, sideB, sideC)
        expect(angle).toBeCloseTo(thisCase.result.angle)
    }
)

test.each(IS_CCW_CASES)(
    "Should return whether or not sweeping from u to v about normal n is counterclockwise",
    thisCase => {
        const { vectorA, vectorB, vectorN } = thisCase.params
        const isCCW = isCounterClockwise(vectorA, vectorB, vectorN)
        expect(isCCW).toBe(thisCase.result.isCCW)
    }
)
