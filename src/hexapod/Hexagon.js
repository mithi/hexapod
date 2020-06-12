/* * *
  ..................
   Hexagon
  ..................

         |-f-|
         *---*---*--------   * f - front
        /    |    \     |    * s - side
       /     |     \    s    * m - middle
      /      |      \   |
     *------cog------* ---
      \      |      /|
       \     |     / |
        \    |    /  |
         *---*---*   |
             |       |
             |---m---|


      (leftFront)     (rightFront)
           v2          v1
            \   head  /
             *---*---*
            /    |    \
  (left    /     |     \
  Middle) /      |      \
    v3 --*------cog------*-- v0 (rightMiddle)
          \      |      /
           \     |     /
            \    |    /
             *---*---*
            /         \
          v4           v5
       (leftBack)   (rightBack)

 * * */
import { POSITION_NAMES_LIST } from "./constants"
import Vector from "./Vector"

class Hexagon {
    dimensions
    verticesList
    head
    cog
    constructor(dimensions, flags = { hasNoPoints: false }) {
        this.dimensions = dimensions

        if (flags.hasNoPoints) {
            return
        }

        const { front, middle, side } = this.dimensions
        const vertexX = [middle, front, -front, -middle, -front, front]
        const vertexY = [0, side, side, 0, -side, -side]

        this.verticesList = POSITION_NAMES_LIST.map(
            (position, i) => new Vector(vertexX[i], vertexY[i], 0, `${position}Vertex`, i)
        )
        this.head = new Vector(0, side, 0, "headPoint", 7)
        this.cog = new Vector(0, 0, 0, "centerOfGravityPoint", 6)
    }

    get closedPointsList() {
        return [...this.verticesList, this.verticesList[0]]
    }

    get vertices() {
        // a hash mapping the position ie(right middle) to the vertex point
        return this.verticesList.reduce(
            (verticesMap, vertex) => ({
                ...verticesMap,
                [POSITION_NAMES_LIST[vertex.id]]: vertex,
            }),
            {}
        )
    }

    get allPointsList() {
        return [...this.verticesList, this.cog, this.head]
    }

    cloneTrotShift(transformMatrix, tx, ty, tz) {
        let clone = new Hexagon(this.dimensions, { hasNoPoints: true })
        clone.cog = this.cog.cloneTrotShift(transformMatrix, tx, ty, tz)
        clone.head = this.head.cloneTrotShift(transformMatrix, tx, ty, tz)
        clone.verticesList = this.verticesList.map(point =>
            point.cloneTrotShift(transformMatrix, tx, ty, tz)
        )
        return clone
    }

    cloneTrot(transformMatrix) {
        return this.cloneTrotShift(transformMatrix, 0, 0, 0)
    }

    cloneShift(tx, ty, tz) {
        let clone = new Hexagon(this.dimensions, { hasNoPoints: true })
        clone.cog = this.cog.cloneShift(tx, ty, tz)
        clone.head = this.head.cloneShift(tx, ty, tz)
        clone.verticesList = this.verticesList.map(point => point.cloneShift(tx, ty, tz))
        return clone
    }
}

export default Hexagon
