/* *

ALIASES:
    p0: bodyContactPoint (local)
    p1: coxaPoint (local)
    p2: femurPoint (local)
    p3: footTipPoint (local)

           p2x'
           /
          /          GIVEN:
         * p2         * (coxia) distance from p0 to p1
        /|            * (femur) distance from p1 to p2
       / |            * (tibia) distance from p2 to p3
p0  p1/  |            * (summa) distance from p0 to p3
 *---*   | ---> p1x'_  * rho: angle between
  \   \  |                 -> p0 to p1 and p0 to p3
    \  \ |            * p0 is (0, 0, 0)
      \ \|            * p0 to p1 vector is inline with legXaxis
        * p3
                    INTERMEDIATE:
legZaxis              * (pars) distance from p1 to p3
 ^                    * theta: angle between
 |                          -> p1 to p2 and p1 and p3
 * - > legXaxis       * phi: angle between
                            -> p1 to p3 and p1 to p1x'_ (legXaxis)
                      * epsi: angle between
                            -> p2 to p1 and p2 to p3

FIND: (counter clockwise is positive)
  * beta: Angle betweenlegXaxis and p1 to p2
          beta > 0 if p1 to p2 is above legXaxis
          beta < 0 if p1 to p2 is below the legXaxis
  * gamma: Angle between p1 to p2 and axis perpendicular to p1 p2

EXAMPLE: When p0, p2, p3, and p3 are configured this way then:
    * p2 to p3z' axis is 180 degrees wrt legZaxis
    * beta = 0
    * gamma = +90

p0   p1   p2   p3
*----*----*----*
          |
          |
          V p3z'

 * */
import Vector from "../../Vector"
import {
    vectorFromTo,
    angleBetween,
    radians,
    vectorLength,
    angleOppositeOfLastSide,
    isTriangle,
} from "../../geometry"
import { LegIKInfo } from "./IKInfo"

class LinkageIKSolver {
    info // { legPosition, obtainedSolution, reachedTarget, message }
    vectors = {
        legXaxis: new Vector(1, 0, 0, "legXaxis"),
        parsVector: null,
    }
    points = {
        bodyContactPoint: null,
        coxiaPoint: null,
        targetFootTipPoint: null,
    }
    dimensions = {
        coxia: 0,
        femur: 0,
        tibia: 0,
        summa: 0,
        pars: 0,
    }
    angles = {
        beta: null,
        gamma: null,
        rho: null,
    }

    constructor(legPosition) {
        this.info = LegIKInfo.initialized(legPosition)
    }

    solve(coxia, femur, tibia, summa, rho) {
        this.angles.rho = rho
        this.dimensions = { coxia, femur, tibia, summa }
        const coxiaPoint = new Vector(coxia, 0, 0, "coxiaPoint")
        const targetFootTipPoint = this._computeTargetFootTipPoint()

        const parsVector = vectorFromTo(coxiaPoint, targetFootTipPoint)
        const pars = vectorLength(parsVector)

        this.dimensions.pars = pars
        this.points = { ...this.points, coxiaPoint, targetFootTipPoint }
        this.vectors = { ...this.vectors, parsVector }

        isTriangle(pars, femur, tibia)
            ? this._handleCaseTriangleCanForm()
            : this._handleEdgeCase()

        return this
    }

    get legPosition() {
        return this.info.legPosition
    }

    get beta() {
        return this.angles.beta
    }

    get gamma() {
        return this.angles.gamma
    }

    get obtainedSolution() {
        return this.info.obtainedSolution
    }

    get reachedTarget() {
        return this.info.reachedTarget
    }

    get message() {
        return this.info.message
    }

    _computeTargetFootTipPoint() {
        const [summa, rho] = [this.dimensions.summa, this.angles.rho]
        const px = summa * Math.cos(radians(rho))
        const pz = -summa * Math.sin(radians(rho))
        return new Vector(px, 0, pz, "targetLocalFootTipPoint")
    }

    _handleCaseTriangleCanForm() {
        const { femur, pars, tibia } = this.dimensions
        const { parsVector, legXaxis } = this.vectors
        const { targetFootTipPoint } = this.points

        const theta = angleOppositeOfLastSide(femur, pars, tibia)
        const phi = angleBetween(parsVector, legXaxis)
        const beta = targetFootTipPoint.z < 0 ? theta - phi : theta + phi

        const epsi = angleOppositeOfLastSide(femur, tibia, pars)
        const femurPointZ = femur * Math.sin(radians(beta))

        this.angles.beta = beta

        if (targetFootTipPoint.z > femurPointZ) {
            this.info = LegIKInfo.blocked(this.legPosition)
            return
        }

        this.angles.gamma = epsi - 90
        this.info = LegIKInfo.targetReached(this.legPosition)
    }

    _handleEdgeCase() {
        const { pars, tibia, femur } = this.dimensions

        if (pars + tibia < femur) {
            this.info = LegIKInfo.femurTooLong(this.legPosition)
            return
        }

        if (pars + femur < tibia) {
            console.log(this.info.legPosition)
            this.info = LegIKInfo.tibiaTooLong(this.legPosition)
            return
        }

        // then femur + tibia < pars
        //
        // p0 *---* p1     * stretch to try to reach target
        //         \       * gamma:
        //          * p2      => 90: stretch, 0: curl down, 180: curl up
        //           \
        //            * p3 (actual when stretched)
        //
        //              * targetp3
        //

        const { parsVector, legXaxis } = this.vectors
        this.angles = {
            ...this.angles,
            beta: -angleBetween(parsVector, legXaxis),
            gamma: 90,
        }

        this.info = LegIKInfo.targetNotReached(this.legPosition)
    }
}

export default LinkageIKSolver
