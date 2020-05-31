const CASE1 = {
    params: {
        vectorV: { x: -185.37, y: 12.83, z: -111.44 },
        vectorN: { x: -0.1, y: 0.2, z: 0.98 },
    },
    result: { vectorProjected: { x: -194.09, y: 30.27, z: -25.98 } },
    description: "Random projectedVectorOntoPlane set #1",
}

const CASE2 = {
    params: {
        vectorV: { x: -98.89, y: 134.4, z: -87.76 },
        vectorN: { x: -0.1, y: 0.2, z: 0.98 },
    },
    result: { vectorProjected: { x: -103.76, y: 144.145, z: -40.0055 } },
    description: "Random projectedVectorOntoPlane set #2",
}

const CASES = [CASE1, CASE2]

export default CASES
