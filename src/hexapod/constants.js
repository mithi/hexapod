const LEG_POINT_TYPES_LIST = [
    "bodyContactPoint",
    "coxiaPoint",
    "femurPoint",
    "footTipPoint",
]

const POSITION_NAME_TO_ID_MAP = {
    rightMiddle: 0,
    rightFront: 1,
    leftFront: 2,
    leftMiddle: 3,
    leftBack: 4,
    rightBack: 5,
}

const POSITION_NAMES_LIST = [
    "rightMiddle",
    "rightFront",
    "leftFront",
    "leftMiddle",
    "leftBack",
    "rightBack",
]

const ANGLE_NAMES_LIST = ["alpha", "beta", "gamma"]

const MAX_ANGLES = {
    alpha: 90,
    beta: 180,
    gamma: 180,
}

/*
  Body frame: +Y is forward, +X is right, and +Z is vertical.
  The six coxa mounts are arranged as three stations along each side rail:

      left side                         right side
      leftFront                         rightFront
      leftMiddle                        rightMiddle
      leftBack                          rightBack

  The following values are the default local X-axis directions for each leg,
  in degrees from the body +X axis. They are not hip-mount coordinates.
*/
const POSITION_NAME_TO_AXIS_ANGLE_MAP = {
    rightMiddle: 0,
    rightFront: 45,
    leftFront: 135,
    leftMiddle: 180,
    leftBack: 225,
    rightBack: 315,
}

const POSITION_NAME_TO_IS_LEFT_MAP = {
    rightMiddle: false,
    rightFront: false,
    leftFront: true,
    leftMiddle: true,
    leftBack: true,
    rightBack: false,
}

const NUMBER_OF_LEGS = 6

export {
    ANGLE_NAMES_LIST,
    LEG_POINT_TYPES_LIST,
    POSITION_NAME_TO_ID_MAP,
    POSITION_NAME_TO_AXIS_ANGLE_MAP,
    POSITION_NAMES_LIST,
    NUMBER_OF_LEGS,
    POSITION_NAME_TO_IS_LEFT_MAP,
    MAX_ANGLES,
}
