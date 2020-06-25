import LinkageIKSolver from "./LinkageIKSolver"
import HexapodSupportCheck from "./HexapodSupportCheck"
import { IKMessage } from "./IKInfo"
import {
    POSITION_NAMES_LIST,
    NUMBER_OF_LEGS,
    POSITION_NAME_TO_AXIS_ANGLE_MAP,
    MAX_ANGLES,
} from "../../constants"
import {
    vectorFromTo,
    projectedVectorOntoPlane,
    getUnitVector,
    scaleVector,
    addVectors,
    angleBetween,
    vectorLength,
    isCounterClockwise,
} from "../../geometry"

/* * *

.......
Given:
.......

{}. Dimensions of each leg { femur, tibia, gamma }
[] bodyContactPoints
[] groundContactPoints
   - there are two lists which contains six items each. One item for each leg.
{} axes { xAxis, zAxis }
   xAxis and zAxis of the rotated hexapod's local coordinate frame wrt
   world coordinate frame.

.......
Definition:
.......

bodyContactPoint (x, y, z)
- The point in 3d space which is a vertex of the hexagon.
  This is where the leg is in contact with the body of the hexapod.

groundContactPoint (x, y, z)
- The point in 3d space which we want the foot tip of
  the leg to be. Where the leg is in contact with the ground plane of the world.

.......
Find:
.......

18 angles that represent the pose of the hexapod. Three angles for each leg.
    {
      rightMiddle: { alpha, beta, gamma },
      ...
      rightBack: { alpha, beta, gamma },
    }

    If no solution is found, make sure to explain why.

.......
Algorithm:
.......

If one of the vertices is below the ground z < 0,
then there is no solution. Early exit.

For each leg:
    1. Derive a few properties about the leg given what you already know
       which you'd later (see computeInitialProperties() for details )

       This includes the coxiaPoint. If this coxiaPoint is below the ground
        - then there is no solution. Early exit.

    2. Compute the alpha of this leg. see (computeAlpha())
       If alpha is not within range, then there is no solution. Early exit.

    3. Solve for beta and gamma of this leg (see LegIKSolver module)
      If a problem was encountered within this module, then there is no solution. Early exit.
      If the beta and gamma are not within range, then there is no solution, early exit.

    4. Sometimes the LegIKSolver module would return a solution where the leg
       would not reach the target ground contact point. (this leg would be on the air)
       If the combination of the legs in the air would produce an unstable pose
       (e.g 4 legs are in the air or all left legs are in the air)
       Then there is no solution. Early exit.
       (see also HexapodSupportChecker)

    If no problems are encountered, we have found a solution! Return!

* * */
class IKSolver {
    params = {}
    partialPose = {}
    pose = {}
    foundSolution = false
    legPositionsOffGround = []
    message = IKMessage.initialized

    solve(legDimensions, bodyContactPoints, groundContactPoints, axes) {
        // prettier-ignore
        this.params = {
            bodyContactPoints, groundContactPoints, axes, legDimensions
        }

        if (this._hasBadVertex(bodyContactPoints)) {
            return this
        }

        const { coxia, femur, tibia } = legDimensions

        for (let i = 0; i < NUMBER_OF_LEGS; i++) {
            const legPosition = POSITION_NAMES_LIST[i]

            // prettier-ignore
            const known = computeInitialLegProperties(
                bodyContactPoints[i], groundContactPoints[i], axes.zAxis
            )

            if (known.coxiaPoint.z < 0) {
                this._handleBadPoint(known.coxiaPoint)
                return this
            }

            const legXaxisAngle = POSITION_NAME_TO_AXIS_ANGLE_MAP[legPosition]

            // prettier-ignore
            let alpha = computeAlpha(
                known.coxiaUnitVector, legXaxisAngle, axes.xAxis, axes.zAxis
            )

            if (Math.abs(alpha) > MAX_ANGLES.alpha) {
                // prettier-ignore
                this._finalizeFailure(
                    IKMessage.alphaNotInRange(legPosition, alpha, MAX_ANGLES.alpha)
                )
                return this
            }

            // prettier-ignore
            const solvedLegParams = new LinkageIKSolver(legPosition)
                .solve(coxia, femur, tibia, known.summa, known.rho)

            if (!solvedLegParams.obtainedSolution) {
                this._finalizeFailure(IKMessage.badLeg(solvedLegParams.message))
                return this
            }

            if (!solvedLegParams.reachedTarget) {
                if (this._hasNoMoreSupport(legPosition)) {
                    return this
                }
            }

            // prettier-ignore
            this.partialPose[legPosition] = {
                alpha, beta: solvedLegParams.beta, gamma: solvedLegParams.gamma
            }
        }

        this._finalizeSuccess()
        return this
    }

    get hasLegsOffGround() {
        return this.legPositionsOffGround.length > 0 ? true : false
    }

    _hasNoMoreSupport(legPosition) {
        this.legPositionsOffGround.push(legPosition)
        const [noSupport, reason] = HexapodSupportCheck.checkSupport(
            this.legPositionsOffGround
        )
        if (noSupport) {
            const message = IKMessage.noSupport(reason, this.legPositionsOffGround)
            this._finalizeFailure(message)
            return true
        }
        return false
    }

    _handleBadPoint(point) {
        this._finalizeFailure(IKMessage.badPoint(point))
    }

    _hasBadVertex(bodyContactPoints) {
        for (let i = 0; i < NUMBER_OF_LEGS; i++) {
            const vertex = bodyContactPoints[i]
            if (vertex.z < 0) {
                this._handleBadPoint(vertex)
                return true
            }
        }
        return false
    }

    _finalizeFailure(message) {
        this.message = message
        this.foundSolution = false
    }

    _finalizeSuccess() {
        this.pose = this.partialPose
        this.foundSolution = true
        if (!this.hasLegsOffGround) {
            this.message = IKMessage.success
            return
        }

        this.message = IKMessage.successLegsOnAir(this.legPositionsOffGround)
    }
}

/* * *

computeInitialLegProperties()

.......
Given:
.......

1. pB : bodyContactPoint in 3d space
2. pG : groundContactPoint in 3d space
3. coxia: distance from pB to pC
4. zAxis: The vector normal to the hexapodBodyPlane

.......
Find:
.......

1. pC : coxiaPoint in 3d space
2. coxiaVector: the vector from pB to Pc with a length of one
3. coxiaUnitVector: A vector with the length of one
    pointing at the direction of the unit vector
4. rho: The angle made by pC, pB and pG, with pB at the center
5. summa: The distance from pB to pG

pB   pC
 *---* -------- hexapodBodyPlane
  \   \
   \   *
    \  /
      * ------- groundPlane
      pG

.......
Idea:
.......

1. Get the vector from pB to pG (bodyToFootVector)
2. Project that vector to the hexapodBodyPlane (coxiaDirectionVector)
   The direction of this vector is the direction of
   coxiaVector and coxiaUnitVector

   And with a little bit of geometry you derive verything you need.

 * * */
const computeInitialLegProperties = (
    bodyContactPoint,
    groundContactPoint,
    zAxis,
    coxia
) => {
    const bodyToFootVector = vectorFromTo(bodyContactPoint, groundContactPoint)

    const coxiaDirectionVector = projectedVectorOntoPlane(bodyToFootVector, zAxis)
    const coxiaUnitVector = getUnitVector(coxiaDirectionVector)
    const coxiaVector = scaleVector(coxiaUnitVector, coxia)

    const coxiaPoint = addVectors(bodyContactPoint, coxiaVector)

    const rho = angleBetween(coxiaUnitVector, bodyToFootVector)
    const summa = vectorLength(bodyToFootVector)

    return {
        coxiaUnitVector,
        coxiaVector,
        coxiaPoint,
        rho,
        summa,
    }
}

/* * *

computeAlpha()

  hexapodYaxis
  ^
  |
  * --> hexapodXaxis (xAxis)
 /
hexapodZaxis (zAxis)

...............
Example #1 :
...............

             coxiaVector
              ^
              | legXaxis
              |  /        * legXaxisAngle
              | /            - Angle between legXaxis and hexapodXaxis
    * -- * -- *                (in this example: +45 degrees )
   /           \
  /             \          * Alpha
 *       *       *            - Angle between legXaxis and coxiaVector
  \             /                (in this example: +45 degrees)
   \           /
    * -- * -- *

...............
Example #2
...............

    * -- * -- *       * legXaxisAngle
   /           \          - (in this example: -45 degrees or +315 degrees)
  /             \      * Alpha
 *       *       *         - (in this example: -45 degrees)
  \             /
   \           /
    * -- * -- *
              |\              - (in this example: +45 degrees )
              | \
              | legXaxis
              V
              coxiaVector
 * * */
const computeAlpha = (coxiaVector, legXaxisAngle, xAxis, zAxis) => {
    const sign = isCounterClockwise(coxiaVector, xAxis, zAxis) ? -1 : 1
    const alphaWrtHexapod = sign * angleBetween(coxiaVector, xAxis)
    const alpha = (alphaWrtHexapod - legXaxisAngle) % 360

    if (alpha > 180) {
        return alpha - 360
    }
    if (alpha < -180) {
        return alpha + 360
    }

    // ❗❗❗THIS IS A HACK ❗❗❗
    // THERE IS A BUG HERE SOMEWHERE, FIND IT
    if (alpha === 180 || alpha === -180) {
        return 0
    }

    return alpha
}

export default IKSolver
