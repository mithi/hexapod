import { identity } from "mathjs"
import Linkage from "./Linkage"
import * as oSolver1 from "./solvers/orientationSolverSpecific"
import Hexagon from "./Hexagon"
import { POSITION_LIST } from "./constants"
import { matrixToAlignVectorAtoB, tRotZmatrix } from "./utilities/geometry"
import Vector from "./Vector"

const WORLD_AXES = {
    xAxis: new Vector(1, 0, 0, "worldXaxis"),
    yAxis: new Vector(0, 1, 0, "worldYaxis"),
    zAxis: new Vector(0, 0, 1, "worldZaxis"),
}

const computeLocalAxes = transformMatrix => ({
    xAxis: WORLD_AXES.xAxis.newTrot(transformMatrix, "hexapodXaxis"),
    yAxis: WORLD_AXES.yAxis.newTrot(transformMatrix, "hexapodYaxis"),
    zAxis: WORLD_AXES.zAxis.newTrot(transformMatrix, "hexapodZaxis"),
})

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

/* * *

............................
 Virtual Hexapod properties
............................

Property types:
{}: hash / object / dictionary
[]: array / list
##: number
"": string

{} this.dimensions: {front, side, middle, coxia, femur, tibia}

{} this.pose: A hash mapping the position name to a hash of three angles
    which define the pose of the hexapod
    i.e. { rightMiddle: {alpha, beta, gamma },
           leftBack: { alpha, betam gamma },
             ...
         }

[] this.body: A hexagon object
    which contains all the info of the 8 points defining the hexapod body
    (6 vertices, 1 head, 1 center of gravity)

[] this.legs: A list whose elemens point to six Linkage objects.
    One linkage object for each leg,
    the first element is the rightMiddle leg and the last
    element is rightBack leg.
    Each leg contains the points that define that leg
    as well as other properties pertaining it (see Linkage class)


{} this.localAxes: A hash containing three vectors defining the local
    coordinate frame of the hexapod wrt the world coordinate frame
    i.e. {
        xAxis: {x, y, z, name="hexapodXaxis", id="no-id"},
        yAxis: {x, y, z, name="hexapodYaxis", id="no-id"},
        zAxis: {x, y, z, name="hexapodZaxis", id="no-id"},
    }

[] this.groundContactPoints: a list whose elements point to points
    from the leg which contacts the ground.
    This list can contain 6 or less elements.
    (It can have a length of 3, 4, 5 or 6)
    i.e. [
        { x, y, z, name="rightMiddle-femurPoint", id="0-2"},
        { x, y, z, name="leftBack-footTipPoint", id=4-3},
         ...
    ]

## this.twistAngle: the angle the hexapod twist about its own z axis

....................
(virtual hexapod derived properties)
....................

## this.distanceFromGround: A number which is the perpendicular distance
    from the hexapod's center of gravity to the ground plane

{} this.cogProjection: a point that represents the projection
    of the hexapod's center of gravity point to the ground plane
    i.e { x, y, z, name="centerOfGravityProjectionPoint", id="no-id"}

{} this.bodyDimensions: { front, side, middle }
{} this.legDimensions: { coxia, femur, tibia }

 * * */
class VirtualHexapod {
    constructor(dimensions, pose, flags = { noGravity: false }) {
        this._storeInitialProperties(dimensions, pose)

        const flatHexagon = new Hexagon(this.bodyDimensions)
        const legsNoGravity = this._computeLegsList(flatHexagon.verticesList)

        if (flags.noGravity) {
            this._rawHexapod(flatHexagon, legsNoGravity)
            return
        }
        // .................
        // STEP 1: Find new orientation of the body (new normal / nAxis).
        // .................
        const result = oSolver1.computeOrientationProperties(legsNoGravity)
        const [nAxis, height, groundLegsNoGravity] = result

        if (nAxis == null) {
            //unstable pose, or specified
            this._rawHexapod(flatHexagon, legsNoGravity)
            return
        }

        // .................
        // STEP 2: Rotate and shift legs and body to this orientation
        // .................
        const transformMatrix = matrixToAlignVectorAtoB(nAxis, WORLD_AXES.zAxis)

        this.legs = legsNoGravity.map(leg => leg.cloneTrotShift(transformMatrix, 0, 0, height))
        this.body = flatHexagon.cloneTrotShift(transformMatrix, 0, 0, height)
        this.localAxes = computeLocalAxes(transformMatrix)

        this.groundContactPoints = groundLegsNoGravity.map(leg =>
            leg.maybeGroundContactPoint.cloneTrotShift(transformMatrix, 0, 0, height)
        )

        if (this.legs.every(leg => leg.pose.alpha === 0)) {
            // hexapod will not twist about z axis
            return
        }

        // handles the case were all alpha angles uniformly twist
        this.twistAngle = simpleTwist(groundLegsNoGravity)
        this._twist()
        // we'll handle more complex types of list soon...
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

    get hasTwisted() {
        return this.twistAngle !== 0
    }

    get bodyDimensions() {
        const { front, middle, side } = this.dimensions
        return { front, middle, side }
    }

    get legDimensions() {
        const { coxia, femur, tibia } = this.dimensions
        return { coxia, femur, tibia }
    }

    _computeLegsList = verticesList =>
        POSITION_LIST.map(
            (position, index) =>
                new Linkage(
                    this.legDimensions,
                    position,
                    verticesList[index],
                    this.pose[position]
                )
        )

    _twist() {
        const twistMatrix = tRotZmatrix(this.twistAngle)
        this.legs = this.legs.map(leg => leg.cloneTrotShift(twistMatrix))
        this.body = this.body.cloneTrotShift(twistMatrix)
        this.groundContactPoints = this.groundContactPoints.map(point =>
            point.cloneTrot(twistMatrix)
        )

        const { xAxis, yAxis, zAxis } = this.localAxes
        this.localAxes = {
            xAxis: xAxis.cloneTrot(twistMatrix),
            yAxis: yAxis.cloneTrot(twistMatrix),
            zAxis: zAxis.cloneTrot(twistMatrix),
        }
    }

    _storeInitialProperties(dimensions, pose) {
        this.dimensions = dimensions
        this.pose = pose
        this.twistAngle = 0
    }

    _rawHexapod(body, legs) {
        const transformMatrix = identity(4)
        const height = this.legDimensions.tibia * 2
        this.body = body.cloneTrotShift(transformMatrix, 0, 0, height)
        this.legs = legs.map(leg => leg.cloneTrotShift(transformMatrix, 0, 0, height))
        this.localAxes = computeLocalAxes(transformMatrix)
        this.groundContactPoints = []
    }

    // getDetachedHexagon
    // getTranslatedHexapod
    // getStancedHexapod
}

export default VirtualHexapod
