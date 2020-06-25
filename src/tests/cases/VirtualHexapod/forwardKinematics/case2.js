const POSE = {
    rightMiddle: { alpha: 0, beta: 0, gamma: 0 },
    rightFront: { alpha: -75.01, beta: 0, gamma: 0 },
    leftFront: { alpha: 0, beta: 0, gamma: 0 },
    leftMiddle: { alpha: 0, beta: 0, gamma: 0 },
    leftBack: { alpha: 0, beta: 0, gamma: 0 },
    rightBack: { alpha: 0, beta: 0, gamma: 0 },
}

const DIMENSIONS = {
    front: 100,
    side: 100,
    middle: 100,
    coxia: 100,
    femur: 100,
    tibia: 100,
}

const BODY_ALL_POINTS_LIST = [
    { x: 100, y: 0, z: 100, name: "rightMiddleVertex", id: 0 },
    { x: 100, y: 100, z: 100, name: "rightFrontVertex", id: 1 },
    { x: -100, y: 100, z: 100, name: "leftFrontVertex", id: 2 },
    { x: -100, y: 0, z: 100, name: "leftMiddleVertex", id: 3 },
    { x: -100, y: -100, z: 100, name: "leftBackVertex", id: 4 },
    { x: 100, y: -100, z: 100, name: "rightBackVertex", id: 5 },
    { x: 0, y: 0, z: 100, name: "centerOfGravityPoint", id: 6 },
    { x: 0, y: 100, z: 100, name: "headPoint", id: 7 },
]

const GROUND_CONTACT_POINTS_LIST = [
    {
        x: 300,
        y: 0,
        z: 0,
        name: "rightMiddle-footTipPoint",
        id: "0-3",
    },
    {
        x: 273.18762482639215,
        y: -0.030228466163364942,
        z: 0,
        name: "rightFront-footTipPoint",
        id: "1-3",
    },
    {
        x: -241.42135623730948,
        y: 241.4213562373095,
        z: 0,
        name: "leftFront-footTipPoint",
        id: "2-3",
    },
    {
        x: -300,
        y: 2.4492935982947064e-14,
        z: 0,
        name: "leftMiddle-footTipPoint",
        id: "3-3",
    },
    {
        x: -241.42135623730954,
        y: -241.42135623730948,
        z: 0,
        name: "leftBack-footTipPoint",
        id: "4-3",
    },
    {
        x: 241.42135623730948,
        y: -241.42135623730954,
        z: 0,
        name: "rightBack-footTipPoint",
        id: "5-3",
    },
]

const LOCAL_AXES = {
    xAxis: { x: 1, y: 0, z: 0, name: "hexapodXaxis", id: "no-id-point" },
    yAxis: { x: 0, y: 1, z: 0, name: "hexapodYaxis", id: "no-id-point" },
    zAxis: { x: 0, y: 0, z: 1, name: "hexapodZaxis", id: "no-id-point" },
}

const CASE = {
    params: {
        pose: POSE,
        dimensions: DIMENSIONS,
    },

    result: {
        bodyAllPointsList: BODY_ALL_POINTS_LIST,
        groundContactPointsList: GROUND_CONTACT_POINTS_LIST,
        localAxes: LOCAL_AXES,
    },

    description: "Random Forward Kinematics",
}

export default CASE
