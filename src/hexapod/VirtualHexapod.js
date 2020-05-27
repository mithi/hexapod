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
    dot,
    cross,
    vectorLength,
    pointWrtFrame,
    pointWrtFrameShiftClone,
} from "./utilities/geometry"
import {
    matrix,
    identity,
    multiply,
    concat,
    transpose,
    dotMultiply,
    ones,
    add,
} from "mathjs"

const skew = p =>
    matrix([
        [0, -p.z, p.y],
        [p.z, 0, -p.x],
        [-p.y, p.x, 0],
    ])

// https://math.stackexchange.com/questions/180418/
// calculate-rotation-matrix-to-align-vector-a-to-vector-b-in-3d
const frameToAlignVectorAtoB = (a, b) => {
    const v = cross(a, b)
    const s = vectorLength(v)
    // When angle between a and b is zero or 180 degrees
    // cross product is 0, R = I
    if (s === 0) {
        return identity(4)
    }

    const c = dot(a, b)
    const vx = skew(v)
    const d = (1 - c) / (s * s)
    const vx2 = multiply(vx, vx)
    const dvx2 = dotMultiply(vx2, multiply(ones(3, 3), d))
    const r = add(add(identity(3), vx), dvx2)
    const r_ = concat(r, [[0, 0, 0]], 0)
    const frame = concat(r_, transpose([[0, 0, 0, 1]]), 1)
    return frame
}

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

class VirtualHexapod {
    constructor(
        bodyDimensions = { front: 100, middle: 100, side: 100 },
        legDimensions = { coxia: 100, femur: 100, tibia: 100 },
        pose = POSE
    ) {
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

        // STEP 1:
        // Find new orientation of the body (new normal / nAxis)
        // distance of cog from ground and which legs are on the ground
        // if none, then this is unstable, return error
        const [nAxis, height, legsOnGround] = oSolver1.computeOrientationProperties(
            legListWithoutGravity
        )

        if (nAxis == null || isNaN(nAxis.x) || isNaN(nAxis.y) || isNaN(nAxis.z)) {
            console.log("invalid nAxis:", nAxis)
            return {
                ...this,
                legs: legListWithoutGravity,
                body: neutralHexagon,
                localFrame: DEFAULT_LOCAL_FRAME,
                cogProjection: DEFAULT_COG_PROJECTION,
                groundContactPoints: [],
            }
        }

        // STEP 2:
        // rotate and shift legs and body
        const frame = frameToAlignVectorAtoB(nAxis, WORLD_FRAME.zAxis)
        this.legs = legListWithoutGravity.map(leg =>
            leg.WrtFrameShiftClone(frame, 0, 0, height)
        )

        this.body = hexagonWrtFrameShiftClone(neutralHexagon, frame, 0, 0, height)
        this.localFrame = computeLocalFrame(frame)

        this.groundContactPoints = legsOnGround.map(leg =>
            pointWrtFrameShiftClone(leg.maybeGroundContactPoint, frame, 0, 0, height)
        )

        // STEP 3: Twist if we have to
        // Hexapod will twist if three more alphas are non-zero
        // and the corresponding legs have foot tips that are NOT above body contact
        this.cogProjection = getCogProjection(this.body.cog)
        this.sumOfDimensions = getSumOfDimensions(bodyDimensions, legDimensions)
    }

    // getDetachedHexagon
    // getTranslatedHexapod
    // getStancedHexapod
}

export default VirtualHexapod
