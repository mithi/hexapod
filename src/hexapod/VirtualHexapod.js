import Linkage from "./Linkage"
import * as specificOSolver from "./solvers/orientationSolverSpecific"
import Hexagon from "./basicObjects"
import { POSITION_LIST } from "./constants"
import { DEFAULT_POSE, DEFAULT_DIMENSIONS } from "../templates/hexapodParams"
import { frameToAlignVectorAtoB, tRotZframe, Vector } from "./utilities/geometry"
import { identity } from "mathjs"

const WORLD_FRAME = {
    xAxis: new Vector(1, 0, 0, "worldXaxis"),
    yAxis: new Vector(0, 1, 0, "worldYaxis"),
    zAxis: new Vector(0, 0, 1, "worldZaxis"),
}

const computeLocalFrame = frame => ({
    xAxis: WORLD_FRAME.xAxis.newTrot(frame, "hexapodXaxis"),
    yAxis: WORLD_FRAME.yAxis.newTrot(frame, "hexapodYaxis"),
    zAxis: WORLD_FRAME.zAxis.newTrot(frame, "hexapodZaxis"),
})

const computeLegsList = (legDimensions, verticesList, pose = DEFAULT_POSE) =>
    POSITION_LIST.map(
        (position, index) =>
            new Linkage(legDimensions, position, verticesList[index], pose[position])
    )

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


{} this.localFrame: A hash containing three vectors defining the local
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
    constructor(dimensions = DEFAULT_DIMENSIONS, pose = DEFAULT_POSE) {
        // IMPORTANT: why is moving sum of dimensions to a helper messing thing up?
        this._storeInitialProperties(dimensions, pose)

        const neutralHexagon = new Hexagon(this.bodyDimensions)
        const legsWithoutGravity = computeLegsList(
            this.legDimensions,
            neutralHexagon.verticesList,
            pose
        )

        // .................
        // STEP 1: Find new orientation of the body (new normal / nAxis).
        // .................
        const [
            nAxis,
            height,
            legsOnGroundWithoutGravity,
        ] = specificOSolver.computeOrientationProperties(legsWithoutGravity)

        if (nAxis == null || isNaN(nAxis.x) || isNaN(nAxis.y) || isNaN(nAxis.z)) {
            // Unstable pose
            this._rawHexapod(neutralHexagon, legsWithoutGravity)
            return
        }

        // .................
        // STEP 2: Rotate and shift legs and body to this orientation
        // .................
        const frame = frameToAlignVectorAtoB(nAxis, WORLD_FRAME.zAxis)

        this.legs = legsWithoutGravity.map(leg =>
            leg.cloneTrotShift(frame, 0, 0, height)
        )

        this.body = neutralHexagon.cloneTrotShift(frame, 0, 0, height)
        this.localFrame = computeLocalFrame(frame)
        this.groundContactPoints = legsOnGroundWithoutGravity.map(leg =>
            leg.maybeGroundContactPoint.cloneTrotShift(frame, 0, 0, height)
        )

        if (this.legs.every(leg => leg.pose.alpha === 0)) {
            // hexapod will not twist about z axis
            return
        }

        // handles the case were all alpha angles uniformly twist
        this.twistAngle = simpleTwist(legsOnGroundWithoutGravity)
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

    _twist() {
        const twistFrame = tRotZframe(this.twistAngle)
        this.legs = this.legs.map(leg => leg.cloneTrotShift(twistFrame))
        this.body = this.body.cloneTrotShift(twistFrame)
        this.groundContactPoints = this.groundContactPoints.map(point =>
            point.cloneTrot(twistFrame)
        )
        this.localFrame = {
            xAxis: this.localFrame.xAxis.cloneTrot(twistFrame),
            yAxis: this.localFrame.yAxis.cloneTrot(twistFrame),
            zAxis: this.localFrame.zAxis.cloneTrot(twistFrame),
        }
    }

    _storeInitialProperties(dimensions, pose) {
        this.dimensions = dimensions
        this.pose = pose
        this.twistAngle = 0
    }

    _rawHexapod(body, legs) {
        this.body = body
        this.legs = legs
        this.localFrame = computeLocalFrame(identity(4))
        this.groundContactPoints = []
    }

    // getDetachedHexagon
    // getTranslatedHexapod
    // getStancedHexapod
}

export default VirtualHexapod
