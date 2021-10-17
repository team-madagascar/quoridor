import {Command, Commands} from './../domain/command';
import {Node} from '../domain/core/node';
import {Point} from '../domain/core/point';
import {Wall} from '../domain/core/wall';
import {Direction} from '../domain/core/point';

const PROBABILITY_PAWN_MOVE = 0.7;

enum OrientationTypes {
  Vertical,
  Horizontal,
}

const orientationsToWallDirections: Record<OrientationTypes, Direction> = {
  [OrientationTypes.Horizontal]: Direction.Right,
  [OrientationTypes.Vertical]: Direction.Down,
};

const orientations = [OrientationTypes.Horizontal, OrientationTypes.Vertical];

export class Bot {
  currentField: Array<Array<Point>> | null = null;

  constructor(private position: Point, private wallsCount: number) {}

  setPosition(position: Point) {
    this.position = position;
  }

  setWallsCount(wallsCount: number) {
    this.wallsCount = wallsCount;
  }

  randomMove(
    allowedNodesToMove: ReadonlyArray<Node>,
    canPlaceWall: (wall: Wall) => boolean
  ): Command {
    if (Math.random() > PROBABILITY_PAWN_MOVE && this.wallsCount > 0) {
      return this.placeWall(canPlaceWall);
    } else {
      return this.makeMove(allowedNodesToMove);
    }
  }

  makeMove(allowedNodesToMove: ReadonlyArray<Node>) {
    const nodeToMoveIndex = this.randomInteger(
      0,
      allowedNodesToMove.length - 1
    );

    const nextPosition = allowedNodesToMove[nodeToMoveIndex];
    return Commands.moveToNode(nextPosition);
  }

  setFieldState(field: Array<Array<Point>>) {
    this.currentField = field;
  }

  placeWall(canPlaceWall: (wall: Wall) => boolean): Command {
    let wallX = this.getWallPosition();
    let wallY = this.getWallPosition();

    const orientation =
      orientations[this.randomInteger(0, orientations.length - 1)];

    if (orientation === OrientationTypes.Horizontal) {
      wallY--;
    } else {
      wallX--;
    }

    const newWallStartPoint = Point.create(wallX, wallY);
    const newWallDirection = orientationsToWallDirections[orientation];
    const newWall = Wall.create(newWallStartPoint, newWallDirection);
    if (canPlaceWall(newWall)) {
      this.wallsCount--;
      return Commands.placeWall(newWall);
    }
    return this.placeWall(canPlaceWall);
  }

  private getWallPosition() {
    return this.randomInteger(0, 7) * 2 + 1;
  }

  private randomInteger(min: number, max: number) {
    const rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }
}
