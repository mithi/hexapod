import { atan2 } from "mathjs"
import Linkage from "../Linkage"
import { POSITION_NAMES_LIST } from "../constants"
import { DEFAULT_POSE } from "../../templates/hexapodParams"

const computeLegsList = (legDimensions, verticesList, pose = DEFAULT_POSE) =>
    POSITION_NAMES_LIST.map(
        (position, index) =>
            new Linkage(legDimensions, position, verticesList[index], pose[position])
    )

const mightTwist = legsOnGround => {
    // Because we are ALWAYS starting at a pose where
    // all alphas are zero and
    // all foot tips are touching the ground, then
    // Hexapod will twist if three more alphas are non-zero
    // and the corresponding legs have foot tips are on the ground
    // The hexapod will only definitely NOT twist
    // if only two or lest of the legs that's
    // currently on the ground has alpha != 0
    const didTwistCount = legsOnGround.reduce((didTwistCount, leg) => {
        const pointType = leg.maybeGroundContactPoint.name.split("-")[1]
        const footTipOnGround = pointType !== "bodyContactPoint"
        const changedAlpha = leg.pose.alpha !== 0
        return footTipOnGround && changedAlpha ? didTwistCount + 1 : didTwistCount
    }, 0)
    return didTwistCount >= 3
}

const computeTwistAngle = (oldGroundContactPoints, newGroundContactPoints) => {
    // Because we are ALWAYS starting at a pose where
    // all alphas are zero and ground contacts are foot tips,
    // let's find atleast one point that are the same before and after
    const newSamePoint = newGroundContactPoints.find(point => {
        const pointType = point.name.split("-")[1]
        return pointType === "footTipPoint"
    })

    if (newSamePoint === undefined) {
        return 0
    }

    const newPointPosition = newSamePoint.name.split("-")[0]
    const oldSamePoint = oldGroundContactPoints.find(point => {
        const oldPointPosition = point.name.split("-")[0]
        return newPointPosition === oldPointPosition
    })

    const thetaRadians =
        atan2(oldSamePoint.y, oldSamePoint.x) - atan2(newSamePoint.y, newSamePoint.x)
    const thetaDegrees = (thetaRadians * 180) / Math.PI
    return thetaDegrees
}

// Which point on each leg contacts the ground
// when all angles are equal to zero
const computeDefaultGroundContactPoints = (legDimensions, verticesList) =>
    computeLegsList(legDimensions, verticesList).map(
        leg => leg.maybeGroundContactPoint
    )

const complexTwist = (legsOnGroundWithoutGravity, verticesList) => {
    const newGroundContactPoints = legsOnGroundWithoutGravity.map(
        leg => leg.maybeGroundContactPoint
    )
    const oldGroundContactPoints = computeDefaultGroundContactPoints(
        this.legDimensions,
        verticesList
    )

    return computeTwistAngle(oldGroundContactPoints, newGroundContactPoints)
}

const simpleTwist = legsOnGroundWithoutGravity => {
    // we twist in the condition that
    // 1. all the legs pose has same alpha
    // 2. the ground contact points are either all femurPoints or all footTipPoints
    //    if all femurPoints on ground, make sure bodyContactPoint.z != femurPoint.z
    //     (ie  if hexapod body is not on the ground we should not twist)
    const firstAlpha = legsOnGroundWithoutGravity[0].pose.alpha
    const shouldTwist = legsOnGroundWithoutGravity.every(leg => {
        if (leg.pose.alpha !== firstAlpha) {
            return false
        }

        const pointType = leg.maybeGroundContactPoint.name.split("-")[1]

        if (pointType === "footTipPoint") {
            return true
        }

        if (pointType === "femurPoint") {
            const hexapodBodyPlaneOnGround =
                leg.pointsMap["bodyContactPoint"].z === leg.pointsMap["femurPoint"].z
            return hexapodBodyPlaneOnGround ? false : true
        }

        return false
    })

    return !shouldTwist ? 0 : -firstAlpha
}

export { complexTwist, mightTwist, simpleTwist }
