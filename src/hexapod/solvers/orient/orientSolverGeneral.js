/* * *

A more general algorithm to account for the cases
that are not handled correctly by the orientSolverSpecific.

- Only used by the kinematics-page of the app.
- Can be optimized or replaced if a more elegant
algorithm is available.

............
  OVERVIEW
............

Find:
- The orientation of the hexapod (normal axis of the hexapod body plane)
- distance of hexapod center of gravity to the ground plane (height)
- All the legs which are in contact in the ground

How?

We have 18 points total.
(6 legs, three possible points per leg (femurPoint))

We have a total of 540 combinations
- get three legs out of six (20 combinations)
  - we have three possible points for each leg,
        (coxiaPoint, femurPoint, footTip),
        that's 27 (3^3) combinations
  -  27 * 20 is 540

For each combination:
    1. Check if stable. If not, try the next combination
      - Check if the projection of the center of gravity to the plane
        defined by the three points lies inside the triangle,
        if not stable, try the next combination

    2. Get the HEIGHT and normal of the height and normal of the triangle plane
        (We need this for the next part)

    3. For each of the three legs, check if the two other points on the leg is not
        lower than HEIGHT, (6 points total)
        if condition if broken, try the next combination.

    4. For each of the three other legs, check if all points (3 points of each leg)
        are not lower than HEIGHT
        if this condition is broken, try the next combination. (9 points total)

    5. If no condition is violated, then this is good, return this!

 * * */
import {
    SOME_LEG_ID_TRIOS,
    ADJACENT_LEG_ID_TRIOS,
    isStable,
    isLower,
    findLegsOnGround,
} from "./orientSolverHelpers"
import { dot, getNormalofThreePoints } from "../../geometry"

const makeJointIndexTrios = () => {
    let jointIdTrios = []
    for (let i = 3; i > 0; i--) {
        for (let j = 3; j > 0; j--) {
            for (let k = 3; k > 0; k--) {
                jointIdTrios.push([i, j, k])
            }
        }
    }
    return jointIdTrios
}

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

const JOINT_INDEX_TRIOS = makeJointIndexTrios()

const computeOrientationProperties = (legsNoGravity, flags = { shuffle: false }) => {
    const someLegTrios = flags.shuffle
        ? shuffleArray(SOME_LEG_ID_TRIOS.slice())
        : SOME_LEG_ID_TRIOS

    const legIndexTrios = [...someLegTrios, ...ADJACENT_LEG_ID_TRIOS]

    let fallback = null

    for (let i = 0; i < legIndexTrios.length; i++) {
        const threeLegIndices = legIndexTrios[i]
        const { threeLegs, otherThreeLegs } = getTwoLegSets(
            threeLegIndices,
            legsNoGravity
        )

        for (let j = 0; j < JOINT_INDEX_TRIOS.length; j++) {
            const threeJointIndices = JOINT_INDEX_TRIOS[j]

            const [p0, p1, p2] = getThreePoints(threeLegs, threeJointIndices)

            if (!isStable(p0, p1, p2)) {
                continue
            }

            const normal = getNormalofThreePoints(p0, p1, p2, "normalVector")
            const height = -dot(normal, p0)

            if (
                anotherPointOfSameLegIsLower(threeLegs, threeJointIndices, normal, height)
            ) {
                continue
            }

            if (anotherPointofOtherLegsIsLower(otherThreeLegs, normal, height)) {
                continue
            }

            // ❗❗❗THIS IS A HACK ❗❗❗
            // THERE IS A BUG HERE SOMEWHERE, FIND IT
            if (height === 0) {
                if (fallback === null) {
                    fallback = { p0, p1, p2, normal, height }
                }
                continue
            }

            const groundLegsNoGravity = findLegsOnGround(legsNoGravity, normal, height)
            return { nAxis: normal, height, groundLegsNoGravity }
        }
    }

    if (fallback === null) {
        return null
    }

    return {
        nAxis: fallback.normal,
        height: fallback.height,
        groundLegsNoGravity: findLegsOnGround(
            legsNoGravity,
            fallback.normal,
            fallback.height
        ),
    }
}

const getThreePoints = (threeLegs, threeJointIndices) =>
    threeLegs.map((leg, index) => {
        const jointId = threeJointIndices[index]
        return leg.allPointsList[jointId]
    })

const getTwoLegSets = (threeLegIndices, sixLegs) => {
    const threeLegs = threeLegIndices.map(n => sixLegs[n])
    const otherThreeLegIndices = [...Array(6).keys()].filter(
        n => !threeLegIndices.includes(n)
    )
    const otherThreeLegs = otherThreeLegIndices.map(n => sixLegs[n])
    return { threeLegs, otherThreeLegs }
}

const anotherPointOfSameLegIsLower = (threeLegs, threeJointIndices, normal, height) => {
    for (let i = 0; i < 3; i++) {
        const [leg, jointIndex] = [threeLegs[i], threeJointIndices[i]]

        const hasLower = leg.allPointsList.some((otherPoint, index) => {
            const notBodyContact = index !== 0
            const notItself = index !== jointIndex
            return notBodyContact && notItself && isLower(otherPoint, normal, height)
        })

        if (hasLower) {
            return true
        }
    }
    return false
}

const anotherPointofOtherLegsIsLower = (otherThreeLegs, normal, height) => {
    for (let i = 0; i < 3; i++) {
        const leg = otherThreeLegs[i]
        const hasLower = leg.allPointsList
            .slice(1)
            .some(point => isLower(point, normal, height))

        if (hasLower) {
            return true
        }
    }

    return false
}

export { computeOrientationProperties }
