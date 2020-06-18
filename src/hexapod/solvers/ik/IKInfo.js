class IKMessage {
    static success = {
        subject: "Success.",
        body: "All legs are on the floor.",
    }

    static successLegsOnAir = legs => ({
        subject: "Success.",
        body: `But some legs won't reach target points on the ground:\n${IKMessage.bulletPoints(
            legs
        )}`,
    })

    static noSupport = (reason, legs, flags = { listLegs: false }) => ({
        subject: "Failure: No Support.",
        body: `${reason}\n${flags.listLegs ? IKMessage.bulletPoints(legs) : ""}`,
    })

    static badPoint = point => ({
        subject: "Failure: Bad Point.",
        body: `At least one point would be shoved to the ground:\n${point.toMarkdownString()}`,
    })

    static bulletPoints = elements =>
        elements.reduce((msg, position) => msg + ` - ${position}\n`, "")

    static badLeg = message => ({
        subject: `Failure: Bad leg.`,
        body: message,
    })

    static alphaNotInRange = (position, alpha, maxAngle) => ({
        subject: `Failure: Alpha not within range`,
        body: `The alpha (${alpha}) computed for ${position} leg is not within -${maxAngle} < alpha < ${maxAngle}`,
    })

    static initialized = {
        subject: "Initialized",
        body: "Has not solved for anything yet.",
    }
}

class LegIKInfo {
    static targetReached = position => ({
        legPosition: position,
        message: `Success! (${position})`,
        obtainedSolution: true,
        reachedTarget: true,
    })

    static targetNotReached = position => ({
        legPosition: position,
        message: `Success! But this leg won't reach the target ground point. (${position})`,
        obtainedSolution: true,
        reachedTarget: false,
    })

    static blocked = position => ({
        legPosition: position,
        message: `Failure. The ground is blocking the path. The target point can only be reached it by digging the ground. (${position})`,
        obtainedSolution: false,
        reachedTarget: true,
    })

    static femurTooLong = position => ({
        legPosition: position,
        message: `Failure. Femur length too long. (${position})`,
        obtainedSolution: false,
        reachedTarget: false,
    })

    static tibiaTooLong = position => ({
        legPosition: position,
        message: `Failure. Tibia length too long. (${position})`,
        obtainedSolution: false,
        reachedTarget: false,
    })

    static initialized = position => ({
        legPosition: position,
        obtainedSolution: false,
        reachedTarget: false,
        message: `Haven't solved anything yet. (${position})`,
    })
}

export { LegIKInfo, IKMessage }
