/*
 rightMiddle	-30.58	-14.28	20.64
 rightFront	-40.61	-29.60	31.15
 leftFront	-10.48	22.41	-37.20
 leftMiddle	-13.86	71.14	-57.16
 leftBack	-18.43	86.40	-52.52
 rightBack	-15.67	17.24	-6.43

 */
const POSE = {
    rightMiddle: { alpha: -30.58, beta: -14.28, gamma: 20.64 },
    rightFront: { alpha: -40.61, beta: -29.6, gamma: 31.15 },
    leftFront: { alpha: -10.48, beta: 22.41, gamma: -37.2 },
    leftMiddle: { alpha: -13.86, beta: 71.14, gamma: -57.16 },
    leftBack: { alpha: -18.43, beta: 86.4, gamma: -52.52 },
    rightBack: { alpha: -15.67, beta: 17.24, gamma: -6.43 },
}

const DIMENSIONS = {
    front: 100,
    side: 105,
    middle: 145,
    coxia: 100,
    femur: 110,
    tibia: 160,
}

const IK_PARAMS = {
    tx: -0.15,
    ty: 0.29,
    tz: 0.08,
    rx: 11.8,
    ry: -11.38,
    rz: 13.44,
    hipStance: 7.94,
    legStance: 28.1,
}

const CASE = {
    params: { dimensions: DIMENSIONS, ikParams: IK_PARAMS },
    result: { obtainedSolution: true, pose: POSE },
    description: "Sample test case which would result a more complex twist",
}

export default CASE
