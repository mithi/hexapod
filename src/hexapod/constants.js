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
    LEG_POINT_TYPES_LIST,
    POSITION_NAME_TO_ID_MAP,
    POSITION_NAME_TO_AXIS_ANGLE_MAP,
    POSITION_NAMES_LIST,
    NUMBER_OF_LEGS,
    POSITION_NAME_TO_IS_LEFT_MAP,
}
