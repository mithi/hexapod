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
  "" this.position: "rightMiddle" from POSITION_LIST or "linkage-position-not-defined"

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
import { tRotYframe, tRotZframe } from "./utilities/geometry"
import {
    LEG_POINT_TYPES,
    POSITION_ID_MAP,
    LOCAL_X_AXIS_ANGLE_MAP,
} from "./constants"
import Vector from "./Vector"

class Linkage {
    constructor(
        dimensions = { coxia: 100, femur: 100, tibia: 100 },
        position = "linkage-position-not-defined",
        bodyContactPoint = { x: 0, y: 0, z: 0 },
        pose = { alpha: 0, beta: 0, gamma: 0 }
    ) {
        this.dimensions = dimensions
        this.pose = pose
        this.position = position
        const pointNameIdMap = this._buildPointNameIdMap()
        const givenBodyContactPoint = {
            ...bodyContactPoint,
            name: pointNameIdMap.bodyContactPoint.name,
            id: pointNameIdMap.bodyContactPoint.id,
        }
        this.pointsMap = this._computePoints(
            pose,
            pointNameIdMap,
            givenBodyContactPoint
        )
    }

    get id() {
        return POSITION_ID_MAP[this.position]
    }

    get name() {
        return `${this.position}Leg`
    }

    get maybeGroundContactPoint() {
        return this._computeMaybeGroundContactPoint()
    }

    get allPointsList() {
        return LEG_POINT_TYPES.reduce(
            (acc, pointType) => [...acc, this.pointsMap[pointType]],
            []
        )
    }
    /* *
     * .............
     * clone (translate) rotate shift
     * .............
     *
     * params type:
     *   frame:  4x4 matrix
     *   tx, ty, tz: numbers
     *
     * Return a copy of the leg with the same properties
     * except all the points are rotated and shifted
     * given the reference frame (4x4 matrix) and tx, ty, tz
     * Note: The reference frame can translate the leg
     * if the last column of of the matrix have non-zero elements
     * and again be translated by tx, ty, tz
     * */
    cloneTrotShift(frame, tx = 0, ty = 0, tz = 0) {
        const pointsMap = LEG_POINT_TYPES.reduce((acc, pointType) => {
            const oldPoint = this.pointsMap[pointType]
            const newPoint = oldPoint.cloneTrotShift(frame, tx, ty, tz)
            acc[pointType] = newPoint
            return acc
        }, {})

        let clone = new Linkage(
            this.dimensions,
            this.position,
            this.bodyContactPoint,
            this.pose
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
        LEG_POINT_TYPES.reduce((acc, pointType, index) => {
            acc[pointType] = this._buildNameId(pointType, index)
            return acc
        }, {})

    /* *
     * ................
     * STEP 1 of computing points:
     *   find points wrt body contact point
     * ................
     * NOTE:
     * frame_ab is the pose of frame_b wrt frame_a
     * where pa is the origin of frame_a
     * and pb is the origin of frame_b wrt pa
     *
     * */
    _computePointsWrtBodyContact(beta, gamma) {
        const frame01 = tRotYframe(-beta, this.dimensions.coxia, 0, 0)
        const frame12 = tRotYframe(90 - gamma, this.dimensions.femur, 0, 0)
        const frame23 = tRotYframe(0, this.dimensions.tibia, 0, 0)
        const frame02 = multiply(frame01, frame12)
        const frame03 = multiply(frame02, frame23)

        const originPoint = new Vector(0, 0, 0)

        const localPointsMap = {
            bodyContactPoint: originPoint,
            coxiaPoint: originPoint.cloneTrot(frame01),
            femurPoint: originPoint.cloneTrot(frame02),
            footTipPoint: originPoint.cloneTrot(frame03),
        }

        return localPointsMap
    }

    /* *
     * ................
     * STEP 2 of computing points:
     *   find local points wrt hexapod's center of gravity (0, 0, 0)
     * ................
     * */
    _computePointsWrtHexapodsCog(
        localPointsMap,
        alpha,
        pointNameIdMap,
        givenBodyContactPoint
    ) {
        const twistFrame = tRotZframe(
            LOCAL_X_AXIS_ANGLE_MAP[this.position] + alpha,
            givenBodyContactPoint.x,
            givenBodyContactPoint.y,
            givenBodyContactPoint.z
        )

        const pointsMap = LEG_POINT_TYPES.reduce((acc, pointType) => {
            const point = localPointsMap[pointType].newTrot(
                twistFrame,
                pointNameIdMap[pointType].name,
                pointNameIdMap[pointType].id
            )
            acc[pointType] = point
            return acc
        }, {})

        return pointsMap
    }

    _computePoints(pose, pointNameIdMap, givenBodyContactPoint) {
        const { alpha, beta, gamma } = pose
        const localPointsMap = this._computePointsWrtBodyContact(beta, gamma)
        const pointsMap = this._computePointsWrtHexapodsCog(
            localPointsMap,
            alpha,
            pointNameIdMap,
            givenBodyContactPoint
        )
        return pointsMap
    }

    _computeMaybeGroundContactPoint() {
        const reversedPointList = this.allPointsList.slice().reverse()
        const testPoint = reversedPointList[0]
        const maybeGroundContactPoint = reversedPointList.reduce(
            (testPoint, point) => (point.z < testPoint.z ? point : testPoint),
            testPoint
        )
        return maybeGroundContactPoint
    }
}

export default Linkage
