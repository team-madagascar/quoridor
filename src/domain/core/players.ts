import {Player} from './player';
import {Point} from './point';
import {Node} from './node';
import {Graph} from './graph';
import {PlayerConstructor, PlayersConstructor} from './game';

export class Players {
  private _currentPlayer: Player;
  private _players: [Player, Player];

  static readonly FINISH_ROW_BLACK = 8 * 2;
  static readonly FINISH_ROW_WHITE = 0;

  readonly START_POS_BLACK = Point.create(0, 4).scale(2);
  readonly START_POS_WHITE = Point.create(8, 4).scale(2);

  constructor(players: PlayersConstructor | undefined, graph: Graph) {
    if (players === undefined) {
      this.createDefaultPlayers(graph);
    } else {
      this.createPlayers(players, graph);
    }
    this._currentPlayer = this._players[1];
  }

  private createPlayers(players: PlayersConstructor, graph: Graph) {
    const p1 = new Player(
      graph.getNode(players.black?.startPos || this.START_POS_BLACK)!,
      Players.FINISH_ROW_BLACK,
      players.black?.id || 'B'
    );
    const p2 = new Player(
      graph.getNode(players.white?.startPos || this.START_POS_WHITE)!,
      Players.FINISH_ROW_WHITE,
      players.white?.id || 'W'
    );
    this._players = [p1, p2];
  }

  somePlayerWin(): boolean {
    return this._players.some(p => p.isFinishReached());
  }

  get players(): ReadonlyArray<Player> {
    return this._players;
  }

  get currentOpponent(): Player {
    return this._currentPlayer === this._players[0]
      ? this._players[1]
      : this._players[0];
  }

  get currentPlayer(): Player {
    return this._currentPlayer;
  }

  nodeHasPlayer(node: Node) {
    return this._players.some(p => p.currentNode === node);
  }

  changeCurrentPlayer() {
    const playerIndex = this._currentPlayer === this._players[0] ? 1 : 0;
    this._currentPlayer = this._players[playerIndex];
  }

  canPlayersReachFinishPoints() {
    return (
      this._players[0].canReachFinishPoint() &&
      this._players[1].canReachFinishPoint()
    );
  }

  getPlayer(node: Node): Player {
    const player = this._players.find(p => p.currentNode === node);
    if (player === undefined) {
      throw new Error(`Node: ${JSON.stringify(node)} has no player`);
    }
    return player;
  }

  private createDefaultPlayers(graph: Graph) {
    this._players = [
      new Player(
        graph.getNode(this.START_POS_BLACK)!,
        Players.FINISH_ROW_BLACK,
        'B'
      ),
      new Player(
        graph.getNode(this.START_POS_WHITE)!,
        Players.FINISH_ROW_WHITE,
        'W'
      ),
    ];
  }
}
