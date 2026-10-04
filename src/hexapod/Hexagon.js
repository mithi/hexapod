/*
 * Simplified chassis planform with six hip mounts on the two long side rails.
 * The leg mount points are separate from the chassis outline so front/rear
 * legs sit along the sides instead of at body corners.
 *
 * Coordinates use +Y as the front and +X as the right side. `front` and
 * `middle` are the right/left half-spacing of the mounts; `side` is the
 * front/middle and middle/rear mount spacing.
 */
import { POSITION_NAMES_LIST } from "./constants"
import Vector from "./Vector"

const getOutlineEndMargin = ({ front, middle }) => Math.max(front, middle) / 2

class Hexagon {
    dimensions
    verticesList
    outlinePointsList
    head
    cog

    constructor(dimensions, flags = { hasNoPoints: false }) {
        this.dimensions = dimensions

        if (flags.hasNoPoints) {
            return
        }

        const { front, middle, side } = this.dimensions
        const mountX = [middle, front, -front, -middle, -front, front]
        const mountY = [0, side, side, 0, -side, -side]
        this.verticesList = POSITION_NAMES_LIST.map(
            (position, index) =>
                new Vector(
                    mountX[index],
                    mountY[index],
                    0,
                    `${position}Vertex`,
                    index
                )
        )

        // The chassis ends extend beyond the front/rear hip mounts, leaving all
        // six mounts on the left/right side rails rather than at chassis corners.
        const bodyEnd = side + getOutlineEndMargin(this.dimensions)
        const bodyHalfWidth = Math.max(front, middle)
        this.outlinePointsList = [
            new Vector(bodyHalfWidth, bodyEnd, 0, "bodyOutlineRightFront"),
            new Vector(bodyHalfWidth, -bodyEnd, 0, "bodyOutlineRightRear"),
            new Vector(-bodyHalfWidth, -bodyEnd, 0, "bodyOutlineLeftRear"),
            new Vector(-bodyHalfWidth, bodyEnd, 0, "bodyOutlineLeftFront"),
        ]
        this.head = new Vector(0, side, 0, "headPoint", 7)
        this.cog = new Vector(0, 0, 0, "centerOfGravityPoint", 6)
    }

    get closedPointsList() {
        return [...this.outlinePointsList, this.outlinePointsList[0]]
    }

    get allPointsList() {
        return [...this.verticesList, this.cog, this.head]
    }

    cloneTrotShift(transformMatrix, tx, ty, tz) {
        return this._doTransform("cloneTrotShift", transformMatrix, tx, ty, tz)
    }

    cloneTrot(transformMatrix) {
        return this._doTransform("cloneTrot", transformMatrix)
    }

    cloneShift(tx, ty, tz) {
        return this._doTransform("cloneShift", tx, ty, tz)
    }

    _doTransform(transformFunction, ...args) {
        let clone = new Hexagon(this.dimensions, { hasNoPoints: true })
        clone.cog = this.cog[transformFunction](...args)
        clone.head = this.head[transformFunction](...args)
        clone.verticesList = this.verticesList.map(point =>
            point[transformFunction](...args)
        )
        clone.outlinePointsList = this.outlinePointsList.map(point =>
            point[transformFunction](...args)
        )
        return clone
    }
}

export default Hexagon
