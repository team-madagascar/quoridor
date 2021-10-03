import {Direction, Point} from './point';
import {Node} from './node';
import {searchBFS} from './search';

export interface PlayerView {
  get id(): string;

  get finishRow(): number;

  get remainingWallsCount(): number;

  get currentPosition(): Point;

  isFinishReached(): boolean;
}

export const PLAYER_STEP = 2;

export class Player implements PlayerView {
  get currentNode(): Node {
    return this._currentNode;
  }

  static readonly DEFAULT_WALLS_COUNT = 10;

  private _remainingWallsCount: number;
  private _currentNode: Node;

  constructor(
    startNode: Node,
    private readonly _finishRow: number,
    private readonly _id: string,
    wallsCount: number = Player.DEFAULT_WALLS_COUNT
  ) {
    this._currentNode = startNode;
    this._remainingWallsCount = wallsCount;
  }

  get remainingWallsCount(): number {
    return this._remainingWallsCount;
  }

  get currentPosition(): Point {
    return this._currentNode.position;
  }

  get finishRow(): number {
    return this._finishRow;
  }

  get id(): string {
    return this._id;
  }

  isFinishReached() {
    return this.currentNode.position.row === this._finishRow;
  }

  isFinishNode(node: Node) {
    return this._finishRow === node.position.row;
  }

  canReachFinishPoint(): boolean {
    const from = this.currentNode;
    return searchBFS(from, n => this.isFinishNode(n));
  }

  takeWall() {
    this.requireToHaveWallsToPlace();
    this._remainingWallsCount--;
  }

  hasWallsToPlace() {
    return this._remainingWallsCount > 0;
  }

  requireToHaveWallsToPlace() {
    if (!this.hasWallsToPlace()) {
      throw new Error('Player has no more walls');
    }
  }

  moveTo(node: Node) {
    this._currentNode = node;
  }
}
