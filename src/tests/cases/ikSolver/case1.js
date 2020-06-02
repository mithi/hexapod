const POSE = {
    rightMiddle: {
        alpha: -0.9015214280173736,
        beta: 45.17947145226531,
        gamma: -44.28058358463222,
    },
    rightFront: {
        alpha: -18.85929121820345,
        beta: 43.5584629077111,
        gamma: -43.26142615899047,
    },
    leftFront: {
        alpha: 17.137436663774082,
        beta: 41.16718910296602,
        gamma: -42.639729098411465,
    },
    leftMiddle: {
        alpha: -0.901521428016963,
        beta: 41.842305205429476,
        gamma: -42.70428299385117,
    },
    leftBack: {
        alpha: -18.859291218203452,
        beta: 43.43935010637753,
        gamma: -43.20515680730861,
    },
    rightBack: {
        alpha: 17.137436663774054,
        beta: 45.87449960989302,
        gamma: -44.86298945222543,
    },
}

const DIMENSIONS = {
    front: 70,
    side: 134,
    middle: 138,
    coxia: 79,
    femur: 128,
    tibia: 167,
}

const IK_PARAMS = {
    tx: 0,
    ty: 0,
    tz: 0,
    rx: 0.5,
    ry: 0.5,
    rz: 0.5,
    hipStance: 18,
    legStance: 43.5,
}

const CASE = {
    params: { dimensions: DIMENSIONS, ikParams: IK_PARAMS },
    result: { obtainedSolution: true, pose: POSE },
    description: "Sample test case with zero translation parameters",
}

export default CASE
