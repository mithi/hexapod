const CASE1 = {
    params: {
        vectorA: { x: -0.98, y: 0.15, z: -0.13 },
        vectorB: { x: 0.95, y: 0.3, z: 0.03 },
        vectorN: { x: -0.1, y: 0.2, z: 0.98 },
    },
    result: { isCCW: false },
    description: "isCounterClockwise set #1",
}

const CASE2 = {
    params: {
        vectorA: { x: -0.84, y: -0.55, z: 0.03 },
        vectorB: { x: 0.95, y: 0.3, z: 0.03 },
        vectorN: { x: -0.1, y: 0.2, z: 0.98 },
    },
    result: { isCCW: true },
    description: "isCounterClockwise set #2",
}

const CASE3 = {
    params: {
        vectorA: { x: -127.3, y: 230.93, z: 0 },
        vectorB: { x: -110.44, y: 239.45, z: 0 },
        vectorN: { x: 0, y: 0, z: -1 },
    },
    result: { isCCW: true },
    description: "isCounterClockwise set #3",
}

const CASES = [CASE1, CASE2, CASE3]
export default CASES
