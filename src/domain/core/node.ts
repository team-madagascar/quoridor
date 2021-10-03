import {Direction, Point} from './point';
import {ConnectionBlocker} from './connection-blocker';
import {NODE_GAP} from './game';
import {searchBFS} from './search';

export class Node {
  constructor(
    readonly position: Point,
    private readonly _blocker: ConnectionBlocker,
    private readonly _nodes: Map<Point, Node>
  ) {
    if (!position.isEven()) {
      throw new Error('Node should have even position');
    }
  }

  canMoveToDirection(direction: Direction) {
    const newPoint = this.position.move(direction, NODE_GAP);
    return this.isConnectedToNeighbor(this.getNode(newPoint));
  }

  moveToDirection(direction: Direction): Node {
    const newPosition = this.position.move(direction, NODE_GAP);
    if (this.isConnectedToNeighbor(this.getNode(newPosition))) {
      return this.getNode(newPosition);
    }
    throw new Error(
      `Can't move from: ${JSON.stringify(this.position)}, to: ${JSON.stringify(
        newPosition
      )}`
    );
  }

  isConnectedTo(node: Node): boolean {
    if (!this.position.neighbors(NODE_GAP).includes(node.position)) {
      return false;
    }
    const midPoint = this.position.midPoint(node.position);
    return !this._blocker.isBlocked(midPoint);
  }

  hasAnyPathTo(target: Node): boolean {
    return searchBFS(this, node => node.position === target.position);
  }

  get connectedNodes(): ReadonlyArray<Node> {
    return this.neighbors().filter(n => this.isConnectedToNeighbor(n));
  }

  private neighbors() {
    return this.position.neighbors(NODE_GAP).map(n => this.getNode(n));
  }

  private isConnectedToNeighbor(node: Node): boolean {
    const midPoint = this.position.midPoint(node.position);
    return !this._blocker.isBlocked(midPoint);
  }

  private getNode(point: Point): Node {
    const node = this._nodes.get(point);
    if (node === undefined) {
      throw new Error(`Has no node with position: ${JSON.stringify(point)}`);
    }
    return node;
  }
}
