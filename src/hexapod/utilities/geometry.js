import { sin, cos, unit, matrix, multiply, transpose, index } from "mathjs"

function getSinCos(theta) {
    return [sin(unit(theta, "deg")), cos(unit(theta, "deg"))]
}

function tRotXframe(theta, x = 0, y = 0, z = 0) {
    const [s, c] = getSinCos(theta)
    return matrix([
        [1, 0, 0, x],
        [0, c, -s, y],
        [0, s, c, z],
        [0, 0, 0, 1],
    ])
}

function tRotYframe(theta, x = 0, y = 0, z = 0) {
    const [s, c] = getSinCos(theta)
    return matrix([
        [c, 0, s, x],
        [0, 1, 0, y],
        [-s, 0, c, z],
        [0, 0, 0, 1],
    ])
}

function tRotZframe(theta, x = 0, y = 0, z = 0) {
    const [s, c] = getSinCos(theta)
    return matrix([
        [c, -s, 0, x],
        [s, c, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1],
    ])
}

function pointWrtFrame(point, referenceFrame, name = "unnamed-point", id = "no-id") {
    // given point `point` location wrt a local frame
    // find point in a global frame
    // where the local frame wrt the global frame is defined by
    // parameter `referenceFrame`
    const givenPointVector = transpose([[point.x, point.y, point.z, 1]])
    const resultPointVector = transpose(multiply(referenceFrame, givenPointVector))
    return {
        x: resultPointVector.subset(index(0, 0)),
        y: resultPointVector.subset(index(0, 1)),
        z: resultPointVector.subset(index(0, 2)),
        name: name,
        id: id,
    }
}

export { tRotXframe, tRotYframe, tRotZframe, pointWrtFrame }
