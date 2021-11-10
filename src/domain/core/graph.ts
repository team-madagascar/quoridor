import {Point} from './point';
import {GameNode} from './node';
import {ConnectionBlocker} from './connection-blocker';

export class Graph {
  private readonly _nodes = new Map<Point, GameNode>();

  constructor(private readonly _blocker: ConnectionBlocker) {}

  hasConnection(node1: GameNode, node2: GameNode): boolean {
    const midPoint = node1.position.midPoint(node2.position);
    const midPointNotBlocked = !this._blocker.isBlocked(midPoint);
    return midPointNotBlocked && node1.isNeighbor(node2);
  }

  getNode(point: Point): GameNode {
    if (!point.isNodePoint()) {
      throw new Error(`Has no node with position: ${JSON.stringify(point)}`);
    }
    let node = this._nodes.get(point);
    if (node === undefined) {
      node = this.createGameNode(point);
    }
    return node;
  }

  /***
   * @param point - should be NodePoint
   */
  private createGameNode(point: Point): GameNode {
    const node = new GameNode(point, this);
    this._nodes.set(point, node);
    return node;
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
