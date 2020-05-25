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

const createVector = (x, y, z, name = "no-name-point", id = "no-id-point") => {
    return {
        x: x,
        y: y,
        z: z,
        id: id,
        name: name,
    }
}

const createHexagon = dimensions => {
    const { front, middle, side } = dimensions

    const verticesList = [
        createVector(middle, 0, 0, "rightMiddleVertex", 0),
        createVector(front, side, 0, "rightFrontVertex", 1),
        createVector(-front, side, 0, "leftFrontVertex", 2),
        createVector(-middle, 0, 0, "leftMiddleVertex", 3),
        createVector(-front, -side, 0, "leftBackVertex", 4),
        createVector(front, -side, 0, "rightBackVertex", 5),
    ]

    const vertices = verticesList.reduce(
        (acc, vertex) => ({ ...acc, [POSITION_LIST[vertex.id]]: vertex }),
        {}
    )
    const head = createVector(0, side, 0, "headPoint", 7)
    const cog = createVector(0, 0, 0, "centerOfGravityPoint", 6)
    const allPointsList = [verticesList, cog, head]

    return {
        dimensions: {
            front: front,
            middle: middle,
            side: side,
        },
        points: {
            verticesList: verticesList,
            vertices: vertices,
            cog: cog,
            head: head,
            allPointsList: allPointsList,
        },
    }
}

export { createVector, createHexagon }
