import {Point} from './point';
import {Wall} from './wall';

export class ConnectionBlocker {
  private readonly _blockedPoints: Set<Point> = new Set();
  private _placedWalls: Wall[] = [];

  get placedWalls(): ReadonlyArray<Wall> {
    return this._placedWalls;
  }

  isBlocked(point: Point): boolean {
    return this._blockedPoints.has(point);
  }

  hasConnection(a: Point, b: Point): boolean {
    const midPoint = a.midPoint(b);
    return !this.isBlocked(midPoint);
  }

  placeWall(wall: Wall) {
    this.requireNotIntersectAlreadyPlacedWalls(wall);
    this._placedWalls.push(wall);
    wall.points.forEach(p => this._blockedPoints.add(p));
  }

  removeWall(wall: Wall) {
    this._placedWalls = this._placedWalls.filter(w => w !== wall);
    wall.points.forEach(p => this._blockedPoints.delete(p));
  }

  intersectPlacedWalls(wall: Wall): boolean {
    return wall.points.some(p => this._blockedPoints.has(p));
  }

  private requireNotIntersectAlreadyPlacedWalls(wall: Wall) {
    if (this.intersectPlacedWalls(wall)) {
      throw new Error('Wall shouldn`t intersect already placed walls');
    }
  }
}
