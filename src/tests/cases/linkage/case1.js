const PARAMS = {
    dimensions: { coxia: 54, femur: 105, tibia: 136 },
    position: "leftBack",
    bodyContactPoint: { x: -41, y: -72, z: 136 },
    pose: { alpha: 0, beta: 0, gamma: 0 },
}

const POINT_NAME_ID_MAP = {
    bodyContactPoint: { name: "leftBack-bodyContactPoint", id: "4-0" },
    coxiaPoint: { name: "leftBack-coxiaPoint", id: "4-1" },
    femurPoint: { name: "leftBack-femurPoint", id: "4-2" },
    footTipPoint: { name: "leftBack-footTipPoint", id: "4-3" },
}

const BODY_CONTACT_POINT = {
    x: -41,
    y: -72,
    z: 136,
    name: "leftBack-bodyContactPoint",
    id: "4-0",
}

const COXIA_POINT = {
    x: -79.18,
    y: -110.18,
    z: 136,
    name: "leftBack-coxiaPoint",
    id: "4-1",
}

const FEMUR_POINT = {
    x: -153.43,
    y: -184.43,
    z: 136,
    name: "leftBack-femurPoint",
    id: "4-2",
}

const FOOT_TIP_POINT = {
    x: -153.43,
    y: -184.43,
    z: 0,
    name: "leftBack-footTipPoint",
    id: "4-3",
}

const CASE = {
    params: PARAMS,
    result: {
        pointNameIdMap: POINT_NAME_ID_MAP,
        bodyContactPoint: BODY_CONTACT_POINT,
        coxiaPoint: COXIA_POINT,
        femurPoint: FEMUR_POINT,
        footTipPoint: FOOT_TIP_POINT,
    },
    description: "Random Linkage #1",
}

export default CASE
