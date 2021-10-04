import {Point} from '../../../src/domain/core/point';

describe('Point', () => {
  it('should implement Flyweight pattern', () => {
    expect(Point.create(0, 0)).toBe(Point.create(0, 0));
    expect(Point.create(15, 13)).toBe(Point.create(15, 13));
    expect(Point.create(3, 4)).not.toBe(Point.create(4, 3));
  });
  it('should be within field of specified size', () => {
    const size = 3;
    expect(Point.create(0, 0).isWithinGameGrid(size)).toBeTruthy();
    expect(Point.create(2, 2).isWithinGameGrid(size)).toBeTruthy();
    expect(Point.create(-1, 0).isWithinGameGrid(size)).toBeFalsy();
    expect(Point.create(-1, -1).isWithinGameGrid(size)).toBeFalsy();
    expect(Point.create(4, -1).isWithinGameGrid(size)).toBeFalsy();
    expect(Point.create(2, 4).isWithinGameGrid(size)).toBeFalsy();
  });
  it('should return neighboring points', () => {
    const point = Point.create(1, 1);
    const neighbors = point.neighbors();
    expect(neighbors).toHaveLength(4);
    expect(neighbors).toContain(Point.create(0, 1));
    expect(neighbors).toContain(Point.create(2, 1));
    expect(neighbors).toContain(Point.create(1, 0));
    expect(neighbors).toContain(Point.create(1, 2));
  });
});
