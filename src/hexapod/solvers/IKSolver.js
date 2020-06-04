import {
    POSITION_NAMES_LIST,
    NUMBER_OF_LEGS,
    POSITION_NAME_TO_IS_LEFT_MAP,
    POSITION_NAME_TO_AXIS_ANGLE_MAP,
} from "../constants"

import {
    vectorFromTo,
    projectedVectorOntoPlane,
    getUnitVector,
    scaleVector,
    addVectors,
    angleBetween,
    vectorLength,
    isCounterClockwise,
} from "../geometry"
import LinkageIKSolver from "./LinkageIKSolver"

const hexapodNoSupport = legsNamesoffGround => {
    if (legsNamesoffGround.length < 3) {
        return [false, "Not enough information"]
    }

    if (legsNamesoffGround.length >= 4) {
        return [true, "too many legs off the floor"]
    }

    // leg count is exactly 3
    const legLeftOrRight = legsNamesoffGround.map(
        legPosition => POSITION_NAME_TO_IS_LEFT_MAP[legPosition]
    )

    if (legLeftOrRight.every(isLeft => !isLeft)) {
        return [true, "All right legs are off the floor"]
    }

    if (legLeftOrRight.every(isLeft => isLeft)) {
        return [true, "All left legs are off the floor"]
    }

    return [false, "Not enough information"]
}

const computeAlpha = (coxiaVector, legXaxisAngle, xAxis, zAxis) => {
    const sign = isCounterClockwise(coxiaVector, xAxis, zAxis) ? -1 : 1
    const alphaWrtHexapod = sign * angleBetween(coxiaVector, xAxis)
    const alpha = (alphaWrtHexapod - legXaxisAngle) % 360
    if (alpha > 180) {
        return alpha - 360
    }
    if (alpha < -180) {
        return alpha + 360
    }
    return alpha
}

const computeInitialLegProperties = (
    bodyContactPoint,
    groundContactPoint,
    zAxis,
    coxia
) => {
    const bodyToFootVector = vectorFromTo(bodyContactPoint, groundContactPoint)
    const coxiaDirectionVector = projectedVectorOntoPlane(bodyToFootVector, zAxis)
    const coxiaUnitVector = getUnitVector(coxiaDirectionVector)
    const coxiaVector = scaleVector(coxiaUnitVector, coxia)
    const coxiaPoint = addVectors(bodyContactPoint, coxiaVector)
    const rho = angleBetween(coxiaUnitVector, bodyToFootVector)
    const summa = vectorLength(bodyToFootVector)

    return {
        coxiaUnitVector,
        coxiaVector,
        coxiaPoint,
        rho,
        summa,
    }
}

class IKSolver {
    params
    partialPose
    pose
    foundSolution
    legPositionsOffGround
    message
    constructor() {
        this.message = "Has not solved for anything yet."
        this.foundSolution = null
        this.legPositionsOffGround = []
        this.partialPose = {}
    }

    solve(legDimensions, bodyContactPoints, groundContactPoints, axes) {
        // prettier-ignore
        this.params = {
            bodyContactPoints, groundContactPoints, axes, legDimensions
        }

        if (this._hasBadVertex(bodyContactPoints)) {
            return this
        }

        const { coxia, femur, tibia } = legDimensions

        for (let i = 0; i < NUMBER_OF_LEGS; i++) {
            const legPosition = POSITION_NAMES_LIST[i]

            // prettier-ignore
            const known = computeInitialLegProperties(
                bodyContactPoints[i], groundContactPoints[i], axes.zAxis
            )

            if (known.coxiaPoint.z < 0) {
                this._handleBadPoint(known.coxiaPoint)
                return this
            }

            const legXaxisAngle = POSITION_NAME_TO_AXIS_ANGLE_MAP[legPosition]

            // prettier-ignore
            const alpha = computeAlpha(
                known.coxiaUnitVector, legXaxisAngle, axes.xAxis, axes.zAxis
            )

            // prettier-ignore
            const solvedLegParams = new LinkageIKSolver(legPosition)
                .solve(coxia, femur, tibia, known.summa, known.rho)

            if (!solvedLegParams.obtainedSolution) {
                this._finalizeFailure(solvedLegParams.message)
                return this
            }

            if (!solvedLegParams.reachedTarget) {
                if (this._hasNoMoreSupport(legPosition)) {
                    return this
                }
            }

            // prettier-ignore
            this.partialPose[legPosition] = {
                alpha, beta: solvedLegParams.beta, gamma: solvedLegParams.gamma
            }
        }

        this._finalizeSuccess()
        return this
    }

    get hasLegsOffGround() {
        return this.legPositionsOffGround.length > 0 ? true : false
    }

    _hasNoMoreSupport(legPosition) {
        this.legPositionsOffGround.push(legPosition)
        const [noSupport, message] = hexapodNoSupport(this.legPositionsOffGround)
        if (noSupport) {
            this._finalizeFailure(message)
            return true
        }
        return false
    }

    _handleBadPoint(point) {
        this._finalizeFailure(
            `Impossible! Atleast one point: \n${point.toStringHTML()}\n would be shoved on the ground.`
        )
    }

    _hasBadVertex(bodyContactPoints) {
        for (let i = 0; i < NUMBER_OF_LEGS; i++) {
            const vertex = bodyContactPoints[i]
            if (vertex.z < 0) {
                this._handleBadPoint(vertex)
                return true
            }
        }
        return false
    }

    _finalizeFailure(message) {
        this.message = message
        this.foundSolution = false
    }

    _finalizeSuccess() {
        this.pose = this.partialPose
        this.foundSolution = true

        if (!this.hasLegsOffGround) {
            this.message = "Success!"
            return
        }

        this.message = this.legPositionsOffGround.reduce(
            (message, legPosition) => message + `${legPosition}\n\n`,
            "Successful! These legs are off the ground: \n\n"
        )
    }
}

export default IKSolver
