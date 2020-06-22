/* * * * *
  ..................
   LINKAGE
  ..................

     p0 *----* p1
              \       * p0 = origin / bodyContactPoint
               * p2   * p1 = coxiaPoint
               |      * p2 = femurPoint
               * p3   * p3 = tibiaPoint / footTipPoint
                      * coxiaVector = vector from p0 to p1
     localZ           * femurVector = vector from p1 to p2
     |  localY        * tibiaVector = vector from p2 to p3
     | /
     |/
     |------ localX   * LegPointId = {legId}-{pointId}


             2           1       * legId - legName     - localXaxisAngle
              \   head  /        *  0    - rightMiddle - 0
               *---*---*         *  1    - rightFront  - 45
              /    |    \        *  2    - leftFront   - 135
             /     |     \       *  3    - leftMiddle  - 180
         3 -*-----cog-----*- 0   *  4    - leftBack    - 225
             \     |     /       *  5    - rightBack   - 315
              \    |    /
               *---*---*          ^ hexapodY
              /         \         |
             4           5        *---> hexapodX
                                 /
                                * hexapodZ

                     * localXaxisAngle = angle made by hexapodXaxis and localXaxis
                     * alpha = angle made by coxia Vector and localXaxis
             p2      * beta = angle made by coxiaVector and femurVector
             *              = angle made by points p2, p1 and pxPrime
            / \
       *---*---\---> pxPrime
      p0   p1   * p3


      p0   p1         * gamma = angle made by vector perpendicular to
       *---*                    coxiaVector and tibiaVector
           | \                = angle made by points pzPrime, p1, p3
           |  \
           V   * p3
          pzPrime

  ..................
   LINKAGE PROPERTIES
  ..................

  {} this.dimensions: { coxia, femur, tibia }
  {} this.pose: { alpha, beta, gamma }
  "" this.position: "rightMiddle" from POSITION_NAMES_LIST or "linkage-position-not-defined"

  [] this.allPointsList: A list pointing to each of the four points in the map
      which the first element being the bodyContactPoint, the last element being the footTipPoint

      [
          {x, y, z, id: "5-0", name: "rightBack-bodyContactPoint"},
          {x, y, z, id: "5-1", name: "rightBack-coxiaPoint"},
          {x, y, z, id: "5-2", name: "rightBack-femurPoint"},
          {x, y, z, id: "5-3", name: "rightBack-footTipPoint"},
      ]
      each id is prefixed with 5 because the leg point id corresponding to "rightBack"
      position is 5.

  ....................
  (linkage derived properties)
  ....................

  {} this.maybeGroundContactPoint: The point which probably is the one in contact
      with the ground, but not necessarily the case (no guarantees)
  "" this.name: "{position}Leg" e.g. "rightMiddleLeg"
  "" this.id : a number from 0 to 5 corresponding to a particular position

  * * * * */
import { tRotYmatrix, tRotZmatrix, multiply4x4 } from "./geometry"
import {
    LEG_POINT_TYPES_LIST,
    POSITION_NAME_TO_ID_MAP,
    POSITION_NAME_TO_AXIS_ANGLE_MAP,
} from "./constants"
import Vector from "./Vector"

class Linkage {
    constructor(
        dimensions,
        position,
        originPoint = { x: 0, y: 0, z: 0 },
        pose = { alpha: 0, beta: 0, gamma: 0 },
        flags = { hasNoPoints: false }
    ) {
        Object.assign(this, { dimensions, pose, position })

        if (flags.hasNoPoints) {
            return
        }

        this.allPointsList = this._computePoints(pose, originPoint)
    }

    get bodyContactPoint() {
        return this.allPointsList[0]
    }

    get coxiaPoint() {
        return this.allPointsList[1]
    }

    get femurPoint() {
        return this.allPointsList[2]
    }

    get footTipPoint() {
        return this.allPointsList[3]
    }

    get id() {
        return POSITION_NAME_TO_ID_MAP[this.position]
    }

    get name() {
        return `${this.position}Leg`
    }

    get maybeGroundContactPoint() {
        const reversedList = this.allPointsList.slice().reverse()
        const testPoint = reversedList[0]
        const maybeGroundContactPoint = reversedList.reduce(
            (testPoint, point) => (point.z < testPoint.z ? point : testPoint),
            testPoint
        )
        return maybeGroundContactPoint
    }

    /* *
     * .............
     * clone (translate) rotate shift cloneTrotShift
     * .............
     *
     * params type:
     *   matrix:  4x4 matrix
     *   tx, ty, tz: numbers
     *
     * Return a copy of the leg with the same properties
     * except all the points are rotated and shifted
     * given the transformation matrix (4x4 matrix) and tx, ty, tz
     * Note: The transformation matrix can translate the leg
     * if the last column of of the matrix have non-zero elements
     * and again be translated by tx, ty, tz
     * */
    cloneTrotShift(transformMatrix, tx, ty, tz) {
        return this._doTransform("cloneTrotShift", transformMatrix, tx, ty, tz)
    }

    cloneTrot(transformMatrix) {
        return this._doTransform("cloneTrot", transformMatrix)
    }

    cloneShift(tx, ty, tz) {
        return this._doTransform("cloneShift", tx, ty, tz)
    }

    _doTransform(transformFunction, ...args) {
        const newPointsList = this.allPointsList.map(oldPoint =>
            oldPoint[transformFunction](...args)
        )
        return this._buildClone(newPointsList)
    }

    _buildClone(allPointsList) {
        let clone = new Linkage(
            this.dimensions,
            this.position,
            this.bodyContactPoint,
            this.pose,
            { hasNoPoints: true }
        )

        // override allPointsList of clone
        clone.allPointsList = allPointsList
        return clone
    }

    /* *
     * .............
     * structure of pointNameIds
     * .............
     *
     * pointNameIds = [
     *   { name: "{legPosition}-bodyContactPoint", id: "{legId}-0" },
     *   { name: "{legPosition}-coxiaPoint", id: "{legId}-1" },
     *   { name: "{legPosition}-femurPoint", id: "{legId}-2" },
     *   { name: "{legPosition}-footTipPoint", id: "{legId}-3" },
     * ]
     *
     * */
    _buildNameId = (pointName, id) => ({
        name: `${this.position}-${pointName}`,
        id: `${this.id}-${id}`,
    })

    _buildPointNameIds = () =>
        LEG_POINT_TYPES_LIST.map((pointType, index) =>
            this._buildNameId(pointType, index)
        )

    /* *
     * ................
     * STEP 1 of computing points:
     *   find points wrt body contact point
     * ................
     * NOTE:
     * matrix_ab is the matrix which defines the
     * pose of that coordinate system defined by
     * matrix_b wrt the coordinate system defined by matrix_a
     * matrix_ab is the pose of matrix_b wrt matrix_a
     * where pa is the origin of matrix_a
     * and pb is the origin of matrix_b wrt pa
     *
     * */
    _computePointsWrtBodyContact(beta, gamma) {
        const matrix01 = tRotYmatrix(-beta, this.dimensions.coxia, 0, 0)
        const matrix12 = tRotYmatrix(90 - gamma, this.dimensions.femur, 0, 0)
        const matrix23 = tRotYmatrix(0, this.dimensions.tibia, 0, 0)
        const matrix02 = multiply4x4(matrix01, matrix12)
        const matrix03 = multiply4x4(matrix02, matrix23)

        const originPoint = new Vector(0, 0, 0)

        const localPoints = [
            originPoint, // bodyContactPoint
            originPoint.cloneTrot(matrix01), // coxiaPoint
            originPoint.cloneTrot(matrix02), // femurPoint
            originPoint.cloneTrot(matrix03), // footTipPoint
        ]

        return localPoints
    }

    /* *
     * ................
     * STEP 2 of computing points:
     *   find local points wrt hexapod's center of gravity (0, 0, 0)
     * ................
     * */
    _computePointsWrtHexapodCog(alpha, originPoint, localPoints, pointNameIds) {
        const zAngle = POSITION_NAME_TO_AXIS_ANGLE_MAP[this.position] + alpha

        const twistMatrix = tRotZmatrix(
            zAngle,
            originPoint.x,
            originPoint.y,
            originPoint.z
        )

        const allPointsList = localPoints.map((localPoint, index) => {
            const name = pointNameIds[index].name
            const id = pointNameIds[index].id
            const point = localPoint.newTrot(twistMatrix, name, id)
            return point
        })

        return allPointsList
    }

    /* *
     *  Example of allPointsList =  [
     *     {x, y, z, id: "5-0", name: "rightBack-bodyContactPoint"},
     *     {x, y, z, id: "5-1", name: "rightBack-coxiaPoint"},
     *     {x, y, z, id: "5-2", name: "rightBack-femurPoint"},
     *     {x, y, z, id: "5-3", name: "rightBack-footTipPoint"},
     * ]
     * x, y, z are numbers
     * */
    _computePoints(pose, originPoint) {
        const { alpha, beta, gamma } = pose
        const pointNameIds = this._buildPointNameIds()
        const localPoints = this._computePointsWrtBodyContact(beta, gamma)
        // prettier-ignore
        const allPointsList = this._computePointsWrtHexapodCog(
            alpha, originPoint, localPoints, pointNameIds
        )
        return allPointsList
    }
}

export default Linkage
