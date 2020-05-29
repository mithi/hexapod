import Linkage from "./Linkage"
import * as specificOSolver from "./solvers/orientationSolverSpecific"
import {
    createVector,
    createHexagon,
    hexagonCloneTrotShift,
    splitDimensions,
} from "./basicObjects"
import { POSITION_LIST } from "./constants"
import { DEFAULT_POSE, DEFAULT_DIMENSIONS } from "../templates/hexapodParams"

import {
    pointNewTrot,
    pointCloneTrotShift,
    pointCloneTrot,
    frameToAlignVectorAtoB,
    tRotZframe,
} from "./utilities/geometry"
import { identity } from "mathjs"

const WORLD_FRAME = {
    xAxis: createVector(1, 0, 0, "wXaxis"),
    yAxis: createVector(0, 1, 0, "wYaxis"),
    zAxis: createVector(0, 0, 1, "wZaxis"),
}

const DEFAULT_COG_PROJECTION = createVector(
    0,
    0,
    0,
    "centerOfGravityProjectionPoint"
)

const DEFAULT_LOCAL_FRAME = {
    xAxis: { ...WORLD_FRAME.xAxis, name: "hexapodXaxis" },
    yAxis: { ...WORLD_FRAME.yAxis, name: "hexapodYaxis" },
    zAxis: { ...WORLD_FRAME.zAxis, name: "hexapodZaxis" },
}

const getCogProjection = cog =>
    createVector(cog.x, cog.y, 0, "centerOfGravityProjectionPoint")

const computeLocalFrame = frame => ({
    xAxis: pointNewTrot(WORLD_FRAME.xAxis, frame, "hexapodXaxis"),
    yAxis: pointNewTrot(WORLD_FRAME.yAxis, frame, "hexapodYaxis"),
    zAxis: pointNewTrot(WORLD_FRAME.zAxis, frame, "hexapodZaxis"),
})

const getSumOfDimensions = dimensions =>
    Object.values(dimensions).reduce((sum, dimension) => sum + dimension, 0)

const computeLegsList = (legDimensions, verticesList, pose = DEFAULT_POSE) =>
    POSITION_LIST.map(
        (position, index) =>
            new Linkage(legDimensions, position, verticesList[index], pose[position])
    )

const simpleTwist = legsOnGroundWithoutGravity => {
    // we twist in the condition that
    // 1. all the legs pose has same alpha
    // 2. the ground contact is not the coxia point
    const firstAlpha = legsOnGroundWithoutGravity[0].pose.alpha
    const allAlphaTwist = legsOnGroundWithoutGravity.every(leg => {
        const sameAlpha = leg.pose.alpha === firstAlpha
        const pointType = leg.maybeGroundContactPoint.name.split("-")[1]
        return sameAlpha && pointType !== "coxiaPoint"
    })

    return !allAlphaTwist ? 0 : -firstAlpha
}

class VirtualHexapod {
    constructor(dimensions = DEFAULT_DIMENSIONS, pose = DEFAULT_POSE) {
        this.sumOfDimensions = getSumOfDimensions(dimensions)
        // IMPORTANT: why is moving sum of dimensions to a helper messing thing up?
        this._storeInitialProperties(dimensions, pose)

        const neutralHexagon = createHexagon(this.bodyDimensions)
        const legsWithoutGravity = computeLegsList(
            this.legDimensions,
            neutralHexagon.verticesList,
            pose
        )

        // STEP 1: Find new orientation of the body (new normal / nAxis).
        const [
            nAxis,
            height,
            legsOnGroundWithoutGravity,
        ] = specificOSolver.computeOrientationProperties(legsWithoutGravity)

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
        this.cogProjection = getCogProjection(this.body.cog)

        if (this.legs.every(leg => leg.pose.alpha === 0)) {
            return
        }

        const twistAngle = simpleTwist(legsOnGroundWithoutGravity)
        this._twist(twistAngle)
    }

    _twist(twistAngle) {
        const twistFrame = tRotZframe(twistAngle)
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
    _storeInitialProperties(dimensions, pose) {
        const [bodyDimensions, legDimensions] = splitDimensions(dimensions)
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
