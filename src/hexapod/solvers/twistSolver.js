import { atan2 } from "mathjs"
import Linkage from "./Linkage"
import { POSITION_LIST } from "./constants"
import { POSE } from "../templates/hexapodParams"

const computeLegsList = (legDimensions, verticesList, pose = POSE) =>
    POSITION_LIST.map(
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

const computeTwistFrame = (oldGroundContactPoints, newGroundContactPoints) => {
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
    // since we known the previous pose is the when
    // all the angles === 0, then the old contacts are the foot tips
    const newGroundContactPoints = legsOnGroundWithoutGravity.map(
        leg => leg.maybeGroundContactPoint
    )
    const oldGroundContactPoints = computeDefaultGroundContactPoints(
        this.legDimensions,
        verticesList
    )

    return computeTwistFrame(oldGroundContactPoints, newGroundContactPoints)
}

export { complexTwist, mightTwist }
