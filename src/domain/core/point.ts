import {GAME_GRID_SIZE} from './game';

export enum Direction {
  Up,
  Right,
  Down,
  Left,
}

/**
 * Point implements Flyweight pattern so it can be stored in Set and used as key in Map.
 * Point.create(0, 0) === Point.create(0.0) // true
 */
export class Point {
  private static pool: Map<string, Point> = new Map();

  private constructor(readonly row: number, readonly column: number) {}

  static create(row: number, column: number): Point {
    const key = `${row}:${column}`;
    let point = this.pool.get(key);
    if (point === undefined) {
      point = new Point(row, column);
      this.pool.set(key, point);
    }
    return point;
  }

  scale(scale: number): Point {
    return Point.create(this.row * scale, this.column * scale);
  }

  isNodePoint(gridSize = GAME_GRID_SIZE): boolean {
    return this.isEven() && this.isWithinGameGrid(gridSize);
  }

  private isEven(): boolean {
    return this.row % 2 === 0 && this.column % 2 === 0;
  }

  isConnectedWithPlayerPoint() {
    return this.neighbors().some(p => p.isNodePoint());
  }

  midPoint(point: Point): Point {
    return Point.create(
      (this.row + point.row) / 2,
      (this.column + point.column) / 2
    );
  }

  move(direction: Direction, distance: number): Point {
    const vector = Directions.vector(direction);
    return this.plus(vector.row * distance, vector.column * distance);
  }

  neighbors(distance = 1): Point[] {
    return Directions.allVectors()
      .map(vector =>
        Point.create(
          this.row + vector.row * distance,
          this.column + vector.column * distance
        )
      )
      .filter(p => p.isWithinGameGrid());
  }

  isNeighbor(point: Point, distance = 1): boolean {
    return this.neighbors(distance).includes(point);
  }

  isWithinGameGrid(gridSize = GAME_GRID_SIZE): boolean {
    return (
      this.row >= 0 &&
      this.column >= 0 &&
      this.row < gridSize &&
      this.column < gridSize
    );
  }

  requireToBeWithinGameGrid(fieldSize = GAME_GRID_SIZE) {
    if (!this.isWithinGameGrid(fieldSize)) {
      throw new Error(`Point is out of game grid: ${JSON.stringify(this)}`);
    }
  }

  private plus(deltaRow: number, deltaColumn: number): Point {
    return Point.create(deltaRow + this.row, deltaColumn + this.column);
  }
}

export class Directions {
  private static readonly DIRECTIONS = {
    [Direction.Up]: Point.create(-1, 0),
    [Direction.Left]: Point.create(0, -1),
    [Direction.Down]: Point.create(1, 0),
    [Direction.Right]: Point.create(0, 1),
  };

  static allVectors(): Point[] {
    return Object.values(Directions.DIRECTIONS);
  }

  static allDirections(): Direction[] {
    return [Direction.Up, Direction.Left, Direction.Down, Direction.Right];
  }

  static vector(direction: Direction): Point {
    return Directions.DIRECTIONS[direction];
  }
}
