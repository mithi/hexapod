import { atan2 } from "mathjs"
import { degrees } from "../geometry"

/**

mightTwist(legsOnGround)
    params: list of legs that are known to touch the ground
    returns: boolean
        false if we are sure it won't twist
        true if there's a possibility that it might twist

given the starting pose is such that:
    - all alphas are zero
    - all foot tips are touching the ground

then the hexapod will only twist if:
    - ATLEAST three alphas of the legs touching the ground
    - the point of contact of these legs are foot tips
    - All the twist must be only in one directions
      ie: the threes alphas are either all positive or all negative
      (NOT a mix of both)

It will definitely not twist if:
    - If only two or less of the legs has an alpha !== 0
    - less than three alphas are twisting towards one direction

 **/
const mightTwist = legsOnGround => {
    let negativeAlphaCount = 0
    let positiveAlphaCount = 0

    for (let i = 0; i < legsOnGround.length; i++) {
        const leg = legsOnGround[i]
        const pointType = leg.maybeGroundContactPoint.name.split("-")[1]

        const footTipIsOnGround = pointType === "footTipPoint"
        const changedAlpha = leg.pose.alpha !== 0

        if (footTipIsOnGround && changedAlpha) {
            leg.pose.alpha > 0 ? positiveAlphaCount++ : negativeAlphaCount++
        }
    }

    return positiveAlphaCount >= 3 || negativeAlphaCount >= 3
}

/* *

complexTwist()

Because we are ALWAYS starting at a pose where
all alphas are zero and ground contacts are foot tips,
let's find atleast one point that are the same before and after

 * */
const complexTwist = (oldGroundContactPoints, newGroundContactPoints) => {
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

    return degrees(thetaRadians)
}

/**

simpleTwist()

We twist in the condition that:
  - All the legs pose has same alpha
  - the ground contact points are either all femurPoints or all footTipPoints
   if all femurPoints on ground, make sure bodyContactPoint.z != femurPoint.z
    (ie  if hexapod body is not on the ground we should not twist)

**/
const simpleTwist = groundLegsNoGravity => {
    const firstLeg = groundLegsNoGravity[0]

    let mightTwist = groundLegsNoGravity.every(
        leg => leg.pose.alpha === firstLeg.pose.alpha
    )

    if (!mightTwist) {
        return 0
    }

    const allPointTypes = groundLegsNoGravity.map(
        leg => leg.maybeGroundContactPoint.name.split("-")[1]
    )

    const firstPointType = allPointTypes[0]

    // if not all ground points are of the same type
    mightTwist = allPointTypes.every(pointType => {
        return pointType === firstPointType
    })

    if (!mightTwist) {
        return 0
    }

    // at this point, all ground points are of the same type
    if (["coxiaPoint", "bodyContactPoint"].includes(firstPointType)) {
        return 0
    }

    // at this point, all ground points are either ALL femurPoint or ALL footTipPoint
    if (firstPointType === "femurPoint") {
        const hexapodBodyPlaneOnGround =
            firstLeg.pointsMap["bodyContactPoint"].z ===
            firstLeg.pointsMap["femurPoint"].z

        if (hexapodBodyPlaneOnGround) {
            return 0
        }
    }

    return -firstLeg.pose.alpha
}

export { complexTwist, mightTwist, simpleTwist }
