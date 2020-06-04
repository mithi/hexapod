const case1 = {
    params: {
        coxia: 25,
        femur: 31,
        tibia: 55,
        summa: 50,
        rho: 40,
    },
    result: {
        beta: 45.815,
        gamma: -54.49934,
        reachedTarget: true,
        obtainedSolution: true,
    },
    description: "beta/gamma +/- #1",
}

const case2 = {
    params: {
        coxia: 20,
        femur: 35,
        tibia: 67,
        summa: 60,
        rho: 50,
    },
    result: {
        beta: 35.439838,
        gamma: -43.9786,
        obtainedSolution: true,
        reachedTarget: true,
    },
    description: "beta/gamma +/- #2",
}

const case3 = {
    params: {
        coxia: 32,
        femur: 40,
        tibia: 57,
        summa: 70,
        rho: 59,
    },
    result: {
        beta: -20.2767,
        gamma: -15.67954287,
        obtainedSolution: true,
        reachedTarget: true,
    },
    description: "beta/gamma -/-",
}

const case4 = {
    params: {
        coxia: 34,
        femur: 30,
        tibia: 56,
        summa: 86,
        rho: 55,
    },
    result: {
        beta: -30.93548275,
        gamma: 20.2276761,
        obtainedSolution: true,
        reachedTarget: true,
    },
    description: "beta/gamma -/+ ",
}

const CASES = [case1, case2, case3, case4]

export default CASES
