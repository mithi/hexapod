import Linkage from "./Linkage"
import * as oSolver1 from "./solvers/orientationSolverType1"
import {
    createVector,
    createHexagon,
    hexagonWrtFrameShiftClone,
} from "./basicObjects"
import { POSITION_LIST } from "./constants"
import { POSE } from "../templates/hexapodParams"
import {
    pointWrtFrame,
    shiftedPointClone,
    frameToAlignVectorAtoB,
    pointWrtFrameShiftClone,
    pointWrtFrameClone,
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
    xAxis: pointWrtFrame(WORLD_FRAME.xAxis, frame, "hexapodXaxis"),
    yAxis: pointWrtFrame(WORLD_FRAME.yAxis, frame, "hexapodYaxis"),
    zAxis: pointWrtFrame(WORLD_FRAME.zAxis, frame, "hexapodZaxis"),
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
        const [_, pointType] = leg.maybeGroundContactPoint.name.split("-")
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
        return identity(4)
    }

    const [newPointPosition, _] = newSamePoint.name.split("-")
    const oldSamePoint = oldGroundContactPoints.find(point => {
        const [oldPointPosition, _] = point.name.split("-")
        return newPointPosition === oldPointPosition
    })

    const thetaRadians =
        atan2(oldSamePoint.y, oldSamePoint.x) - atan2(newSamePoint.y, newSamePoint.x)
    const thetaDegrees = (thetaRadians * 180) / Math.PI
    return tRotZframe(thetaDegrees)
}

// Which point on each leg contacts the ground
// when all angles are equal to zero
const computeDefaultGroundContactPoints = (legDimensions, verticesList) =>
    POSITION_LIST.map(
        (position, index) =>
            new Linkage(legDimensions, position, verticesList[index], {
                alpha: 0,
                beta: 0,
                gamma: 0,
            }).maybeGroundContactPoint
    )

class VirtualHexapod {
    constructor(
        bodyDimensions = { front: 100, middle: 100, side: 100 },
        legDimensions = { coxia: 100, femur: 100, tibia: 100 },
        pose = POSE
    ) {
        this.sumOfDimensions = getSumOfDimensions(bodyDimensions, legDimensions)
        const neutralHexagon = createHexagon(bodyDimensions)
        const legListWithoutGravity = POSITION_LIST.map(
            (position, index) =>
                new Linkage(
                    legDimensions,
                    position,
                    neutralHexagon.verticesList[index],
                    pose[position]
                )
        )

        // STEP 1: Find new orientation of the body (new normal / nAxis).
        // distance of cog from ground and which legs are on the ground
        const [
            nAxis,
            height,
            legsOnGroundWithoutGravity,
        ] = oSolver1.computeOrientationProperties(legListWithoutGravity)

        if (nAxis == null || isNaN(nAxis.x) || isNaN(nAxis.y) || isNaN(nAxis.z)) {
            console.log("invalid nAxis / unstable", nAxis)
            return this.rawHexapod(neutralHexagon, legListWithoutGravity)
        }

        // STEP 2: rotate and shift legs and body
        const frame = frameToAlignVectorAtoB(nAxis, WORLD_FRAME.zAxis)

        this.legs = legListWithoutGravity.map(leg =>
            leg.wrtFrameShiftClone(frame, 0, 0, height)
        )

        this.body = hexagonWrtFrameShiftClone(neutralHexagon, frame, 0, 0, height)
        this.localFrame = computeLocalFrame(frame)
        this.groundContactPoints = legsOnGroundWithoutGravity.map(leg =>
            pointWrtFrameShiftClone(leg.maybeGroundContactPoint, frame, 0, 0, height)
        )

        // STEP 3: Twist if we have to
        if (mightTwist(legsOnGroundWithoutGravity)) {
            // since we known the previous pose is the when
            // all the angles === 0, then the old contacts are the foot tips
            const newGroundContactPoints = legsOnGroundWithoutGravity.map(
                leg => leg.maybeGroundContactPoint
            )
            const oldGroundContactPoints = computeDefaultGroundContactPoints(
                legDimensions,
                neutralHexagon.verticesList
            )
            const twistFrame = computeTwistFrame(
                oldGroundContactPoints,
                newGroundContactPoints
            )
            this.legs = this.legs.map(leg =>
                leg.wrtFrameShiftClone(twistFrame, 0, 0, 0)
            )
            this.body = hexagonWrtFrameShiftClone(this.body, twistFrame)
            this.groundContactPoints = this.groundContactPoints.map(point =>
                pointWrtFrameClone(point, twistFrame)
            )
            this.localFrame = {
                xAxis: pointWrtFrameClone(this.localFrame.xAxis, twistFrame),
                yAxis: pointWrtFrameClone(this.localFrame.yAxis, twistFrame),
                zAxis: pointWrtFrameClone(this.localFrame.zAxis, twistFrame),
            }
        }

        this.cogProjection = getCogProjection(this.body.cog)
    }

    // getDetachedHexagon
    // getTranslatedHexapod
    // getStancedHexapod

    rawHexapod(body, legs) {
        return {
            ...this,
            body,
            legs,
            localFrame: DEFAULT_LOCAL_FRAME,
            cogProjection: DEFAULT_COG_PROJECTION,
            groundContactPoints: [],
        }
    }
}

export default VirtualHexapod
