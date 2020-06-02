import { POSITION_NAMES_LIST, NUMBER_OF_LEGS } from "../../../hexapod/constants"

const LEG_DIMENSIONS = { coxia: 73, femur: 122, tibia: 91 }

const LEG_POSE = {
    alpha: 30,
    beta: 55.5,
    gamma: -31.5,
}
const BODY_CONTACT_POINTS = [
    { x: 104, y: 0.0, z: 0.0 },
    { x: 56, y: 95, z: 0 },
    { x: -56, y: 95, z: 0 },
    { x: -104, y: 0, z: 0 },
    { x: -56, y: -95, z: 0 },
    { x: 56, y: -95, z: 0 },
]

const LEG_POSES = [...Array(NUMBER_OF_LEGS).keys()].map(i => LEG_POSE)

const NORMAL_VECTOR = { x: 0, y: 0, z: 1 }
const HEIGHT = 0

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
    description: "When all foot tips don't touch the ground",
}

export default CASE
