import { multiply, transpose, index } from "mathjs"

class Vector {
    constructor(x, y, z, name = "no-name-point", id = "no-id-point") {
        this.x = x
        this.y = y
        this.z = z
        this.name = name
        this.id = id
    }

    newTrot(transformMatrix, name = "unnamed-point", id = "no-id") {
        // given point `point` location wrt a local axes
        // coordinate frame
        // find point in a global axes coordinate frame
        // where the local axes wrt the global frame is defined by
        // parameter transformMatrix
        const givenPointColumn = transpose([[this.x, this.y, this.z, 1]])
        const resultPointColumn = multiply(transformMatrix, givenPointColumn)
        return new Vector(
            resultPointColumn.subset(index(0, 0)),
            resultPointColumn.subset(index(1, 0)),
            resultPointColumn.subset(index(2, 0)),
            name,
            id
        )
    }

    cloneTrot(transformMatrix) {
        return this.newTrot(transformMatrix, this.name, this.id)
    }

    cloneShift(tx, ty, tz, debugObject = { debugString: " "}) {
        if (this.name === "rightMiddle-bodyContactPoint") {
            debugObject.debugString += `inCloneShift(leg): \n x: ${this.x} tx: ${tx} \n\n`
        }

        return new Vector(this.x + tx, this.y + ty, this.z + tz, this.name, this.id)
    }

    cloneTrotShift(transformMatrix, tx, ty, tz) {
        return this.cloneTrot(transformMatrix).cloneShift(tx, ty, tz)
    }

    toMarkdownString() {
        const x = this.x.toFixed(2)
        const y = this.y.toFixed(2)
        const z = this.z.toFixed(2)
        const markdownString = `${this.name}\n\n(x: ${x}, y: ${y}, z: ${z})`
        return markdownString
    }
}

export default Vector
