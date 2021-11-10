import {Direction, Directions, Point} from './point';
import {Player, PlayerView} from './player';
import {Wall} from './wall';
import {ConnectionBlocker} from './connection-blocker';
import {GameNode} from './node';
import {PlayerInitialState, Players} from './players';
import {Graph} from './graph';

export interface GameView {
  get currentPlayer(): PlayerView;

  get currentOpponent(): PlayerView;

  isBlocked(point: Point): boolean;

  hasPlayer(nodeView: GameNode): boolean;

  allowedNodesToMove(): ReadonlyArray<GameNode>;

  allowedNodesInDirection(node: GameNode, direction: Direction): GameNode[];

  getNode(point: Point): GameNode;

  isGameOver(): boolean;

  get winner(): PlayerView;

  get loser(): PlayerView;

  get placedWalls(): ReadonlyArray<Wall>;

  canPlaceWall(wall: Wall): boolean;

  get players(): ReadonlyArray<PlayerView>;

  copy(): Game;
}

export interface GameConstructor {
  walls?: ReadonlyArray<Wall> | undefined;
  currPlayer?: PlayerInitialState | undefined;
  currOpponent?: PlayerInitialState | undefined;
}

export class Game implements GameView {
  private readonly _blocker = new ConnectionBlocker();
  private readonly _graph: Graph;
  private readonly _players: Players;

  constructor(constructor: GameConstructor = {} as GameConstructor) {
    this._graph = new Graph(this._blocker);
    const {currOpponent, currPlayer, walls} = constructor;
    if (walls !== undefined) {
      walls.forEach(w => this._blocker.placeWall(w));
    }
    this._players = new Players(this._graph, currPlayer, currOpponent);
  }

  canPlaceWall(wall: Wall): boolean {
    if (this._blocker.intersectPlacedWalls(wall)) {
      return false;
    }
    this._blocker.placeWall(wall);
    const canPlayersWin = this._players.canPlayersReachFinishPoints();
    this._blocker.removeWall(wall);
    if (!canPlayersWin) {
      return false;
    }
    if (!this.currentPlayer.hasWallsToPlace()) {
      return false;
    }
    return !this.isGameOver();
  }

  get placedWalls(): ReadonlyArray<Wall> {
    return this._blocker.placedWalls;
  }

  getNode(point: Point): GameNode {
    return this._graph.getNode(point);
  }

  moveCurrentPlayerToDirection(direction: Direction) {
    this.requireGameIsNotOver();
    this.movePlayerToDirection(this._players.currentPlayer, direction);
    this._players.changeCurrentPlayer();
  }

  moveCurrentPlayerToNode(node: GameNode) {
    this.requireGameIsNotOver();
    if (!this.allowedNodesToMove().includes(node)) {
      throw new Error(
        `Game: can't move player to node ${node.position.toString()}`
      );
    }
    this._players.currentPlayer.moveTo(node);
    this._players.changeCurrentPlayer();
  }

  hasPlayer(node: GameNode): boolean {
    return this._players.nodeHasPlayer(this.getNode(node.position));
  }

  placeWall(wall: Wall) {
    this.requireGameIsNotOver();
    this._players.currentPlayer.requireToHaveWallsToPlace();
    this._blocker.placeWall(wall);
    this.requirePlayersCanReachFinishes(wall);
    this._players.currentPlayer.takeWall();
    this._players.changeCurrentPlayer();
  }

  isGameOver(): boolean {
    return this._players.somePlayerWin();
  }

  allowedNodesToMove(): ReadonlyArray<GameNode> {
    const currentNode = this._players.currentPlayer.currentNode;
    const t = Directions.allDirections().map(d =>
      this.allowedNodesInDirection(currentNode, d)
    );
    const result: GameNode[] = [];
    t.forEach(nodes => result.push(...nodes));
    return result;
  }

  get players(): ReadonlyArray<PlayerView> {
    return this._players.players;
  }

  get winner(): PlayerView {
    if (this.isGameOver()) {
      return this._players.currentOpponent;
    }
    throw new Error('Game: Has no winner yet. Game is not over');
  }

  get loser(): PlayerView {
    if (this.isGameOver()) {
      return this.currentPlayer;
    }
    throw new Error('Game: Has no loser yet. Game is not over');
  }

  get currentOpponent(): PlayerView {
    return this._players.currentOpponent;
  }

  get currentPlayer(): PlayerView {
    return this._players.currentPlayer;
  }

  getPlayer(node: GameNode): PlayerView {
    return this._players.getPlayer(node);
  }

  isBlocked(point: Point) {
    return this._blocker.isBlocked(point);
  }

  copy(): Game {
    const walls = this._blocker.placedWalls;
    const player = this.currentPlayer;
    const opponent = this.currentOpponent;
    const constructor: GameConstructor = {
      walls,
      currPlayer: {
        id: player.id,
        wallsCount: player.remainingWallsCount,
        startPos: player.currentPosition,
        finishRow: player.finishRow,
      },
      currOpponent: {
        id: opponent.id,
        wallsCount: opponent.remainingWallsCount,
        startPos: opponent.currentPosition,
        finishRow: opponent.finishRow,
      },
    };
    return new Game(constructor);
  }

  private movePlayerToDirection(player: Player, direction: Direction) {
    const newNode = this.allowedNodesInDirection(player.currentNode, direction);
    if (newNode.length === 0) {
      throw new Error(
        `Game: Player "${player.id}" can't make step in direction: ${Direction[direction]}`
      );
    }
    player.moveTo(newNode[0]);
  }

  allowedNodesInDirection(node: GameNode, direction: Direction): GameNode[] {
    const newNode = node.moveToDirection(direction);
    if (newNode === undefined) return [];
    if (this._players.nodeHasPlayer(newNode)) {
      return this.jumpToDirection(newNode, direction, node);
    }
    return [newNode];
  }

  private jumpToDirection(
    prev: GameNode,
    direction: Direction,
    start: GameNode
  ) {
    const next = prev.moveToDirection(direction);
    if (next !== undefined) return [next];
    return Directions.allDirections()
      .map(d => prev.moveToDirection(d))
      .filter(
        n => n !== undefined && n.position !== start.position
      ) as GameNode[];
  }

  private requirePlayersCanReachFinishes(wall: Wall) {
    if (!this._players.canPlayersReachFinishPoints()) {
      this._blocker.removeWall(wall);
      throw new Error(
        'Game: Players should be able to reach their finish lines'
      );
    }
  }

  private requireGameIsNotOver() {
    if (this.isGameOver()) {
      throw new Error('Game: Game is already over');
    }
  }
}
