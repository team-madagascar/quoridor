import {Point} from './point';
import {Node} from './node';

export interface PlayerView {
  get id(): string;

  get finishRow(): number;

  get remainingWallsCount(): number;

  get currentPosition(): Point;

  hasWallsToPlace(): boolean;

  isFinishReached(): boolean;

  isFinishNode(node: Node): boolean;
}

export class Player implements PlayerView {
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

  get currentNode(): Node {
    return this._currentNode;
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

  isFinishReached(): boolean {
    return this.currentNode.position.row === this._finishRow;
  }

  isFinishNode(node: Node): boolean {
    return this._finishRow === node.position.row;
  }

  canReachFinishPoint(): boolean {
    return this.currentNode.search(n => this.isFinishNode(n));
  }

  takeWall() {
    this.requireToHaveWallsToPlace();
    this._remainingWallsCount--;
  }

  hasWallsToPlace(): boolean {
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
