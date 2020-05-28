import Linkage from "./Linkage"
import * as oSolver1 from "./solvers/orientationSolverType1"
import { createVector, createHexagon, hexagonCloneTrotShift } from "./basicObjects"
import { POSITION_LIST } from "./constants"
import { POSE } from "../templates/hexapodParams"
import {
    pointNewTrot,
    pointCloneTrotShift,
    pointCloneTrot,
    frameToAlignVectorAtoB,
    tRotZframe,
} from "./utilities/geometry"
import { identity, atan2 } from "mathjs"

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

const DEFAULT_COG_PROJECTION = createVector(
    0,
    0,
    0,
    "centerOfGravityProjectionPoint"
)

const getCogProjection = cog =>
    createVector(cog.x, cog.y, 0, "centerOfGravityProjectionPoint")

const computeLocalFrame = frame => ({
    xAxis: pointNewTrot(WORLD_FRAME.xAxis, frame, "hexapodXaxis"),
    yAxis: pointNewTrot(WORLD_FRAME.yAxis, frame, "hexapodYaxis"),
    zAxis: pointNewTrot(WORLD_FRAME.zAxis, frame, "hexapodZaxis"),
})

const getSumOfDimensions = (bodyDimensions, legDimensions) =>
    bodyDimensions.front +
    bodyDimensions.middle +
    bodyDimensions.side +
    legDimensions.coxia +
    legDimensions.femur +
    legDimensions.tibia

const mightTwist = legsOnGround => {
    // Because we are ALWAYS starting at a pose where
    // all alphas are zero and
    // all foot tips are touching the ground, then
    // Hexapod will twist if three more alphas are non-zero
    // and the corresponding legs have foot tips are on the ground
    // The hexapod will only definitely NOT twist
    // if only two or lest of the legs that's
    // currently on the ground has alpha != 0
    const didTwistCount = legsOnGround.reduce((didTwistCount, leg) => {
        const pointType = leg.maybeGroundContactPoint.name.split("-")[1]
        const footTipOnGround = pointType !== "bodyContactPoint"
        const changedAlpha = leg.pose.alpha !== 0
        return footTipOnGround && changedAlpha ? didTwistCount + 1 : didTwistCount
    }, 0)
    return didTwistCount >= 3
}

const computeTwistFrame = (oldGroundContactPoints, newGroundContactPoints) => {
    // Because we are ALWAYS starting at a pose where
    // all alphas are zero and ground contacts are foot tips,
    // let's find atleast one point that are the same before and after
    const newSamePoint = newGroundContactPoints.find(point => {
        const pointType = point.name.split("-")[1]
        return pointType === "footTipPoint"
    })

    if (newSamePoint === undefined) {
        return [null, identity(4)]
    }

    const newPointPosition = newSamePoint.name.split("-")[0]
    const oldSamePoint = oldGroundContactPoints.find(point => {
        const oldPointPosition = point.name.split("-")[0]
        return newPointPosition === oldPointPosition
    })

    const thetaRadians =
        atan2(oldSamePoint.y, oldSamePoint.x) - atan2(newSamePoint.y, newSamePoint.x)
    const thetaDegrees = (thetaRadians * 180) / Math.PI
    return [thetaDegrees, tRotZframe(thetaDegrees)]
}

// Which point on each leg contacts the ground
// when all angles are equal to zero
const computeDefaultGroundContactPoints = (legDimensions, verticesList) =>
    computeLegsList(legDimensions, verticesList).map(
        leg => leg.maybeGroundContactPoint
    )

const computeLegsList = (legDimensions, verticesList, pose = POSE) =>
    POSITION_LIST.map(
        (position, index) =>
            new Linkage(legDimensions, position, verticesList[index], pose[position])
    )

class VirtualHexapod {
    constructor(
        bodyDimensions = { front: 100, middle: 100, side: 100 },
        legDimensions = { coxia: 100, femur: 100, tibia: 100 },
        pose = POSE
    ) {
        this.sumOfDimensions = getSumOfDimensions(bodyDimensions, legDimensions)
        // IMPORTANT: why is moving sum of dimensions to a helper messing thing up?
        this._storeInitialProperties(bodyDimensions, legDimensions, pose)

        const neutralHexagon = createHexagon(bodyDimensions)
        const legsWithoutGravity = computeLegsList(
            legDimensions,
            neutralHexagon.verticesList,
            pose
        )

        // STEP 1: Find new orientation of the body (new normal / nAxis).
        const [
            nAxis,
            height,
            legsOnGroundWithoutGravity,
        ] = oSolver1.computeOrientationProperties(legsWithoutGravity)

        this.distanceFromGround = height

        if (nAxis == null || isNaN(nAxis.x) || isNaN(nAxis.y) || isNaN(nAxis.z)) {
            console.log("invalid nAxis / unstable", nAxis)
            this._rawHexapod(neutralHexagon, legsWithoutGravity)
            return
        }

        // STEP 2: rotate and shift legs and body
        const frame = frameToAlignVectorAtoB(nAxis, WORLD_FRAME.zAxis)

        this.legs = legsWithoutGravity.map(leg =>
            leg.cloneTrotShift(frame, 0, 0, height)
        )

        this.body = hexagonCloneTrotShift(neutralHexagon, frame, 0, 0, height)
        this.localFrame = computeLocalFrame(frame)
        this.groundContactPoints = legsOnGroundWithoutGravity.map(leg =>
            pointCloneTrotShift(leg.maybeGroundContactPoint, frame, 0, 0, height)
        )

        if (mightTwist(legsOnGroundWithoutGravity)) {
            this._twist(legsOnGroundWithoutGravity, neutralHexagon.verticesList)
        }

        this.cogProjection = getCogProjection(this.body.cog)
    }

    _twist(legsOnGroundWithoutGravity, verticesList) {
        // since we known the previous pose is the when
        // all the angles === 0, then the old contacts are the foot tips
        const newGroundContactPoints = legsOnGroundWithoutGravity.map(
            leg => leg.maybeGroundContactPoint
        )
        const oldGroundContactPoints = computeDefaultGroundContactPoints(
            this.legDimensions,
            verticesList
        )
        const [twistAngle, twistFrame] = computeTwistFrame(
            oldGroundContactPoints,
            newGroundContactPoints
        )

        this.twistProperties = {
            hasTwisted: true,
            twistAngle,
            twistFrame,
        }

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

    // getDetachedHexagon
    // getTranslatedHexapod
    // getStancedHexapod
    _storeInitialProperties(legDimensions, bodyDimensions, pose) {
        this.legDimensions = legDimensions
        this.bodyDimensions = bodyDimensions
        this.pose = pose
        this.twistProperties = {
            hasTwisted: false,
            twistAngle: null,
            twistFrame: identity(4),
        }
    }
    _rawHexapod(body, legs) {
        this.body = body
        this.legs = legs
        this.localFrame = DEFAULT_LOCAL_FRAME
        this.cogProjection = DEFAULT_COG_PROJECTION
        this.groundContactPoints = []
    }
}

export default VirtualHexapod
