const CASE1 = {
    params: {
        vectorA: { x: 309.96, y: 0, z: -116.09 },
        vectorB: { x: 199.52, y: 239.45, z: -116.09 },
        vectorC: { x: -309.96, y: 0, z: -116.09 },
    },
    result: { normalVector: { x: 0, y: 0, z: 1 } },
    description: "Random getNormalofThreePoints set #1",
}

const CASE2 = {
    params: {
        vectorA: { x: 295.05, y: -90.21, z: -147.8 },
        vectorB: { x: 262.9, y: 164.99, z: -89.7 },
        vectorC: { x: -295.05, y: 90.21, z: -88.39 },
    },
    result: { normalVector: { x: 0.03, y: -0.22, z: 0.98 } },
    description: "Random getNormalofThreePoints set #2",
}

const CASES = [CASE1, CASE2]

export default CASES
