import LinkageIKSolver from "./LinkageIKSolver"
import HexapodSupportCheck from "./HexapodSupportCheck"
import { IKMessage } from "./IKInfo"
import {
    POSITION_NAMES_LIST,
    NUMBER_OF_LEGS,
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


class IKSolver {
    params = {}
    partialPose = {}
    pose = {}
    foundSolution = false
    legPositionsOffGround = []
    message = IKMessage.initialized

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
        const [noSupport, reason] = HexapodSupportCheck.checkSupport(
            this.legPositionsOffGround
        )
        if (noSupport) {
            this._finalizeFailure(IKMessage.noSupport(reason, this.legPositionsOffGround))
            return true
        }
        return false
    }

    _handleBadPoint(point) {
        this._finalizeFailure(IKMessage.badPoint(point))
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
            this.message = IKMessage.success
            return
        }

        this.message = IKMessage.successLegsOnAir(this.legPositionsOffGround)
    }
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

export default IKSolver
