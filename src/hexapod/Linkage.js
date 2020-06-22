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

  {} this.pointsMap, a map of
      e.g. if position is "rightBack" then the pointMap is
      {
          bodyContactPoint: {x, y, z, id: "5-0", name: "rightBack-bodyContactPoint"}
          coxiaPoint: {x, y, z, id: "5-1", name: "rightBack-coxiaPoint"}
          femurPoint: {x, y, z, id: "5-2", name: "rightBack-femurPoint"}
          footTipPoint: {x, y, z, id: "5-3", name: "rightBack-footTipPoint"}
      }
      each id is prefixed with 5 because the leg point id corresponding to "rightMiddle"
      position is 5.

  ....................
  (linkage derived properties)
  ....................

  [] this.allPointsList: A list pointing to each of the four points in the map
      which the first element being the bodyContactPoint, the last element being the footTipPoint
  {} this.maybeGroundContactPoint: The point which probably is the one in contact
      with the ground, but not necessarily the case (no guarantees)
  "" this.name: "{position}Leg" e.g. "rightMiddleLeg"
  "" this.id : a number from 0 to 5 corresponding to a particular position

  * * * * */
import { multiply } from "mathjs"
import { tRotYmatrix, tRotZmatrix } from "./geometry"
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
        // pointsMap maps position to actual point i.e
        // pointsMap["femurPoint"] = Vector(x, y, z, "rightMiddle-femurPoint", "0-2")
        this.pointsMap = this._computePoints(pose, originPoint)
    }

    get femurPoint() {
        return this.pointsMap.femurPoint
    }

    get coxiaPoint() {
        return this.pointsMap.coxiaPoint
    }

    get bodyContactPoint() {
        return this.pointsMap.bodyContactPoint
    }

    get footTipPoint() {
        return this.pointsMap.footTipPoint
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

    get allPointsList() {
        return LEG_POINT_TYPES_LIST.reduce(
            (pointsList, pointType) => [...pointsList, this.pointsMap[pointType]],
            []
        )
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
        const pointsMap = LEG_POINT_TYPES_LIST.reduce((pointsMap, pointType) => {
            const oldPoint = this.pointsMap[pointType]
            const newPoint = oldPoint.cloneTrotShift(transformMatrix, tx, ty, tz)
            pointsMap[pointType] = newPoint
            return pointsMap
        }, {})

        return this._buildClone(pointsMap)
    }

    cloneTrot(transformMatrix) {
        return this.cloneTrotShift(transformMatrix, 0, 0, 0)
    }

    cloneShift(tx, ty, tz) {
        const pointsMap = LEG_POINT_TYPES_LIST.reduce((pointsMap, pointType) => {
            const oldPoint = this.pointsMap[pointType]
            const newPoint = oldPoint.cloneShift(tx, ty, tz)
            pointsMap[pointType] = newPoint
            return pointsMap
        }, {})

        return this._buildClone(pointsMap)
    }

    _buildClone(pointsMap) {
        let clone = new Linkage(
            this.dimensions,
            this.position,
            this.bodyContactPoint,
            this.pose,
            { hasNoPoints: true }
        )

        // override pointsMap of clone
        clone.pointsMap = pointsMap
        return clone
    }

    /* *
     * .............
     * structure of pointNameIdMap
     * .............
     *
     * pointNameIdMap = {
     *   bodyContactPoint: {name: "{legPosition}-bodyContactPoint", id: "{legId}-0" },
     *   coxiaPoint: {name: "{legPosition}-coxiaPoint", id: "{legId}-1" },
     *   femurPoint: {name: "{legPosition}-femurPoint", id: "{legId}-2" },
     *   footTipPoint: {name: "{legPosition}-footTipPoint", id: "{legId}-3" },
     * }
     *
     * */
    _buildNameId = (pointName, id) => ({
        name: `${this.position}-${pointName}`,
        id: `${this.id}-${id}`,
    })

    _buildPointNameIdMap = () =>
        LEG_POINT_TYPES_LIST.reduce((PointNameIdMap, pointType, index) => {
            PointNameIdMap[pointType] = this._buildNameId(pointType, index)
            return PointNameIdMap
        }, {})

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
        const matrix02 = multiply(matrix01, matrix12)
        const matrix03 = multiply(matrix02, matrix23)

        const originPoint = new Vector(0, 0, 0)

        const localPointsMap = {
            bodyContactPoint: originPoint,
            coxiaPoint: originPoint.cloneTrot(matrix01),
            femurPoint: originPoint.cloneTrot(matrix02),
            footTipPoint: originPoint.cloneTrot(matrix03),
        }

        return localPointsMap
    }

    /* *
     * ................
     * STEP 2 of computing points:
     *   find local points wrt hexapod's center of gravity (0, 0, 0)
     * ................
     * */
    _computePointsWrtHexapodCog(alpha, originPoint, localPointsMap, pointNameIdMap) {
        const twistMatrix = tRotZmatrix(
            POSITION_NAME_TO_AXIS_ANGLE_MAP[this.position] + alpha,
            originPoint.x,
            originPoint.y,
            originPoint.z
        )

        const pointsMap = LEG_POINT_TYPES_LIST.reduce((pointsMap, pointType) => {
            const point = localPointsMap[pointType].newTrot(
                twistMatrix,
                pointNameIdMap[pointType].name,
                pointNameIdMap[pointType].id
            )
            pointsMap[pointType] = point
            return pointsMap
        }, {})

        return pointsMap
    }

    /* *
     *  Example of pointsMap: {
     *     bodyContactPoint: {x, y, z, id: "5-0", name: "rightBack-bodyContactPoint"}
     *     coxiaPoint: {x, y, z, id: "5-1", name: "rightBack-coxiaPoint"}
     *     femurPoint: {x, y, z, id: "5-2", name: "rightBack-femurPoint"}
     *     footTipPoint: {x, y, z, id: "5-3", name: "rightBack-footTipPoint"}
     * }
     * */
    _computePoints(pose, originPoint) {
        const { alpha, beta, gamma } = pose
        const pointNameIdMap = this._buildPointNameIdMap()
        const localPointsMap = this._computePointsWrtBodyContact(beta, gamma)
        const pointsMap = this._computePointsWrtHexapodCog(
            alpha,
            originPoint,
            localPointsMap,
            pointNameIdMap
        )
        return pointsMap
    }
}

export default Linkage
