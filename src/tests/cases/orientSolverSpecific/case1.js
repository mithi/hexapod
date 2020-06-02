// lefPoses and bodyContactPoints are 6-elements list
// corresponding to those values for the legs in positions
// ['rightMiddle', 'rightFront', 'leftFront', 'leftMiddle', 'leftBack', 'righBack']
// and in that order
import { POSITION_NAMES_LIST } from "../../../hexapod/constants"

const LEG_DIMENSIONS = { coxia: 54, femur: 145, tibia: 136 }
const BODY_CONTACT_POINTS = [
    { x: 123.0, y: 0.0, z: 0.0 },
    { x: +81.0, y: 102.0, z: 0.0 },
    { x: -81.0, y: 102.0, z: 0.0 },
    { x: -123.0, y: 0.0, z: 0.0 },
    { x: -81.0, y: -102.0, z: 0.0 },
    { x: +81.0, y: -102.0, z: 0.0 },
]

const LEG_POSES = [
    {
        alpha: -3.4356079558826877,
        beta: 36.0895008265126,
        gamma: -17.447364001749946,
    },
    { alpha: -12.20757089585112, beta: 29.36129779989708, gamma: -16.2481368585145 },
    {
        alpha: 0.06723502214259724,
        beta: 3.024677275725338,
        gamma: -11.278949903986643,
    },
    {
        alpha: -1.237935828158811,
        beta: 0.464393927500538,
        gamma: -9.688284801495797,
    },
    {
        alpha: -3.690976372227965,
        beta: 8.09905051553077,
        gamma: -12.553882239485858,
    },
    {
        alpha: 5.408108122348608,
        beta: 33.8944844611977,
        gamma: -17.45495618475549,
    },
]

const NORMAL_VECTOR = { x: -0.14, y: 0.03, z: 0.99 }
const HEIGHT = 90.0728766827425

// All LEGS
const LEGS_ON_GROUND_POSITIONS = POSITION_NAMES_LIST

const CASE = {
    params: {
        legDimensions: LEG_DIMENSIONS,
        bodyContactPoints: BODY_CONTACT_POINTS,
        legPoses: LEG_POSES,
    },
    result: {
        nAxis: NORMAL_VECTOR,
        height: HEIGHT,
        legsOnGroundPositions: LEGS_ON_GROUND_POSITIONS,
    },
    description:
        "Slightly oriented and translated but all foot tips are in contact with the ground",
}

export default CASE
