import { dot, getNormalofThreePoints } from "../../geometry"
import {
    SOME_LEG_ID_TRIOS,
    ADJACENT_LEG_ID_TRIOS,
    isStable,
    findLegsOnGround,
    isLower,
} from "./orientSolverHelpers"

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
         *  using p0, p1 or p2 should yield the same height
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

export { computeOrientationProperties }
