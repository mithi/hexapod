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
        const [r0, r1, r2] = transformMatrix.slice(0, 3)
        const [r00, r01, r02, tx] = r0
        const [r10, r11, r12, ty] = r1
        const [r20, r21, r22, tz] = r2

        const newX = this.x * r00 + this.y * r01 + this.z * r02 + tx
        const newY = this.x * r10 + this.y * r11 + this.z * r12 + ty
        const newZ = this.x * r20 + this.y * r21 + this.z * r22 + tz
        return new Vector(newX, newY, newZ, name, id)
    }

    cloneTrot(transformMatrix) {
        return this.newTrot(transformMatrix, this.name, this.id)
    }

    cloneShift(tx, ty, tz) {
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
