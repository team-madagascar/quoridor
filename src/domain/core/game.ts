import {Direction, Directions, Point} from './point';
import {Player, PlayerView} from './player';
import {Wall} from './wall';
import {ConnectionBlocker} from './connection-blocker';
import {Node} from './node';
import {Players} from './players';
import {Graph} from './graph';

export const GAME_GRID_SIZE = 17;

export interface GameView {
  get currentPlayer(): PlayerView;

  get currentOpponent(): PlayerView;

  isBlocked(point: Point): boolean;

  hasPlayer(nodeView: Node): boolean;

  allowedNodesToMove(): ReadonlyArray<Node>;

  getNode(point: Point): Node;

  isGameOver(): boolean;

  get winner(): PlayerView;

  get loser(): PlayerView;

  moveToDirection(node: Node, direction: Direction): Node | undefined;

  get placedWalls(): ReadonlyArray<Wall>;

  canPlaceWall(wall: Wall): boolean;

  get players(): ReadonlyArray<PlayerView>;
}

export class Game implements GameView {
  private readonly _blocker = new ConnectionBlocker();
  private readonly _graph: Graph;
  private readonly _players: Players;

  constructor(playerId1: string, playerId2: string) {
    this._graph = new Graph(this._blocker);
    this._players = new Players(playerId1, playerId2, this._graph);
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

  getNode(point: Point): Node {
    return this._graph.getNode(point);
  }

  moveCurrentPlayerToDirection(direction: Direction) {
    this.requireGameIsNotOver();
    this.movePlayerToDirection(this._players.currentPlayer, direction);
    this._players.changeCurrentPlayer();
  }

  moveCurrentPlayerToNode(node: Node) {
    this.requireGameIsNotOver();
    if (this.allowedNodesToMove().includes(node)) {
      this._players.currentPlayer.moveTo(node);
    }
    this._players.changeCurrentPlayer();
  }

  hasPlayer(node: Node): boolean {
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

  allowedNodesToMove(): ReadonlyArray<Node> {
    const currentNode = this._players.currentPlayer.currentNode;
    return Directions.allDirections()
      .map(d => this.moveToDirection(currentNode, d))
      .filter(n => n !== undefined) as ReadonlyArray<Node>;
  }

  get players(): ReadonlyArray<PlayerView> {
    return this._players.players;
  }

  get winner(): PlayerView {
    if (this.isGameOver()) {
      return this._players.currentOpponent;
    }
    throw new Error('Has no winner yet. Game is not over');
  }

  get loser(): PlayerView {
    if (this.isGameOver()) {
      return this.currentPlayer;
    }
    throw new Error('Has no loser yet. Game is not over');
  }

  get currentOpponent(): PlayerView {
    return this._players.currentOpponent;
  }

  get currentPlayer(): PlayerView {
    return this._players.currentPlayer;
  }

  getPlayer(node: Node): PlayerView {
    return this._players.getPlayer(node);
  }

  isBlocked(point: Point) {
    return this._blocker.isBlocked(point);
  }

  private movePlayerToDirection(player: Player, direction: Direction) {
    const newNode = this.moveToDirection(player.currentNode, direction);
    if (newNode === undefined) {
      throw new Error(
        `Player "${player.id}" can't make step in direction: ${Direction[direction]}`
      );
    }
    player.moveTo(newNode);
  }

  moveToDirection(node: Node, direction: Direction): Node | undefined {
    if (!node.canMoveToDirection(direction)) {
      return undefined;
    }
    const newNode = node.moveToDirection(direction);
    if (this._players.nodeHasPlayer(newNode)) {
      return this.moveToDirection(newNode, direction);
    }
    return newNode;
  }

  private requirePlayersCanReachFinishes(wall: Wall) {
    if (!this._players.canPlayersReachFinishPoints()) {
      this._blocker.removeWall(wall);
      throw new Error('Players should be able to reach their finish lines');
    }
  }

  private requireGameIsNotOver() {
    if (this.isGameOver()) {
      throw new Error('Game is already over');
    }
  }
}

export const NODE_GAP = 2;
