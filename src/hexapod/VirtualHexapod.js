import Linkage from "./Linkage"
import * as oSolver1 from "./solvers/orientSolverSpecific"
import { simpleTwist, mightTwist, complexTwist } from "./solvers/twistSolver"
import Hexagon from "./Hexagon"
import { POSITION_NAMES_LIST, POSITION_NAME_TO_ID_MAP } from "./constants"
import { matrixToAlignVectorAtoB, tRotZmatrix } from "./geometry"
import Vector from "./Vector"
import { DEFAULT_POSE } from "../templates"

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

const transformLocalAxes = (localAxes, twistMatrix) => ({
    xAxis: localAxes.xAxis.cloneTrot(twistMatrix),
    yAxis: localAxes.yAxis.cloneTrot(twistMatrix),
    zAxis: localAxes.zAxis.cloneTrot(twistMatrix),
})

const buildLegsList = (verticesList, pose, legDimensions) =>
    POSITION_NAMES_LIST.map(
        (position, index) =>
            new Linkage(legDimensions, position, verticesList[index], pose[position])
    )

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

[] this.legs: A list which has elements that point to six Linkage objects.
    The order goes counter clockwise starting from the first element
    which is the rightMiddle leg up until the last element which is rightBack leg.
    Each leg contains the points that define that leg
    as well as other properties pertaining it (see Linkage class)

[] this.legsPositionsOnGround: A list of the leg positions that are known to be
         in contact with the ground

{} this.localAxes: A hash containing three vectors defining the local
    coordinate frame of the hexapod wrt the world coordinate frame
    i.e. {
        xAxis: {x, y, z, name="hexapodXaxis", id="no-id"},
        yAxis: {x, y, z, name="hexapodYaxis", id="no-id"},
        zAxis: {x, y, z, name="hexapodZaxis", id="no-id"},
    }


## this.twistAngle: the angle the hexapod twist about its own z axis

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
    legsPositionsOnGround
    localAxes
    twistAngle
    foundSolution
    constructor(dimensions, pose, flags = { hasNoPoints: false }) {
        Object.assign(this, { dimensions, pose, twistAngle: 0 })

        if (flags.hasNoPoints) {
            return
        }

        const flatHexagon = new Hexagon(this.bodyDimensions)
        // prettier-ignore
        const legsNoGravity = buildLegsList(
            flatHexagon.verticesList, this.pose, this.legDimensions
        )

        // .................
        // STEP 1: Find new orientation of the body (new normal / nAxis).
        // .................
        const solved = oSolver1.computeOrientationProperties(legsNoGravity)

        if (solved === null) {
            this.foundSolution = false // unstable pose
            this._danglingHexapod(flatHexagon, legsNoGravity)
            return
        }
        this.foundSolution = true

        // .................
        // STEP 2: Rotate and shift legs and body to this orientation
        // .................
        const transformMatrix = matrixToAlignVectorAtoB(solved.nAxis, WORLD_AXES.zAxis)

        this.legs = legsNoGravity.map(leg =>
            leg.cloneTrotShift(transformMatrix, 0, 0, solved.height)
        )
        this.body = flatHexagon.cloneTrotShift(transformMatrix, 0, 0, solved.height)
        this.localAxes = computeLocalAxes(transformMatrix)

        this.legsPositionsOnGround = solved.groundLegsNoGravity.map(leg => leg.position)

        if (this.legs.every(leg => leg.pose.alpha === 0)) {
            // hexapod will not twist about z axis
            return
        }

        // .................
        // STEP 3: Twist around the zAxis if you have to
        // .................
        this.twistAngle = simpleTwist(solved.groundLegsNoGravity)
        if (this.twistAngle !== 0) {
            this._twist()
            return
        }

        if (mightTwist(solved.groundLegsNoGravity)) {
            // These are the ground contact points when the hexapod
            // is at default pose (ie all angles are zero)
            // prettier-ignore

            const defaultPoints = buildLegsList(
                flatHexagon.verticesList, DEFAULT_POSE, this.legDimensions
            ).map(
                leg => leg.cloneShift(0, 0, this.dimensions.tibia).maybeGroundContactPoint
            )

            const currentPoints = this.groundContactPoints
            this.twistAngle = complexTwist(currentPoints, defaultPoints)
            this._twist()
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

    get groundContactPoints() {
        return this.legsPositionsOnGround.map(position => {
            const index = POSITION_NAME_TO_ID_MAP[position]
            return this.legs[index].maybeGroundContactPoint
        })
    }

    cloneTrot(transformMatrix) {
        let clone = new VirtualHexapod(this.dimensions, this.pose, { hasNoPoints: true })
        clone.body = this.body.cloneTrot(transformMatrix)
        clone.legs = this.legs.map(leg => leg.cloneTrot(transformMatrix))
        clone.legsPositionsOnGround = this.legsPositionsOnGround

        // Note: Assumes that the transform matrix is a rotation transform only
        clone.localAxes = transformLocalAxes(this.localAxes, transformMatrix)
        return clone
    }

    cloneShift(tx, ty, tz) {
        let clone = new VirtualHexapod(this.dimensions, this.pose, { hasNoPoints: true })
        clone.body = this.body.cloneShift(tx, ty, tz)
        clone.legs = this.legs.map(leg => leg.cloneShift(tx, ty, tz))
        clone.localAxes = this.localAxes
        clone.legsPositionsOnGround = this.legsPositionsOnGround
        return clone
    }

    _twist() {
        const twistMatrix = tRotZmatrix(this.twistAngle)
        this.body = this.body.cloneTrot(twistMatrix)
        this.legs = this.legs.map(leg => leg.cloneTrot(twistMatrix))
        this.localAxes = transformLocalAxes(this.localAxes, twistMatrix)
    }

    _danglingHexapod(body, legs) {
        this.body = body
        this.legs = legs
        this.localAxes = {
            xAxis: new Vector(1, 0, 0, "hexapodXaxis"),
            yAxis: new Vector(0, 1, 0, "hexapodYaxis"),
            zAxis: new Vector(0, 0, 1, "hexapodZaxis"),
        }
       this.legsPositionsOnGround = []

    }
}

export default VirtualHexapod
