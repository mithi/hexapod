const CASE1 = {
    params: {
        vectorA: { x: -127.3, y: 230.93, z: 0 },
        vectorB: { x: -110.44, y: 239.45, z: 0 },
    },
    result: { angle: 4.1040798537345005 },
    description: "Random AngleBetween Set # 1",
}

const CASE2 = {
    params: {
        vectorA: { x: -0.84, y: -0.55, z: 0.03 },
        vectorB: { x: 0.95, y: 0.3, z: 0.03 },
    },
    result: { angle: 163.94 },
    description: "Random AngleBetween Set # 2",
}

const CASE3 = {
    params: {
        vectorA: { x: 129.79, y: 0, z: -144.49 },
        vectorB: { x: 1, y: 0, z: 0 },
    },
    result: { angle: 48.068032085640155 },
    description: "Random AngleBetween Set #3",
}

const CASES = [CASE1, CASE2, CASE3]

export default CASES
