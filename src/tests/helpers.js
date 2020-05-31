const expectToBeEqualPoints = (point1, point2) => {
    expect(point1.id).toBe(point2.id)
    expect(point1.name).toBe(point2.name)
    expectVectorsToHaveSameXYZ(point1, point2)
}

const expectVectorsToHaveSameXYZ = (point1, point2) => {
    expect(point1.x).toBeCloseTo(point2.x)
    expect(point1.y).toBeCloseTo(point2.y)
    expect(point1.z).toBeCloseTo(point2.z)
}

export { expectToBeEqualPoints, expectVectorsToHaveSameXYZ }
