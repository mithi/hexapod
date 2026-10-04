import Hexagon from "../hexapod/Hexagon"
import { tRotXYZmatrix } from "../hexapod/geometry"
import { DEFAULT_BODY_DIMENSIONS } from "../templates"
import { expectToBeEqualPoints } from "./helpers"
import CASE1 from "./cases/Hexagon/case1"

const CASES = [CASE1]

test.each(CASES)(
    "keeps hip-mount transform positions aligned: %p",
    thisCase => {
        const { rx, ry, rz, tx, ty, tz } = thisCase.params.transformParams
        const startHexagon = new Hexagon(thisCase.params.dimensions)
        const transformMatrix = tRotXYZmatrix(rx, ry, rz)
        // prettier-ignore
        const testPoints = startHexagon
            .cloneShift(tx, ty, tz)
            .cloneTrot(transformMatrix).allPointsList

        thisCase.result.points.forEach((expectedPoint, index) => {
            expectToBeEqualPoints(testPoints[index], expectedPoint)
        })
    }
)

test("places the six hip mounts along the two chassis sides", () => {
    const body = new Hexagon(DEFAULT_BODY_DIMENSIONS)
    const mountsByName = Object.fromEntries(
        body.verticesList.map(point => [point.name.replace("Vertex", ""), point])
    )
    const { front, middle, side } = DEFAULT_BODY_DIMENSIONS
    const halfWidth = Math.max(front, middle)
    const bodyEnd = side + halfWidth / 2

    expect(mountsByName.rightFront.x).toBe(halfWidth)
    expect(mountsByName.rightMiddle.x).toBe(halfWidth)
    expect(mountsByName.rightBack.x).toBe(halfWidth)
    expect(mountsByName.leftFront.x).toBe(-halfWidth)
    expect(mountsByName.leftMiddle.x).toBe(-halfWidth)
    expect(mountsByName.leftBack.x).toBe(-halfWidth)

    expect(mountsByName.rightFront.y).toBe(side)
    expect(mountsByName.rightMiddle.y).toBe(0)
    expect(mountsByName.rightBack.y).toBe(-side)
    const allMountsAreOnTheSideRails = Object.values(mountsByName).every(
        point => Math.abs(point.y) < bodyEnd
    )
    expect(allMountsAreOnTheSideRails).toBe(true)
})
