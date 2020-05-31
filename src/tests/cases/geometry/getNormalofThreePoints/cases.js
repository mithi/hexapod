const CASE1 = {
    params: {
        a: { x: 309.96, y: 0, z: -116.09 },
        b: { x: 199.52, y: 239.45, z: -116.09 },
        c: { x: -309.96, y: 0, z: -116.09 },
    },
    result: { normalVector: { x: 0, y: 0, z: 1 } },
    description: "Random getNormalofThreePoints set #1",
}

const CASE2 = {
    params: {
        a: { x: 295.05, y: -90.21, z: -147.8 },
        b: { x: 262.9, y: 164.99, z: -89.7 },
        c: { x: -295.05, y: 90.21, z: -88.39 },
    },
    result: { normalVector: { x: 0.03, y: -0.22, z: 0.98 } },
    description: "Random getNormalofThreePoints set #2",
}

const CASES = [CASE1, CASE2]

export default CASES
