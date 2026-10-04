// Scorpion hexapod prototype dimensions in millimetres.
// The body values are offsets from the body centre to the hip axes:
// front/middle = half the left-right spacing; side = each fore/aft spacing.
const DEFAULT_BODY_DIMENSIONS = {
    front: 60,
    side: 115,
    middle: 60,
}
const DEFAULT_LEG_DIMENSIONS = {
    coxia: 64.5,
    femur: 64.5,
    tibia: 130.59,
}

const DEFAULT_DIMENSIONS = {
    ...DEFAULT_BODY_DIMENSIONS,
    ...DEFAULT_LEG_DIMENSIONS,
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
    // Start near the prototype's reference tripod step (forward 15, lift 20).
    hipSwing: 15,
    liftSwing: 20,
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
