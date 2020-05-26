const LEG_POINT_TYPES = ["bodyContact", "coxia", "femur", "footTip"]

const POSITION_ID_MAP = {
    rightMiddle: 0,
    rightFront: 1,
    leftFront: 2,
    leftMiddle: 3,
    leftBack: 4,
    rightBack: 5,
}

const POSITION_LIST = [
    "rightMiddle",
    "rightFront",
    "leftFront",
    "leftMiddle",
    "leftBack",
    "rightBack",
]

const LOCAL_X_AXIS_ANGLE_MAP = {
    rightMiddle: 0,
    rightFront: 45,
    leftFront: 135,
    leftMiddle: 180,
    leftBack: 225,
    rightBack: 315,
}

const NUMBER_OF_LEGS = 6

export {
    LEG_POINT_TYPES,
    POSITION_ID_MAP,
    LOCAL_X_AXIS_ANGLE_MAP,
    POSITION_LIST,
    NUMBER_OF_LEGS,
}
