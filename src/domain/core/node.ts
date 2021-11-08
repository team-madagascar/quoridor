import {Direction, Point} from './point';
import {Graph} from './graph';

export const GAME_GRID_SIZE = 17;
export const NODE_GAP = 2;

export class GameNode {
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

  moveToDirection(direction: Direction): GameNode | undefined {
    const newPosition = this.position.move(direction, NODE_GAP);
    if (!this._graph.hasNode(newPosition)) return undefined;
    if (this.isConnectedTo(this._graph.getNode(newPosition))) {
      return this._graph.getNode(newPosition);
    }
    return undefined;
  }

  walk(endWalkPredicate: (node: GameNode) => boolean): boolean {
    return this._graph.searchBFS(this, endWalkPredicate);
  }

  shortestPathTo(endPredicate: (node: GameNode) => boolean): {
    distance: number;
    path: GameNode[];
  } | null {
    const queue: {distance: number; node: GameNode; path: GameNode[]}[] = [
      {distance: 0, node: this, path: []},
    ];
    const visited = new Set<GameNode>();
    while (queue.length !== 0) {
      const currentNode = queue.shift()!;
      const {
        node: currNode,
        distance: currDistance,
        path: currPath,
      } = currentNode;
      if (endPredicate(currNode)) {
        currPath.push(currNode);
        return {distance: currDistance, path: currPath};
      }
      currNode.connectedNodes
        .filter(n => !visited.has(n))
        .forEach(nextNode => {
          visited.add(nextNode);
          queue.push({
            distance: currDistance + 1,
            node: nextNode,
            path: [...currentNode.path, currNode],
          });
        });
    }
    return null;
  }

  hasAnyPathTo(target: GameNode): boolean {
    return this._graph.searchBFS(this, node => node.equals(target));
  }

  equals(node: GameNode): boolean {
    return this.position === node.position;
  }

  isConnectedTo(node: GameNode): boolean {
    return this._graph.hasConnection(node, this);
  }

  isNeighbor(node: GameNode): boolean {
    return this.position.isNeighbor(node.position, NODE_GAP);
  }

  allNeighbors(): ReadonlyArray<GameNode> {
    return this.position.neighbors(NODE_GAP).map(p => this._graph.getNode(p));
  }

  connectedNeighbors(): ReadonlyArray<GameNode> {
    return this.allNeighbors().filter(n => this.isConnectedTo(n));
  }

  get connectedNodes(): ReadonlyArray<GameNode> {
    return this.neighbors().filter(n => this.isConnectedTo(n));
  }

  private neighbors(): ReadonlyArray<GameNode> {
    return this.position.neighbors(NODE_GAP).map(n => this._graph.getNode(n));
  }
}
