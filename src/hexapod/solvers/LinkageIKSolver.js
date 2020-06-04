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

FIND: (counter clockwise is  positive)
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
import Vector from "../Vector"
import {
    vectorFromTo,
    angleBetween,
    radians,
    vectorLength,
    angleOppositeOfLastSide,
    isTriangle,
} from "../geometry"

class LinkageIKSolver {
    legXaxis = new Vector(1, 0, 0, "legXaxis")
    bodyContactPoint = new Vector(0, 0, 0, "localBodyContact")
    coxia
    femur
    tibia
    summa
    rho
    p1
    targetFootTipPoint
    parsVector
    pars
    beta
    gamma
    obtainedSolution
    reachedTarget
    message
    constructor(legPosition) {
        this.legPosition = legPosition
    }

    solve(coxia, femur, tibia, summa, rho) {
        Object.assign(this, { coxia, femur, tibia, summa, rho })
        this.coxiaPoint = new Vector(coxia, 0, 0, "localCoxiaPoint")
        this.targetFootTipPoint = this._computeTargetFootTipPoint()

        this.parsVector = vectorFromTo(this.coxiaPoint, this.targetFootTipPoint)
        this.pars = vectorLength(this.parsVector)
        isTriangle(this.pars, this.femur, this.tibia)
            ? this._handleCaseTriangleCanForm()
            : this._handleEdgeCase()

        return this
    }

    _computeTargetFootTipPoint() {
        const px = this.summa * Math.cos(radians(this.rho))
        const pz = -this.summa * Math.sin(radians(this.rho))
        return new Vector(px, 0, pz, "targetLocalFootTipPoint")
    }

    _handleCaseTriangleCanForm() {
        this.theta = angleOppositeOfLastSide(this.femur, this.pars, this.tibia)

        this.phi = angleBetween(this.parsVector, this.legXaxis)
        this.beta =
            this.targetFootTipPoint.z < 0 ? this.theta - this.phi : this.theta + this.phi

        this.epsi = angleOppositeOfLastSide(this.femur, this.tibia, this.pars)

        const femurPointZ = this.femur * Math.sin(radians(this.beta))

        if (this.targetFootTipPoint.z > femurPointZ) {
            this.obtainedSolution = false
            this.message = `${this.legPosition} | Impossible! Ground is blocking the path.`
            return
        }

        this.gamma = this.epsi - 90
        this.obtainedSolution = true
        this.reachedTarget = true
        this.message = "Successful!"
    }

    _handleEdgeCase() {
        this.reachedTarget = false

        if (this.pars + this.tibia < this.femur) {
            this.obtainedSolution = false
            this.message = `${this.legPosition} | Impossible! Femur is too long. `
            return
        }

        if (this.pars + this.femur < this.tibia) {
            this.obtainedSolution = false
            this.message = `${this.legPosition} | Impossible! Tibia is too long. `
            return
        }

        // then this.femur + this.tibia < this.pars
        // stretch to try to reach it
        //
        // p0 *---* p1
        //         \
        //          * p2
        //           \
        //            * p3 (actual when stretched)
        //
        //              * targetp3
        //
        this.gamma =90
        // 90 to stretch
        // 0 to curl up
        this.beta = -angleBetween(this.parsVector, this.legXaxis)
        this.obtainedSolution = true
        this.reachedTarget = false
        this.message = `${this.legName} | Successful! But this leg won't reach the target ground point`
    }
}

export default LinkageIKSolver
