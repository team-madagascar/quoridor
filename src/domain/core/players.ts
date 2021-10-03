import {Player} from './player';
import {Point} from './point';
import {Node} from './node';
import {Graph} from './graph';

export class Players {
  private _currentPlayer: Player;
  private readonly _players: [Player, Player];

  constructor(playerId1: string, playerId2: string, graph: Graph) {
    this._players = this.createPlayers(playerId1, playerId2, graph);
    this._currentPlayer = this._players[0];
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

  private createPlayers(
    playerId1: string,
    playerId2: string,
    graph: Graph
  ): [Player, Player] {
    const finishRow1 = 8 * 2;
    const finishRow2 = 0;
    const startPos1 = Point.create(0, 4).scale(2);
    const startPos2 = Point.create(8, 4).scale(2);
    return [
      new Player(graph.getNode(startPos1)!, finishRow1, playerId1),
      new Player(graph.getNode(startPos2)!, finishRow2, playerId2),
    ];
  }
}
