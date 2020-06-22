import Vector from "./Vector"

const degrees = thetaRadians => (thetaRadians * 180) / Math.PI

const radians = thetaDegrees => (thetaDegrees * Math.PI) / 180

const isTriangle = (a, b, c) => a + b > c && a + c > b && b + c > a

const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z

const vectorLength = v => Math.sqrt(dot(v, v))

const isCounterClockwise = (a, b, n) => dot(a, cross(b, n)) > 0

const vectorFromTo = (a, b) => new Vector(b.x - a.x, b.y - a.y, b.z - a.z)

const scaleVector = (v, d) => new Vector(d * v.x, d * v.y, d * v.z)

const addVectors = (a, b) => new Vector(a.x + b.x, a.y + b.y, a.z + b.z)

const getUnitVector = v => scaleVector(v, 1 / vectorLength(v))

const cross = (a, b) => {
    const x = a.y * b.z - a.z * b.y
    const y = a.z * b.x - a.x * b.z
    const z = a.x * b.y - a.y * b.x
    return new Vector(x, y, z)
}

const getNormalofThreePoints = (a, b, c) => {
    const ab = vectorFromTo(a, b)
    const ac = vectorFromTo(a, c)
    const n = cross(ab, ac)
    const len_n = vectorLength(n)
    const unit_n = scaleVector(n, 1 / len_n)

    return unit_n
}

const acosDegrees = ratio => {
    const thetaRadians = Math.acos(ratio)

    // mimicks behavior of python numpy acos
    if (isNaN(thetaRadians)) {
        return 0
    }

    return degrees(thetaRadians)
}

const angleOppositeOfLastSide = (a, b, c) => {
    if (a === 0 || b === 0) {
        return null
    }

    const cosTheta = (a * a + b * b - c * c) / (2 * a * b)
    return acosDegrees(cosTheta)
}

const angleBetween = (a, b) => {
    if (vectorLength(a) === 0 || vectorLength(b) === 0) {
        return 0
    }

    const cosTheta = dot(a, b) / Math.sqrt(dot(a, a) * dot(b, b))
    return acosDegrees(cosTheta)
}

// u is the vector, n is the plane normal
const projectedVectorOntoPlane = (u, n) => {
    const s = dot(u, n) / dot(n, n)
    const tempVector = scaleVector(n, s)
    return vectorFromTo(tempVector, u)
}

const getSinCos = theta => [Math.sin(radians(theta)), Math.cos(radians(theta))]

const IDENTITY_MATRIX_4x4 = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]

const uniformMatrix4x4 = d => {
    const dRow = [d, d, d, d]
    return [dRow.slice(), dRow.slice(), dRow.slice(), dRow.slice()]
}

const add = (a, b) => a + b
const multiply = (a, b) => a * b

const operate4x4 = (matrixA, matrixB, operation) => {
    let resultMatrix = uniformMatrix4x4(null)
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            resultMatrix[i][j] = operation.call(null, matrixA[i][j], matrixB[i][j])
        }
    }
    return resultMatrix
}

const dotMultiply4x4 = (matrixA, matrixB) => {
    return operate4x4(matrixA, matrixB, multiply)
}

const add4x4 = (matrixA, matrixB) => {
    return operate4x4(matrixA, matrixB, add)
}

const multiply4x4 = (matrixA, matrixB) => {
    let resultMatrix = uniformMatrix4x4(null)

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            resultMatrix[i][j] =
                matrixA[i][0] * matrixB[0][j] +
                matrixA[i][1] * matrixB[1][j] +
                matrixA[i][2] * matrixB[2][j] +
                matrixA[i][3] * matrixB[3][j]
        }
    }

    return resultMatrix
}

function tRotXmatrix(theta, tx = 0, ty = 0, tz = 0) {
    const [s, c] = getSinCos(theta)

    return [
        [1, 0, 0, tx],
        [0, c, -s, ty],
        [0, s, c, tz],
        [0, 0, 0, 1],
    ]
}

function tRotYmatrix(theta, tx = 0, ty = 0, tz = 0) {
    const [s, c] = getSinCos(theta)
    return [
        [c, 0, s, tx],
        [0, 1, 0, ty],
        [-s, 0, c, tz],
        [0, 0, 0, 1],
    ]
}

function tRotZmatrix(theta, tx = 0, ty = 0, tz = 0) {
    const [s, c] = getSinCos(theta)
    return [
        [c, -s, 0, tx],
        [s, c, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1],
    ]
}

const tRotXYZmatrix = (xTheta, yTheta, zTheta) => {
    const rx = tRotXmatrix(xTheta)
    const ry = tRotYmatrix(yTheta)
    const rz = tRotZmatrix(zTheta)
    const rxy = multiply4x4(rx, ry)
    const rxyz = multiply4x4(rxy, rz)
    return rxyz
}

const skew = p => [
    [0, -p.z, p.y, 0],
    [p.z, 0, -p.x, 0],
    [-p.y, p.x, 0, 0],
    [0, 0, 0, 1],
]

const matrixToAlignVectorAtoB = (a, b) => {
    const v = cross(a, b)
    const s = vectorLength(v)
    // When angle between a and b is zero or 180 degrees
    // cross product is 0, R = I
    if (s === 0) {
        return IDENTITY_MATRIX_4x4
    }

    const c = dot(a, b)
    const vx = skew(v)
    const d = (1 - c) / (s * s)
    const vx2 = multiply4x4(vx, vx)
    const dMatrix = uniformMatrix4x4(d)
    const dvx2 = dotMultiply4x4(vx2, dMatrix)
    const temp = add4x4(IDENTITY_MATRIX_4x4, vx)
    const transformMatrix = add4x4(temp, dvx2)
    return transformMatrix
}

export {
    degrees,
    radians,
    isTriangle,
    dot,
    cross,
    getNormalofThreePoints,
    scaleVector,
    vectorFromTo,
    addVectors,
    getUnitVector,
    projectedVectorOntoPlane,
    vectorLength,
    angleBetween,
    angleOppositeOfLastSide,
    isCounterClockwise,
    tRotXmatrix,
    tRotYmatrix,
    tRotZmatrix,
    tRotXYZmatrix,
    skew,
    matrixToAlignVectorAtoB,
    multiply4x4,
}
