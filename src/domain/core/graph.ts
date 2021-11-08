import {Point} from './point';
import {GAME_GRID_SIZE, GameNode} from './node';
import {ConnectionBlocker} from './connection-blocker';

export class Graph {
  private readonly _nodes = new Map<Point, GameNode>();

  constructor(private readonly _blocker: ConnectionBlocker) {
    for (let i = 0; i < GAME_GRID_SIZE; i++) {
      for (let j = 0; j < GAME_GRID_SIZE; j++) {
        const point = Point.create(i, j);
        if (point.isNodePoint()) {
          this._nodes.set(point, new GameNode(point, this));
        }
      }
    }
  }

  hasConnection(node1: GameNode, node2: GameNode): boolean {
    const midPoint = node1.position.midPoint(node2.position);
    const midPointNotBlocked = !this._blocker.isBlocked(midPoint);
    return midPointNotBlocked && node1.isNeighbor(node2);
  }

  getNode(point: Point): GameNode {
    const node = this._nodes.get(point);
    if (node === undefined) {
      throw new Error(`Has no node with position: ${JSON.stringify(point)}`);
    }
    return node;
  }

  hasNode(point: Point): boolean {
    return this._nodes.has(point);
  }

  searchBFS(
    from: GameNode,
    searchPredicate: (node: GameNode) => boolean
  ): boolean {
    const queue: GameNode[] = [from];
    const visited = new Set<GameNode>();
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
