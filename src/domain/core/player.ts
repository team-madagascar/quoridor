import {Point} from './point';
import {GameNode} from './node';

export interface PlayerView {
  get id(): string;

  get finishRow(): number;

  get remainingWallsCount(): number;

  get currentPosition(): Point;

  get currentNode(): GameNode;

  hasWallsToPlace(): boolean;

  isFinishReached(): boolean;

  isFinishNode(node: GameNode): boolean;
}

export class Player implements PlayerView {
  static readonly DEFAULT_WALLS_COUNT = 10;

  private _remainingWallsCount: number;
  private _currentNode: GameNode;

  constructor(
    startNode: GameNode,
    private readonly _finishRow: number,
    private readonly _id: string,
    wallsCount: number = Player.DEFAULT_WALLS_COUNT
  ) {
    this._currentNode = startNode;
    this._remainingWallsCount = wallsCount;
  }

  get currentNode(): GameNode {
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

  isFinishNode(node: GameNode): boolean {
    return this._finishRow === node.position.row;
  }

  canReachFinishPoint(): boolean {
    return this.currentNode.walk(n => this.isFinishNode(n));
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

  moveTo(node: GameNode) {
    this._currentNode = node;
  }

  copy(node: GameNode): Player {
    return new Player(
      node,
      this._finishRow,
      this._id,
      this.remainingWallsCount
    );
  }
}
