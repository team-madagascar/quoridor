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
    if (!this._graph.hasNode(newPoint)) return false;
    return this.isConnectedTo(this._graph.getNode(newPoint));
  }

  moveToDirection(direction: Direction): Node | undefined {
    const newPosition = this.position.move(direction, NODE_GAP);
    if (!this._graph.hasNode(newPosition)) return undefined;
    if (this.isConnectedTo(this._graph.getNode(newPosition))) {
      return this._graph.getNode(newPosition);
    }
    return undefined;
  }

  walk(endWalkPredicate: (node: Node) => boolean): boolean {
    return this._graph.searchBFS(this, endWalkPredicate);
  }

  shortestDistanceTo(endPredicate: (node: Node) => boolean): number | null {
    const queue: {distance: number; node: Node}[] = [{distance: 0, node: this}];
    const visited = new Set<Node>();
    while (queue.length !== 0) {
      const {distance: currDistance, node: currNode} = queue.shift()!;
      if (endPredicate(currNode)) {
        return currDistance;
      }
      currNode.connectedNodes
        .filter(n => !visited.has(n))
        .forEach(nextNode => {
          visited.add(nextNode);
          queue.push({distance: currDistance + 1, node: nextNode});
        });
    }
    return null;
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
