const PATTERN_POSE = {
    alpha: 28,
    beta: -51,
    gamma: 178,
}
const DIMENSIONS = {
    front: 88,
    side: 103,
    middle: 142,
    coxia: 75,
    femur: 118,
    tibia: 100,
}

const BODY_ALL_POINTS_LIST = [
    {
        x: 125.37855818596763,
        y: -66.66496191559649,
        z: 91.70322345192254,
        name: "rightMiddleVertex",
        id: 0,
    },
    {
        x: 126.05495913853233,
        y: 49.630104539311084,
        z: 91.70322345192254,
        name: "rightFrontVertex",
        id: 1,
    },
    {
        x: -29.34381720463883,
        y: 132.25709958962787,
        z: 91.70322345192254,
        name: "leftFrontVertex",
        id: 2,
    },
    {
        x: -125.37855818596763,
        y: 66.66496191559649,
        z: 91.70322345192254,
        name: "leftMiddleVertex",
        id: 3,
    },
    {
        x: -126.05495913853233,
        y: -49.630104539311084,
        z: 91.70322345192254,
        name: "leftBackVertex",
        id: 4,
    },
    {
        x: 29.34381720463883,
        y: -132.25709958962787,
        z: 91.70322345192254,
        name: "rightBackVertex",
        id: 5,
    },
    { x: 0, y: 0, z: 91.70322345192254, name: "centerOfGravityPoint", id: 6 },
    {
        x: 48.35557096694675,
        y: 90.94360206446947,
        z: 91.70322345192254,
        name: "headPoint",
        id: 7,
    },
]

const GROUND_CONTACT_POINTS_LIST = [
    {
        id: "0-2",
        name: "rightMiddle-femurPoint",
        x: 274.6383643298485,
        y: -66.66496191559649,
        z: -1.4210854715202004e-14,
    },
    {
        id: "1-2",
        name: "rightFront-femurPoint",
        x: 231.59758022145996,
        y: 155.17272562223872,
        z: -1.4210854715202004e-14,
    },
    {
        id: "2-2",
        name: "leftFront-femurPoint",
        x: -134.88643828756648,
        y: 237.7997206725555,
        z: -1.4210854715202004e-14,
    },
    {
        id: "3-2",
        name: "leftMiddle-femurPoint",
        x: -274.63836432984846,
        y: 66.66496191559645,
        z: -1.4210854715202004e-14,
    },
    {
        id: "4-2",
        name: "leftBack-femurPoint",
        x: -231.59758022146,
        y: -155.17272562223872,
        z: -1.4210854715202004e-14,
    },
    {
        id: "5-2",
        name: "rightBack-femurPoint",
        x: 134.88643828756642,
        y: -237.79972067255557,
        z: -1.4210854715202004e-14,
    },
]

const LOCAL_AXES = {
    xAxis: {
        x: 0.882947592858927,
        y: -0.4694715627858908,
        z: 0,
        name: "hexapodXaxis",
        id: "no-id",
    },
    yAxis: {
        x: 0.4694715627858908,
        y: 0.882947592858927,
        z: 0,
        name: "hexapodYaxis",
        id: "no-id",
    },
    zAxis: { x: 0, y: 0, z: 1, name: "hexapodZaxis", id: "no-id" },
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
