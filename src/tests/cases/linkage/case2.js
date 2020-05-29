const PARAMS = {
    dimensions: { coxia: 51, femur: 83, tibia: 107 },
    position: "rightMiddle",
    bodyContactPoint: { x: 94, y: 0, z: 107 },
    pose: { alpha: -17, beta: 22, gamma: -35 },
}

const BODY_CONTACT_POINT = {
    x: 94,
    y: 0,
    z: 107,
    name: "rightMiddle-bodyContactPoint",
    id: "0-0",
}

const COXIA_POINT = {
    x: 142.77,
    y: -14.91,
    z: 107,
    name: "rightMiddle-coxiaPoint",
    id: "0-1",
}

const FEMUR_POINT = {
    x: 216.37,
    y: -37.41,
    z: 138.09,
    name: "rightMiddle-femurPoint",
    id: "0-2",
}

const FOOT_TIP_POINT = {
    x: 193.35,
    y: -30.37,
    z: 33.83,
    name: "rightMiddle-footTipPoint",
    id: "0-3",
}

const CASE = {
    params: PARAMS,
    result: {
        bodyContactPoint: BODY_CONTACT_POINT,
        coxiaPoint: COXIA_POINT,
        femurPoint: FEMUR_POINT,
        footTipPoint: FOOT_TIP_POINT,
    },
    description: "Random Linkage #2",
}

export default CASE
