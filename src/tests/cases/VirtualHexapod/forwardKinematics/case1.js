/**

POSITION	ALPHA	BETA	GAMMA
rightMiddle	-32.56	16.49	-23.31
rightFront	-45.94	43.31	-31.83
leftFront	-21.42	103.93	-63.07
leftMiddle	-32.56	72.49	-49.88
leftBack	-45.94	38.27	-29.35
rightBack	-21.42	0.00	-17.14

 */
const POSE = {
    rightMiddle: { alpha: -32.56, beta: 16.49, gamma: -23.31 },
    rightFront: { alpha: -45.94, beta: 43.31, gamma: -31.83 },
    leftFront: { alpha: -21.42, beta: 103.93, gamma: -63.07 },
    leftMiddle: { alpha: -32.56, beta: 72.49, gamma: -49.88 },
    leftBack: { alpha: -45.94, beta: 38.27, gamma: -29.35 },
    rightBack: { alpha: -21.42, beta: 0, gamma: -17.14 },
}

const DIMENSIONS = {
    front: 80,
    side: 115,
    middle: 130,
    coxia: 85,
    femur: 130,
    tibia: 170,
}

const BODY_ALL_POINTS_LIST = [
    {
        x: 129.60077238864724,
        y: 1.2731394860738217,
        z: 89.70096643898215,
        name: "rightMiddleVertex",
        id: 0,
    },
    {
        x: 80.880560246079,
        y: 112.19188756671578,
        z: 57.32238937008935,
        name: "rightFrontVertex",
        id: 1,
    },
    {
        x: -78.62808269379454,
        y: 110.62494666077878,
        z: 44.891077143408,
        name: "leftFrontVertex",
        id: 2,
    },
    {
        x: -129.60077238864724,
        y: -1.2731394860738217,
        z: 69.50008407062496,
        name: "leftMiddleVertex",
        id: 3,
    },
    {
        x: -80.880560246079,
        y: -112.19188756671578,
        z: 101.87866113951776,
        name: "leftBackVertex",
        id: 4,
    },
    {
        x: 78.62808269379454,
        y: -110.62494666077878,
        z: 114.30997336619912,
        name: "rightBackVertex",
        id: 5,
    },
    {
        x: 0,
        y: 0,
        z: 79.60052525480356,
        name: "centerOfGravityPoint",
        id: 6,
    },
    {
        x: 1.1262387761422268,
        y: 111.40841711374728,
        z: 51.10673325674867,
        name: "headPoint",
        id: 7,
    },
]

const GROUND_CONTACT_POINTS_LIST = [
    {
        x: 298.046409441612,
        y: -128.6257735581176,
        z: 0,
        name: "rightMiddle-footTipPoint",
        id: "0-3",
    },
    {
        x: 299.60716812676367,
        y: 91.70573520814128,
        z: 0,
        name: "rightFront-footTipPoint",
        id: "1-3",
    },
    {
        x: -142.73205374148802,
        y: 255.81462566977828,
        z: 0.0006946576697259843,
        name: "leftFront-footTipPoint",
        id: "2-3",
    },
    {
        x: -285.24255646518475,
        y: 87.78221157531723,
        z: 0,
        name: "leftMiddle-footTipPoint",
        id: "3-3",
    },
    {
        x: -286.79207748064715,
        y: -132.55156915519484,
        z: 0.0041270978701817285,
        name: "leftBack-footTipPoint",
        id: "4-3",
    },
    {
        x: 155.53177316786113,
        y: -296.64047500509434,
        z: 0.0036932219511527364,
        name: "rightBack-footTipPoint",
        id: "5-3",
    },
]

const LOCAL_AXES = {
    xAxis: {
        x: 0.9969290183742096,
        y: 0.00979338066210632,
        z: 0.07769570141675843,
        name: "hexapodXaxis",
        id: "no-id-point",
    },
    yAxis: {
        x: 0.00979338066210632,
        y: 0.9687688444673677,
        z: -0.24777210433091204,
        name: "hexapodYaxis",
        id: "no-id-point",
    },
    zAxis: {
        x: -0.07769570141675843,
        y: 0.24777210433091204,
        z: 0.9656978628415772,
        name: "hexapodZaxis",
        id: "no-id-point",
    },
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
