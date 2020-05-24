const LEG_POINT_TYPES = ["bodyContact", "coxia", "femur", "footTip"]

const LEG_ID_MAP = {
    rightMiddle: 0,
    rightFront: 1,
    leftFront: 2,
    leftMiddle: 3,
    leftBack: 4,
    rightBack: 5,
}

const LEG_LOCAL_X_AXIS_ANGLE_MAP = {
    rightMiddle: 0,
    rightFront: 45,
    leftFront: 135,
    leftMiddle: 180,
    leftBack: 225,
    rightBack: 315,
}

export { LEG_POINT_TYPES, LEG_ID_MAP, LEG_LOCAL_X_AXIS_ANGLE_MAP }
