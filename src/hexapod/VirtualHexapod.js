import Linkage from "./Linkage"
import * as specificOSolver from "./solvers/orientationSolverSpecific"
import { createVector, createHexagon, hexagonCloneTrotShift } from "./basicObjects"
import { POSITION_LIST } from "./constants"
import { DEFAULT_POSE, DEFAULT_DIMENSIONS } from "../templates/hexapodParams"
import {
    pointNewTrot,
    pointCloneTrotShift,
    pointCloneTrot,
    frameToAlignVectorAtoB,
    tRotZframe,
} from "./utilities/geometry"

const WORLD_FRAME = {
    xAxis: createVector(1, 0, 0, "wXaxis"),
    yAxis: createVector(0, 1, 0, "wYaxis"),
    zAxis: createVector(0, 0, 1, "wZaxis"),
}

const DEFAULT_LOCAL_FRAME = {
    xAxis: { ...WORLD_FRAME.xAxis, name: "hexapodXaxis" },
    yAxis: { ...WORLD_FRAME.yAxis, name: "hexapodYaxis" },
    zAxis: { ...WORLD_FRAME.zAxis, name: "hexapodZaxis" },
}

const computeLocalFrame = frame => ({
    xAxis: pointNewTrot(WORLD_FRAME.xAxis, frame, "hexapodXaxis"),
    yAxis: pointNewTrot(WORLD_FRAME.yAxis, frame, "hexapodYaxis"),
    zAxis: pointNewTrot(WORLD_FRAME.zAxis, frame, "hexapodZaxis"),
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
    const allAlphaTwist = legsOnGroundWithoutGravity.every(leg => {
        const sameAlpha = leg.pose.alpha === firstAlpha
        if (!sameAlpha) {
            return false
        }

        const pointType = leg.maybeGroundContactPoint.name.split("-")[1]
        if (["bodyContactPoint", "coxiaPoint"].includes(pointType)) {
            return false
        }
        if (pointType === "footTipPoint") {
            return true
        }

        // pointType is femurPoint at this point
        const hexapodBodyPlaneOnGround =
            leg.pointsMap["bodyContactPoint"].z === leg.pointsMap["femurPoint"].z
        if (hexapodBodyPlaneOnGround) {
            return false
        }
        return true
    })

    return !allAlphaTwist ? 0 : -firstAlpha
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

        const neutralHexagon = createHexagon(this.bodyDimensions)
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

        this.body = hexagonCloneTrotShift(neutralHexagon, frame, 0, 0, height)
        this.localFrame = computeLocalFrame(frame)
        this.groundContactPoints = legsOnGroundWithoutGravity.map(leg =>
            pointCloneTrotShift(leg.maybeGroundContactPoint, frame, 0, 0, height)
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
        return createVector(
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
        return {
            front: this.dimensions.front,
            middle: this.dimensions.middle,
            side: this.dimensions.side,
        }
    }

    get legDimensions() {
        return {
            coxia: this.dimensions.coxia,
            femur: this.dimensions.femur,
            tibia: this.dimensions.tibia,
        }
    }

    _twist() {
        const twistFrame = tRotZframe(this.twistAngle)
        this.legs = this.legs.map(leg => leg.cloneTrotShift(twistFrame))
        this.body = hexagonCloneTrotShift(this.body, twistFrame)
        this.groundContactPoints = this.groundContactPoints.map(point =>
            pointCloneTrotShift(point, twistFrame)
        )
        this.localFrame = {
            xAxis: pointCloneTrot(this.localFrame.xAxis, twistFrame),
            yAxis: pointCloneTrot(this.localFrame.yAxis, twistFrame),
            zAxis: pointCloneTrot(this.localFrame.zAxis, twistFrame),
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
        this.localFrame = DEFAULT_LOCAL_FRAME
        this.groundContactPoints = []
    }

    // getDetachedHexagon
    // getTranslatedHexapod
    // getStancedHexapod
}

export default VirtualHexapod
