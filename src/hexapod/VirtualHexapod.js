import { createVector, createHexagon } from "./basicObjects"
import Linkage from "../hexapod/Linkage"
import { POSITION_LIST } from "./constants"
import { POSE } from "../templates/hexapodParams"

const DEFAULT_LOCAL_FRAME = {
    xAxis: createVector(1, 0, 0, "hexapodXaxis"),
    yAxis: createVector(0, 1, 0, "hexapodYaxis"),
    zAxis: createVector(0, 0, 1, "hexapodZaxis"),
}

class VirtualHexapod {
    constructor(
        bodyDimensions = { front: 100, middle: 100, side: 100 },
        legDimensions = { coxia: 100, femur: 100, tibia: 100 },
        pose = POSE
    ) {
        const neutralLocalFrame = DEFAULT_LOCAL_FRAME
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

        this.legs = legListWithoutGravity
        this.body = neutralHexagon
        this.localFrame = neutralLocalFrame
        this.cogProjection = {
            x: this.body.cog.x,
            y: this.body.cog.y,
            z: 0,
            name: "centerOfGravityProjectionPoint",
        }

        this.groundContactPoints = []

        this.sumOfDimensions =
            bodyDimensions.front +
            bodyDimensions.middle +
            bodyDimensions.side +
            legDimensions.coxia +
            legDimensions.femur +
            legDimensions.tibia

        // STEP 1:
        // Find new orientation of the body (new normal)
        // distance of cog from ground and which legs are on the ground
        // if none, then this is unstable, return error

        // STEP 2: GET FINAL POINTS (LEG AND HEXAGON)
        // Tilt and shift hexapod based on data from step 2
        // shift all points as well as the neutral reference frame

        // STEP 3: Twist if we have to
        // Hexapod will twist if three more alphas are non-zero
        // and the corresponding legs have foot tips that are NOT above body contact
    }

    // getDetachedHexagon
    // getTranslatedHexapod
    // getStancedHexapod
}

export default VirtualHexapod
