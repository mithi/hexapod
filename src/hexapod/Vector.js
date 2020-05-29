import { multiply, transpose, index } from "mathjs"

class Vector {
    constructor(x, y, z, name = "no-name-point", id = "no-id-point") {
        this.x = x
        this.y = y
        this.z = z
        this.name = name
        this.id = id
    }

    newTrot(referenceFrame, name = "unnamed-point", id = "no-id") {
        // given point `point` location wrt a local frame
        // find point in a global frame
        // where the local frame wrt the global frame is defined by
        // parameter `referenceFrame`
        const givenPointVector = transpose([[this.x, this.y, this.z, 1]])
        const resultPointVector = transpose(
            multiply(referenceFrame, givenPointVector)
        )
        return new Vector(
            resultPointVector.subset(index(0, 0)),
            resultPointVector.subset(index(0, 1)),
            resultPointVector.subset(index(0, 2)),
            name,
            id
        )
    }

    cloneTrot(referenceFrame) {
        return this.newTrot(referenceFrame, this.name, this.id)
    }

    cloneShift(tx = 0, ty = 0, tz = 0) {
        return new Vector(this.x + tx, this.y + ty, this.z + tz, this.name, this.id)
    }

    cloneTrotShift(referenceFrame, tx, ty, tz) {
        return this.cloneTrot(referenceFrame).cloneShift(tx, ty, tz)
    }
}

export default Vector
