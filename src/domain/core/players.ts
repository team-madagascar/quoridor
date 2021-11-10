import {Player} from './player';
import {Point} from './point';
import {GameNode} from './node';
import {Graph} from './graph';

export interface PlayerInitialState {
  startPos?: Point | undefined;
  finishRow?: number | undefined;
  id?: string | undefined;
  wallsCount?: number | undefined;
}

export class Players {
  private _currentPlayer: Player;
  private readonly _players: [Player, Player];

  static readonly FINISH_ROW_BLACK = 8 * 2;
  static readonly FINISH_ROW_WHITE = 0;

  readonly START_POS_BLACK = Point.create(0, 4).scale(2);

  readonly START_POS_WHITE = Point.create(8, 4).scale(2);

  constructor(
    graph: Graph,
    currPlayer: PlayerInitialState | undefined = undefined,
    currOpponent: PlayerInitialState | undefined = undefined
  ) {
    const orElse = <T>(value: T | undefined | null, orElse: T): T => {
      if (value === undefined || value === null) {
        return orElse;
      }
      return value;
    };
    const player = new Player(
      graph.getNode(orElse(currPlayer?.startPos, this.START_POS_WHITE))!,
      orElse(currPlayer?.finishRow, Players.FINISH_ROW_WHITE),
      orElse(currPlayer?.id, 'W'),
      orElse(currPlayer?.wallsCount, Player.DEFAULT_WALLS_COUNT)
    );
    const opponent = new Player(
      graph.getNode(orElse(currOpponent?.startPos, this.START_POS_BLACK))!,
      orElse(currOpponent?.finishRow, Players.FINISH_ROW_BLACK),
      orElse(currOpponent?.id, 'B'),
      orElse(currOpponent?.wallsCount, Player.DEFAULT_WALLS_COUNT)
    );
    this._players = [opponent, player];
    this._currentPlayer = player;
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

  nodeHasPlayer(node: GameNode) {
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

  getPlayer(node: GameNode): Player {
    const player = this._players.find(p => p.currentNode === node);
    if (player === undefined) {
      throw new Error(`${node.toString()} has no player`);
    }
    return player;
  }
}
