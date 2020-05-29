/* * *
 * ..................
 *  Hexagon
 * ..................
 *
 *        |-f-|
 *        *---*---*--------   * f - front
 *       /    |    \     |    * s - side
 *      /     |     \    s    * m - middle
 *     /      |      \   |
 *    *------cog------* ---
 *     \      |      /|
 *      \     |     / |
 *       \    |    /  |
 *        *---*---*   |
 *            |       |
 *            |---m---|
 *
 *     y axis
 *     ^
 *     |
 *     |
 *     *-----> x axis
 *   (cog)
 *
 *
 *  Relative x-axis, for each attached linkage
 *
 *          x2          x1
 *           \   head  /
 *            *---*---*
 *           /    |    \
 *          /     |     \
 *         /      |      \
 *   x3 --*------cog------*-- x0
 *         \      |      /
 *          \     |     /
 *           \    |    /
 *            *---*---*
 *           /         \
 *         x4           x5
 *
 * * */
import { POSITION_LIST } from "./constants"
import { pointCloneTrotShift, createVector } from "./utilities/geometry"

class Hexagon {
    constructor(dimensions) {
        this.dimensions = dimensions
        const { front, middle, side } = this.dimensions
        const vertexX = [middle, front, -front, -middle, -front, front]
        const vertexY = [0, side, side, 0, -side, -side]

        this.verticesList = POSITION_LIST.map((position, i) =>
            createVector(vertexX[i], vertexY[i], 0, `${position}Vertex`, i)
        )
        this.head = createVector(0, side, 0, "headPoint", 7)
        this.cog = createVector(0, 0, 0, "centerOfGravityPoint", 6)
    }

    get closedPointsList() {
        return [...this.verticesList, this.verticesList[0]]
    }

    get vertices() {
        // a hash mapping the position ie(right middle) to the vertex point
        return this.verticesList.reduce(
            (acc, vertex) => ({ ...acc, [POSITION_LIST[vertex.id]]: vertex }),
            {}
        )
    }

    get allPointsList() {
        return [...this.verticesList, this.cog, this.head]
    }

    cloneTrotShift(frame, tx = 0, ty = 0, tz = 0) {
        let clone = new Hexagon(this.dimensions)
        clone.cog = pointCloneTrotShift(this.cog, frame, tx, ty, tz)
        clone.head = pointCloneTrotShift(this.head, frame, tx, ty, tz)
        clone.verticesList = this.verticesList.map(point =>
            pointCloneTrotShift(point, frame, tx, ty, tz)
        )
        return clone
    }
}

export { createVector, Hexagon }
