import { POSITION_NAMES_LIST, POSITION_NAME_TO_ID_MAP } from "./constants"
import { matrixToAlignVectorAtoB, tRotZmatrix } from "./geometry"
import { DEFAULT_POSE } from "../templates"

import Vector from "./Vector"
import Hexagon from "./Hexagon"
import Linkage from "./Linkage"

import * as oSolverGeneral from "./solvers/orient/orientSolverGeneral"
import * as oSolverSpecific from "./solvers/orient/orientSolverSpecific"

import { simpleTwist, mightTwist, complexTwist } from "./solvers/twistSolver"

const DEFAULT_LOCAL_AXES = {
    xAxis: new Vector(1, 0, 0, "hexapodXaxis"),
    yAxis: new Vector(0, 1, 0, "hexapodYaxis"),
    zAxis: new Vector(0, 0, 1, "hexapodZaxis"),
}

const transformLocalAxes = (localAxes, twistMatrix) => ({
    xAxis: localAxes.xAxis.cloneTrot(twistMatrix),
    yAxis: localAxes.yAxis.cloneTrot(twistMatrix),
    zAxis: localAxes.zAxis.cloneTrot(twistMatrix),
})

/* * *
 build a list of six legs
 given dimensions and  the respective
 bodyContacts points and pose
 * * */
const buildLegsList = (bodyContactPoints, pose, legDimensions) =>
    POSITION_NAMES_LIST.map(
        (position, index) =>
            new Linkage(legDimensions, position, bodyContactPoints[index], pose[position])
    )

const hexapodErrorInfo = () => ({
    isAlert: true,
    subject: "Unstable position.",
    body: "error in solving for orientation ",
})

const hexapodSuccessInfo = () => ({
    isAlert: false,
    subject: "Success!",
    body: "Stable orientation found.",
})

/* * *

............................
 Virtual Hexapod properties
............................

Property types:
{}: hash map / object / dictionary
[]: array / list
##: number
"": string

{} this.dimensions: {front, side, middle, coxia, femur, tibia}

{} this.pose: A hash mapping the position name to a hash map of three angles
    which define the pose of the hexapod
    i.e. { rightMiddle: {alpha, beta, gamma },
           leftBack: { alpha, betam gamma },
             ...
         }

[] this.body: A hexagon object
    which contains all the info of the 8 points defining the hexapod body
    (6 vertices, 1 head, 1 center of gravity)

[] this.legs: A list which has elements that point to six Linkage objects.
    The order goes counter clockwise starting from the first element
    which is the rightMiddle leg up until the last element which is rightBack leg.
    Each leg contains the points that define that leg
    as well as other properties pertaining it (see Linkage class)

[] this.legPositionsOnGround: A list of the leg positions (strings)
    that are known to be in contact with the ground

{} this.localAxes: A hash containing three vectors defining the local
    coordinate frame of the hexapod wrt the world coordinate frame
    i.e. {
        xAxis: {x, y, z, name="hexapodXaxis", id="no-id"},
        yAxis: {x, y, z, name="hexapodYaxis", id="no-id"},
        zAxis: {x, y, z, name="hexapodZaxis", id="no-id"},
    }

....................
(virtual hexapod derived properties)
....................

{} this.bodyDimensions: { front, side, middle }
{} this.legDimensions: { coxia, femur, tibia }

## this.distanceFromGround: A number which is the perpendicular distance
    from the hexapod's center of gravity to the ground plane

{} this.cogProjection: a point that represents the projection
    of the hexapod's center of gravity point to the ground plane
    i.e { x, y, z, name="centerOfGravityProjectionPoint", id="no-id"}

[] this.groundContactPoints: a list whose elements point to points
    from the leg which contacts the ground.
    This list can contain 6 or less elements.
    (It can have a length of 3, 4, 5 or 6)
    i.e. [
        { x, y, z, name="rightMiddle-femurPoint", id="0-2"},
        { x, y, z, name="leftBack-footTipPoint", id=4-3},
         ...
    ]

 * * */
class VirtualHexapod {
    dimensions
    pose
    body
    legs
    legPositionsOnGround
    localAxes
    foundSolution
    constructor(
        dimensions,
        pose,
        flags = { hasNoPoints: false, assumeKnownGroundPoints: false, wontRotate: false }
    ) {
        Object.assign(this, { dimensions, pose })

        if (flags.hasNoPoints) {
            return
        }

        // .................
        // STEP 1: Build a flatHexagon and 'dangling' linkages
        // then find  properties we can derive from this
        // .................

        const flatHexagon = new Hexagon(this.bodyDimensions)

        // legsNoGravity are linkages have the correct pose but
        // are not necessarily correctly oriented wrt the world
        // prettier-ignore
        const legsNoGravity = buildLegsList(
            flatHexagon.verticesList, this.pose, this.legDimensions
        )

        // `solved` has:
        // - new orientation of the body (nAxis)
        // - which legs are on the ground (groundLegsNoGravity)
        // - distance of center of gravity to the ground (height)
        const solved = flags.assumeKnownGroundPoints
            ? oSolverSpecific.computeOrientationProperties(legsNoGravity)
            : oSolverGeneral.computeOrientationProperties(legsNoGravity)

        if (solved === null) {
            this.foundSolution = false
            return
        }

        this.foundSolution = true
        this.legPositionsOnGround = solved.groundLegsNoGravity.map(leg => leg.position)

        // .................
        // STEP 2: Rotate and shift legs and body given what we've solved
        // .................

        // prettier-ignore
        const transformMatrix = matrixToAlignVectorAtoB(
            solved.nAxis, DEFAULT_LOCAL_AXES.zAxis
        )

        this.legs = legsNoGravity.map(leg =>
            leg.cloneTrotShift(transformMatrix, 0, 0, solved.height)
        )
        this.body = flatHexagon.cloneTrotShift(transformMatrix, 0, 0, solved.height)
        this.localAxes = transformLocalAxes(DEFAULT_LOCAL_AXES, transformMatrix)

        // .................
        // STEP 3: Twist around the zAxis if you have to
        // .................
        if (flags.wontRotate) {
            return
        }

        // case 1: hexapod will not twist about z axis
        if (this.legs.every(leg => leg.pose.alpha === 0)) {
            return
        }

        // case 2: When all alpha angles are the same for all legs
        const twistAngle = simpleTwist(solved.groundLegsNoGravity)
        if (this.maybeTwistAngle !== 0) {
            this._twist(twistAngle)
            return
        }

        // case 3: All other cases
        if (mightTwist(solved.groundLegsNoGravity)) {
            this._handleComplexTwist(flatHexagon.verticesList)
        }
    }

    get distanceFromGround() {
        return this.body.cog.z
    }

    get cogProjection() {
        return new Vector(
            this.body.cog.x,
            this.body.cog.y,
            0,
            "centerOfGravityProjectionPoint"
        )
    }

    get info() {
        return this.foundSolution ? hexapodSuccessInfo() : hexapodErrorInfo()
    }

    get bodyDimensions() {
        const { front, middle, side } = this.dimensions
        return { front, middle, side }
    }

    get legDimensions() {
        const { coxia, femur, tibia } = this.dimensions
        return { coxia, femur, tibia }
    }

    get groundContactPoints() {
        return this.legPositionsOnGround.map(position => {
            const index = POSITION_NAME_TO_ID_MAP[position]
            return this.legs[index].maybeGroundContactPoint
        })
    }

    cloneTrot(transformMatrix) {
        // Note: transform matrix passed should be purely rotational
        const body = this.body.cloneTrot(transformMatrix)
        const legs = this.legs.map(leg => leg.cloneTrot(transformMatrix))
        const localAxes = transformLocalAxes(this.localAxes, transformMatrix)
        return this._buildClone(body, legs, localAxes)
    }

    cloneShift(tx, ty, tz) {
        const body = this.body.cloneShift(tx, ty, tz)
        const legs = this.legs.map(leg => leg.cloneShift(tx, ty, tz))
        return this._buildClone(body, legs, this.localAxes)
    }

    _buildClone(body, legs, localAxes) {
        // FIXME:
        // After shifting and/or rotating the hexapod
        // We can no longer guarrantee that the legPositionsOnGround
        // is the same as before
        // must handle this soon!!
        let clone = new VirtualHexapod(this.dimensions, this.pose, { hasNoPoints: true })
        Object.assign(clone, {
            body,
            legs,
            localAxes,
            legPositionsOnGround: this.legPositionsOnGround,
            foundSolution: this.foundSolution,
        })
        return clone
    }

    _handleComplexTwist(verticesList) {
        // prettier-ignore
        const defaultLegs = buildLegsList(
            verticesList, DEFAULT_POSE, this.legDimensions
        )

        // DefaultLegs: The list of legs when a hexapod
        // of these dimensions is at the default pose
        // (ie all angles are zero)
        // DefaultPoints: the corresponding ground contact
        // points of defaultLegs
        const defaultPoints = defaultLegs.map(
            leg => leg.cloneShift(0, 0, this.dimensions.tibia).maybeGroundContactPoint
        )

        // currentPoints: Where the ground contact points are currently
        // given all the transformations we have done so far
        const currentPoints = this.groundContactPoints
        const twistAngle = complexTwist(currentPoints, defaultPoints)

        if (twistAngle !== 0) {
            this._twist()
        }
    }

    _twist(twistAngle) {
        const twistMatrix = tRotZmatrix(twistAngle)
        this.body = this.body.cloneTrot(twistMatrix)
        this.legs = this.legs.map(leg => leg.cloneTrot(twistMatrix))
        this.localAxes = transformLocalAxes(this.localAxes, twistMatrix)
    }
}

export default VirtualHexapod
