/*
POSITION	ALPHA	BETA	GAMMA
rightMiddle	0.00	41.83	-31.68
rightFront	1.00	29.00	-23.82
leftFront	-1.60	-38.53	47.93
leftMiddle	0.00	-44.86	57.12
leftBack	1.00	-29.57	35.03
rightBack	-1.60	36.80	-28.48

 */
const POSE = {
    rightMiddle: { alpha: 0, beta: 41.83, gamma: -31.68 },
    rightFront: { alpha: 1, beta: 29, gamma: -23.82 },
    leftFront: { alpha: -1.6, beta: -38.53, gamma: 47.93 },
    leftMiddle: { alpha: 0, beta: -44.86, gamma: 57.12 },
    leftBack: { alpha: 1, beta: -29.57, gamma: 35.03 },
    rightBack: { alpha: -1.6, beta: 36.8, gamma: -28.48 },
}

const DIMENSIONS = {
    front: 100,
    side: 100,
    middle: 100,
    coxia: 100,
    femur: 100,
    tibia: 100,
}

const IK_PARAMS = {
    tx: 0,
    ty: 0,
    tz: 0,
    rx: 1.47,
    ry: 13.15,
    rz: 0,
    hipStance: 0,
    legStance: 0,
}

const CASE = {
    params: { dimensions: DIMENSIONS, ikParams: IK_PARAMS },
    result: { obtainedSolution: true, pose: POSE },
    description: "Sample test case where all alphas should be within range",
}

export default CASE
