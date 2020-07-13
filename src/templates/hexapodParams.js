const DEFAULT_BODY_DIMENSIONS = {
    front: 100,
    side: 100,
    middle: 100,
}
const DEFAULT_LEG_DIMENSIONS = {
    coxia: 100,
    femur: 100,
    tibia: 100,
}

const DEFAULT_DIMENSIONS = {
    front: 100,
    side: 100,
    middle: 100,
    coxia: 100,
    femur: 100,
    tibia: 100,
}

const DEFAULT_POSE = {
    leftFront: { alpha: 0, beta: 0, gamma: 0 },
    rightFront: { alpha: 0, beta: 0, gamma: 0 },
    leftMiddle: { alpha: 0, beta: 0, gamma: 0 },
    rightMiddle: { alpha: 0, beta: 0, gamma: 0 },
    leftBack: { alpha: 0, beta: 0, gamma: 0 },
    rightBack: { alpha: 0, beta: 0, gamma: 0 },
}

const DEFAULT_PATTERN_PARAMS = { alpha: 0, beta: 0, gamma: 0 }

const DEFAULT_IK_PARAMS = {
    tx: 0,
    ty: 0,
    tz: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    hipStance: 0,
    legStance: 0,
}

const DEFAULT_GAIT_PARAMS = {
    tx: 0,
    tz: 0,
    rx: 0,
    ry: 0,
    legStance: 0,
    hipStance: 20,
    hipSwing: 25,
    liftSwing: 40,
    stepCount: 5,
}

export {
    DEFAULT_DIMENSIONS,
    DEFAULT_LEG_DIMENSIONS,
    DEFAULT_BODY_DIMENSIONS,
    DEFAULT_POSE,
    DEFAULT_IK_PARAMS,
    DEFAULT_PATTERN_PARAMS,
    DEFAULT_GAIT_PARAMS,
}
