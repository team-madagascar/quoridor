import {Direction, Point} from './point';

export class Wall {
  constructor(readonly points: [Point, Point, Point]) {
    this.requirePointsToBeWithinGameGrid();
    this.requirePointsNotToBePlayerPoints();
    this.requirePointsToBeLineUp();
    this.requireBorderPointsToConnectPlayerNodes();
  }

  static create(point1: Point, direction: Direction) {
    const point2 = point1.move(direction, 1);
    const point3 = point1.move(direction, 2);
    return new Wall([point1, point2, point3]);
  }

  private requirePointsToBeWithinGameGrid() {
    this.points.forEach(p => p.requireToBeWithinGameGrid());
  }

  private requireBorderPointsToConnectPlayerNodes() {
    if (
      !this.points[0].isConnectedWithPlayerPoint() ||
      !this.points[2].isConnectedWithPlayerPoint()
    ) {
      throw new Error(
        'First or second point in wall should be connected with at least one PlayerPoint'
      );
    }
  }

  private requirePointsNotToBePlayerPoints() {
    if (this.points.some(p => p.isNodePoint())) {
      throw new Error('Points in wall can`t be player points');
    }
  }

  private requirePointsToBeLineUp() {
    if (!this.isAllPointsMakeOneLine()) {
      throw new Error('All wall points should be on one line');
    }
  }

  private isAllPointsMakeOneLine() {
    return this.allRowsAreEqual() || this.allColumnsAreEqual();
  }

  private allRowsAreEqual(): boolean {
    const firstPointRow = this.points[0].row;
    const rows = this.points.map(p => p.row);
    return rows.every(row => firstPointRow === row);
  }

  private allColumnsAreEqual(): boolean {
    const firstPointColumn = this.points[0].column;
    const columns = this.points.map(p => p.column);
    return columns.every(column => firstPointColumn === column);
  }
}
