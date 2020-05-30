const DIMENSIONS = {
    front: 65,
    side: 105,
    middle: 120,
}

const TRANSFORM_PARAMS = {
    rx: -7,
    ry: 12.5,
    rz: 23,
    tx: 0,
    ty: 0,
    tz: 73.49,
}
const POINTS_LIST = [
    { x: 123.75, y: +52.37, z: +41.77, name: "rightMiddleVertex", id: 0 },
    { x: +34.27, y: +129.39, z: +52.3, name: "rightFrontVertex", id: 1 },
    { x: -82.56, y: +82.13, z: +84.195, name: "leftFrontVertex", id: 2 },
    { x: -91.94, y: -34.88, z: +100.66, name: "leftMiddleVertex", id: 3 },
    { x: -2.45, y: -111.9, z: +90.13, name: "leftBackVertex", id: 4 },
    { x: 114.37, y: -64.64, z: +58.23, name: "rightBackVertex", id: 5 },
    { x: +15.91, y: +8.74, z: +71.21, name: "centerOfGravityPoint", id: 6 },
    { x: -24.15, y: +105.76, z: +68.25, name: "headPoint", id: 7 },
]

const CASE = {
    params: { transformParams: TRANSFORM_PARAMS, dimensions: DIMENSIONS },
    result: { points: POINTS_LIST },
    description: "Shift first then rotate.",
}

export default CASE
