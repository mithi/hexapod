import { dot, cross, vectorFromTo, getNormalofThreePoints } from "../geometry"
import Vector from "../Vector"

const SOME_LEG_ID_TRIOS = [
    [0, 1, 3],
    [0, 1, 4],
    [0, 2, 3],
    [0, 2, 4],
    [0, 2, 5],
    [0, 3, 4],
    [0, 3, 5],
    [1, 2, 4],
    [1, 2, 5],
    [1, 3, 4],
    [1, 3, 5],
    [1, 4, 5],
    [2, 3, 5],
    [2, 4, 5],
]

const ADJACENT_LEG_ID_TRIOS = [
    [0, 1, 2],
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [0, 4, 5],
    [0, 1, 5],
]

const LEG_ID_TRIOS = [...SOME_LEG_ID_TRIOS, ...ADJACENT_LEG_ID_TRIOS]

/* *
  .................
  COMPUTE ORIENTATION PROPERTIES (TYPE: SPECIFIC)
  .................

  Given: 1. A list of legs with known pose and
            its points wrt the hexapod body is known
         2. The legs which are in contact with the ground
            is known

  Find: 1. Normal vector of the plane defined by foot tip of
           legs on the ground wrt the hexapod body plane
        2. Distance of the hexapod body plane to the plane
           defined by the foot tips on the ground
        3. Which legs are on the ground
 * */
const computeOrientationProperties = legsNoGravity => {
    const result = computePlaneProperties(legsNoGravity)

    if (result === null) {
        return null
    }
    const groundLegsNoGravity = findLegsOnGround(
        legsNoGravity,
        result.normal,
        result.height
    )

    return { nAxis: result.normal, height: result.height, groundLegsNoGravity }
}

/* *
 * .................
 * COMPUTE PLANE PROPERTIES
 * .................
 * */
const computePlaneProperties = legs => {
    const maybeGroundContactPoints = legs.map(leg => leg.maybeGroundContactPoint)

    for (let i = 0; i < LEG_ID_TRIOS.length; i++) {
        const legTrio = LEG_ID_TRIOS[i]
        const [p0, p1, p2] = legTrio.map(j => maybeGroundContactPoints[j])

        if (!isStable(p0, p1, p2)) {
            continue
        }
        const normal = getNormalofThreePoints(p0, p1, p2, "normalVector")

        /* * *
         *
         *  cog *   ^ (normal_vector) ----
         *       \  |                  |
         *        \ |               -height
         *         \|                  |
         *          V p0 (foot_tip) ---v--
         *
         *  using p0, p1 or p2 should yield the same result
         *
         * * */
        const height = -dot(normal, p0)
        const otherTrio = [...Array(6).keys()].filter(j => !legTrio.includes(j))
        const otherFootTips = otherTrio.map(j => maybeGroundContactPoints[j])
        const noOtherLegLower = otherFootTips.every(
            footTip => !isLower(footTip, normal, height)
        )
        if (noOtherLegLower) {
            return { normal, height }
        }
    }

    return null
}

const isLower = (point, normal, height, tol = 1) => -dot(normal, point) > height + tol

/* *

   Each leg has four points (footTip, femurPoint, coxiaPoint, bodyContact).
   If one point of leg is at the same distance as the ground is
   from the hexapod's center of gravity, then this leg is on the ground.

   Note: we check starting from the footTip to the bodyContact because
   the footTip is the one most likely to be on the ground

 * */
const findLegsOnGround = (legs, normal, height) => {
    return legs.reduce((legsOnGround, leg) => {
        const reversedPoints = leg.allPointsList.slice(1).reverse()
        const onGround = reversedPoints.some(point => sameHeight(point, normal, height))
        return onGround ? [...legsOnGround, leg] : legsOnGround
    }, [])
}

const sameHeight = (point, normal, height, tol = 1) => {
    const _height = -dot(normal, point)
    return Math.abs(height - _height) <= tol
}

/* *
 * Determines stability of the pose.
 * Determine if projection of 3D point cog
 * onto the plane defined by p0, p1, p2
 * is within a triangle defined by p0, p1, p2.
 * */
const isStable = (p0, p1, p2, tol = 0.001) => {
    const cog = new Vector(0, 0, 0)

    const u = vectorFromTo(p0, p1)
    const v = vectorFromTo(p0, p2)
    const w = vectorFromTo(p1, cog)
    const n = cross(u, v)
    const n2 = dot(n, n)

    // NOTE: alpha, beta, gamma are NOT angles
    // cogProjected = alpha * p0 + beta * p1 + gamma * p2

    const beta = dot(cross(u, w), n) / n2
    const gamma = dot(cross(u, v), n) / n2
    const alpha = 1 - beta - gamma

    const minVal = -tol
    const maxVal = 1 + tol
    const cond0 = minVal <= alpha <= maxVal
    const cond1 = minVal <= beta <= maxVal
    const cond2 = minVal <= gamma <= maxVal

    return cond0 && cond1 && cond2
}

export { computeOrientationProperties }
