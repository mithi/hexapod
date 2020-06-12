import { POSITION_NAME_TO_IS_LEFT_MAP } from "../../constants"

class HexapodSupportCheck {
    static reason = {
        MIGHT_BE_STABLE_LESS:
            "Might be stable.\nLess than three known legs are off the ground.",
        TOO_MANY_LEGS_OFF: "Definitely Unstable.\nToo many legs off the floor.",
        RIGHT_LEGS_OFF: "Definitely Unstable.\nAll right legs are off the floor.",
        LEFT_LEGS_OFF: "Definitely Unstable.\nAll left legs are off the floor.",
        MIGHT_BE_STABLE_MORE:
            "Might be stable.\nThree known legs are off the ground.\nOne is on opposite side of the other two.",
    }

    static checkSupport = legsNamesoffGround => {
        const reason = HexapodSupportCheck.reason

        if (legsNamesoffGround.length < 3) {
            return [false, reason.MIGHT_BE_STABLE_LESS]
        }

        if (legsNamesoffGround.length >= 4) {
            return [true, reason.TOO_MANY_LEGS_OFF]
        }

        // Leg count is exactly 3 at this point
        const legLeftOrRight = legsNamesoffGround.map(
            legPosition => POSITION_NAME_TO_IS_LEFT_MAP[legPosition]
        )

        if (legLeftOrRight.every(isLeft => !isLeft)) {
            return [true, reason.RIGHT_LEGS_OFF]
        }

        if (legLeftOrRight.every(isLeft => isLeft)) {
            return [true, reason.LEFT_LEGS_OFF]
        }

        return [false, reason.MIGHT_BE_STABLE_MORE]
    }
}

export default HexapodSupportCheck
