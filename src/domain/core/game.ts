import {Direction, Point} from './point';
import {Player, PLAYER_STEP, PlayerView} from './player';
import {Wall} from './wall';
import {ConnectionBlocker} from './connection-blocker';
import {Node} from './node';
import {Players} from './players';

export const GAME_GRID_SIZE = 17;

export class Game {
  private readonly _blocker = new ConnectionBlocker();
  private readonly _nodes = new Map<Point, Node>();
  private readonly _players: Players;

  constructor(playerId1: string, playerId2: string) {
    this.initNodes();
    this._players = new Players(playerId1, playerId2, this._nodes);
  }

  private initNodes() {
    for (let i = 0; i < GAME_GRID_SIZE; i++) {
      for (let j = 0; j < GAME_GRID_SIZE; j++) {
        const point = Point.create(i, j);
        if (point.isEven()) {
          this._nodes.set(point, new Node(point, this._blocker, this._nodes));
        }
      }
    }
  }

  moveCurrentPlayer(direction: Direction) {
    this.requireGameIsNotOver();
    this.moveCurrentPlayerToDirection(direction);
    this._players.changeCurrentPlayer();
  }

  private moveCurrentPlayerToDirection(direction: Direction) {
    const newNode = this.movePlayer(
      this._players.currentPlayer.currentNode,
      direction
    );
    if (newNode === undefined) {
      throw new Error(
        `Player "${this._players.currentPlayer.id}" can't make step in direction: ${Direction[direction]}`
      );
    }
    this._players.currentPlayer.moveTo(newNode);
  }

  hasPlayer(point: Point): boolean {
    return this._players.nodeHasPlayer(this._nodes.get(point)!);
  }

  placeWall(wall: Wall) {
    this.requireGameIsNotOver();
    this._players.currentPlayer.requireToHaveWallsToPlace();
    this._blocker.placeWall(wall);
    this.requirePlayersCanReachFinishes(wall);
    this._players.currentPlayer.takeWall();
    this._players.changeCurrentPlayer();
  }

  get isGameOver(): boolean {
    return this._players.somePlayerWin();
  }

  get players(): ReadonlyArray<PlayerView> {
    return this._players.players;
  }

  get winner(): Player {
    if (this.isGameOver) {
      return this._players.currentPlayer;
    }
    throw new Error('Has no winner yet. Game is not over');
  }

  get currentOpponent(): PlayerView {
    return this._players.currentOpponent;
  }

  get currentPlayer(): PlayerView {
    return this._players.currentPlayer;
  }

  getPlayer(point: Point): Player {
    return this._players.getPlayer(point);
  }

  isBlocked(point: Point) {
    return this._blocker.isBlocked(point);
  }

  private movePlayer(node: Node, direction: Direction): Node | undefined {
    if (!node.canMoveToDirection(direction)) {
      return undefined;
    }
    const newNode = node.moveToDirection(direction);
    if (this._players.nodeHasPlayer(newNode)) {
      return this.movePlayer(newNode, direction);
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
    if (this.isGameOver) {
      throw new Error('Game is already over');
    }
  }
}

export const NODE_GAP = 2;
