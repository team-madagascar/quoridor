import {Point} from './point';
import {Node} from './node';
import {GAME_GRID_SIZE} from './game';
import {ConnectionBlocker} from './connection-blocker';

export class Graph {
  private readonly _nodes = new Map<Point, Node>();

  constructor(private readonly _blocker: ConnectionBlocker) {
    for (let i = 0; i < GAME_GRID_SIZE; i++) {
      for (let j = 0; j < GAME_GRID_SIZE; j++) {
        const point = Point.create(i, j);
        if (point.isNodePoint()) {
          this._nodes.set(point, new Node(point, this));
        }
      }
    }
  }

  hasConnection(node1: Node, node2: Node): boolean {
    const midPoint = node1.position.midPoint(node2.position);
    const midPointNotBlocked = !this._blocker.isBlocked(midPoint);
    return midPointNotBlocked && node1.isNeighbor(node2);
  }

  getNode(point: Point): Node {
    const node = this._nodes.get(point);
    if (node === undefined) {
      throw new Error(`Has no node with position: ${JSON.stringify(point)}`);
    }
    return node;
  }

  hasNode(point: Point): boolean {
    return this._nodes.has(point);
  }

  searchBFS(from: Node, searchPredicate: (node: Node) => boolean): boolean {
    const queue: Node[] = [from];
    const visited = new Set<Node>();
    while (queue.length !== 0) {
      const currentNode = queue.shift()!;
      if (searchPredicate(currentNode)) {
        return true;
      }
      currentNode.connectedNodes
        .filter(n => !visited.has(n))
        .forEach(n => {
          visited.add(n);
          queue.push(n);
        });
    }
    return false;
  }
}
