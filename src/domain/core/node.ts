import {Direction, Point} from './point';
import {NODE_GAP} from './game';
import {Graph} from './graph';

export class Node {
  constructor(readonly position: Point, private readonly _graph: Graph) {
    if (!position.isNodePoint()) {
      throw new Error('Node should have even position');
    }
  }

  canMoveToDirection(direction: Direction): boolean {
    const newPoint = this.position.move(direction, NODE_GAP);
    let result: boolean;
    try {
      result = this.isConnectedTo(this._graph.getNode(newPoint));
    } catch (e) {
      result = false;
    }
    return result;
  }

  moveToDirection(direction: Direction): Node {
    const newPosition = this.position.move(direction, NODE_GAP);
    if (this.isConnectedTo(this._graph.getNode(newPosition))) {
      return this._graph.getNode(newPosition);
    }
    throw new Error(
      `Can't move from: ${JSON.stringify(this.position)}, to: ${JSON.stringify(
        newPosition
      )}`
    );
  }

  search(endWalkPredicate: (node: Node) => boolean): boolean {
    return this._graph.searchBFS(this, endWalkPredicate);
  }

  hasAnyPathTo(target: Node): boolean {
    return this._graph.searchBFS(this, node => node.equals(target));
  }

  equals(node: Node): boolean {
    return this.position === node.position;
  }

  isConnectedTo(node: Node): boolean {
    return this._graph.hasConnection(node, this);
  }

  isNeighbor(node: Node): boolean {
    return this.position.isNeighbor(node.position, NODE_GAP);
  }

  allNeighbors(): ReadonlyArray<Node> {
    return this.position.neighbors(NODE_GAP).map(p => this._graph.getNode(p));
  }

  connectedNeighbors(): ReadonlyArray<Node> {
    return this.allNeighbors().filter(n => this.isConnectedTo(n));
  }

  get connectedNodes(): ReadonlyArray<Node> {
    return this.neighbors().filter(n => this.isConnectedTo(n));
  }

  private neighbors(): ReadonlyArray<Node> {
    return this.position.neighbors(NODE_GAP).map(n => this._graph.getNode(n));
  }
}
