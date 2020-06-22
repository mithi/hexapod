import { degrees } from "../geometry"
import { POSITION_NAME_TO_ID_MAP } from "../constants"

/**

mightTwist()
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

Params:

defaultPoints:
    This is the list of the six points which are on the ground
    when a hexapod of the same dimensions has the default pose
    (all angles == 0 ), because it is that pose all of these points
    are of type footTipPoint

currentPoints:
    This are the list of points (NOT necessarily six and
    NOT necessarily footTipPoints) that will be on the ground
    when a hexapod of this dimensions is on a specified pose
    BUT is NOT rotated twisted along the zAxis

Find:
    The angle about the zAxis that the hexapod would rotate
    assuming that the hexapod will start with the
    default pose (which the defaultPoints would be the ground
    contact points)
    and will end at the specified pose (which would
    result the currentPoints as the ground contact points
    if the hexapod is not twisted about the zAxis).

Algorithm:
    Find a point that is on the ground at
    the current pose, and at the default pose.
    (samePointPosition)

    Find the angle to align that currentPoint
    to the defaultPoint.

    (this means that the hexapod would have twisted about its zAxis
    so that the point in the ground in this legPosition
    is the same before (default pose) and after
    (current pose) moving to the current pose)
 * */
const complexTwist = (currentPoints, defaultPoints) => {
    const currentSamePoint = currentPoints.find(point => {
        const pointType = point.name.split("-")[1]
        return pointType === "footTipPoint"
    })

    if (currentSamePoint === undefined) {
        return 0
    }

    const samePointPosition = currentSamePoint.name.split("-")[0]
    const samePointIndex = POSITION_NAME_TO_ID_MAP[samePointPosition]
    const defaultSamePoint = defaultPoints[samePointIndex]

    const thetaRadians =
        Math.atan2(defaultSamePoint.y, defaultSamePoint.x) -
        Math.atan2(defaultSamePoint.y, defaultSamePoint.x)

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

    const allSameAlpha = groundLegsNoGravity.every(
        leg => leg.pose.alpha === firstLeg.pose.alpha
    )

    if (!allSameAlpha) {
        return 0
    }

    const allPointTypes = groundLegsNoGravity.map(
        leg => leg.maybeGroundContactPoint.name.split("-")[1]
    )

    const firstPointType = allPointTypes[0]

    const allPointsSameType = allPointTypes.every(pointType => {
        return pointType === firstPointType
    })

    if (!allPointsSameType) {
        return 0
    }

    // at this point, all ground points are of the same type
    if (["coxiaPoint", "bodyContactPoint"].includes(firstPointType)) {
        return 0
    }

    // at this point, all ground points are either ALL femurPoint or ALL footTipPoint
    if (firstPointType === "femurPoint") {
        const hexapodBodyPlaneOnGround =
            firstLeg.bodyContactPoint.z === firstLeg.femurPoint.z

        if (hexapodBodyPlaneOnGround) {
            return 0
        }
    }

    return -firstLeg.pose.alpha
}

export { complexTwist, mightTwist, simpleTwist }
