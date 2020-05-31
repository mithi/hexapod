import ANGLE_BETWEEN_CASES from "./cases/geometry/angleBetween/cases"
import PROJECTED_VECTOR_CASES from "./cases/geometry/projectedVectorOntoPlane/cases"
import { angleBetween, projectedVectorOntoPlane } from "../hexapod/geometry"
import { expectVectorsToHaveSameXYZ } from "./helpers"

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
