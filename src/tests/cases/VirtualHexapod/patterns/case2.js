const PATTERN_POSE = {
    alpha: 44.84,
    beta: 88.6,
    gamma: -32.12,
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
    { x: 100, y: 0, z: 0, name: "rightMiddleVertex", id: 0 },
    { x: 100, y: 100, z: 0, name: "rightFrontVertex", id: 1 },
    { x: -100, y: 100, z: 0, name: "leftFrontVertex", id: 2 },
    { x: -100, y: 0, z: 0, name: "leftMiddleVertex", id: 3 },
    { x: -100, y: -100, z: 0, name: "leftBackVertex", id: 4 },
    { x: 100, y: -100, z: 0, name: "rightBackVertex", id: 5 },
    { x: 0, y: 0, z: 0, name: "centerOfGravityPoint", id: 6 },
    { x: 0, y: 100, z: 0, name: "headPoint", id: 7 },
]

const GROUND_CONTACT_POINTS_LIST = [
    {
        x: 170.907863617896,
        y: 70.51294120334124,
        z: 0,
        name: "rightMiddle-coxiaPoint",
        id: "0-1",
    },
    {
        x: 100.27925231737424,
        y: 199.99961008995606,
        z: 0,
        name: "rightFront-coxiaPoint",
        id: "1-1",
    },
    {
        x: -199.99961008995606,
        y: 100.27925231737429,
        z: 0,
        name: "leftFront-coxiaPoint",
        id: "2-1",
    },
    {
        x: -170.90786361789606,
        y: -70.5129412033412,
        z: 0,
        name: "leftMiddle-coxiaPoint",
        id: "3-1",
    },
    {
        x: -100.27925231737424,
        y: -199.99961008995606,
        z: 0,
        name: "leftBack-coxiaPoint",
        id: "4-1",
    },
    {
        x: 199.99961008995606,
        y: -100.27925231737426,
        z: 0,
        name: "rightBack-coxiaPoint",
        id: "5-1",
    },
]

const LOCAL_AXES = {
    xAxis: { x: 1, y: 0, z: 0, name: "hexapodXaxis", id: "no-id-point" },
    yAxis: { x: 0, y: 1, z: 0, name: "hexapodYaxis", id: "no-id-point" },
    zAxis: { x: 0, y: 0, z: 1, name: "hexapodZaxis", id: "no-id-point" },
}

const CASE = {
    params: {
        patternPose: PATTERN_POSE,
        dimensions: DIMENSIONS,
    },

    result: {
        bodyAllPointsList: BODY_ALL_POINTS_LIST,
        groundContactPointsList: GROUND_CONTACT_POINTS_LIST,
        localAxes: LOCAL_AXES,
    },

    description: "should twist when femur point on the ground and all alpha twist",
}

export default CASE
