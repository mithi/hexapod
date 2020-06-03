import Hexagon from "../hexapod/Hexagon"
import { expectToBeEqualPoints } from "./helpers"
import CASE1 from "./cases/Hexagon/case1"

const CASES = [CASE1]

test.each(CASES)(
    "When shifted and then rotated, the hexagon's points must be in the intended locations %p",
    thisCase => {
        const { rx, ry, rz, tx, ty, tz } = thisCase.params.transformParams
        const startHexagon = new Hexagon(thisCase.params.dimensions)

        // prettier-ignore
        const testPoints = startHexagon
            .cloneShift(tx, ty, tz)
            .cloneRotXYZ(rx, ry, rz).allPointsList

        thisCase.result.points.forEach((expectedPoint, index) => {
            expectToBeEqualPoints(testPoints[index], expectedPoint)
        })
    }
)
