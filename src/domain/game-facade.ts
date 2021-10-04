import {Game} from './core/game';
import {ClientListener, GameClient} from './client';

export enum PlayerGameResult {
  Victory,
  Defeat,
  Draw,
}

export class GameFacade implements ClientListener {
  private _game: Game;
  private _gameIsActive = false;
  private _currentClient: GameClient;

  constructor(
    private readonly _client1: GameClient,
    private readonly _client2: GameClient
  ) {
    this._currentClient = _client1;
    this._game = new Game(_client1.id, _client2.id);
  }

  async onRestartRequest(
    clientId: string,
    opponentResult: PlayerGameResult
  ): Promise<boolean> {
    const opponent = this.getOpponent(clientId);
    const restart = await opponent.listener.onRestart(opponentResult);
    if (restart) {
      await this.restart();
      return true;
    }
    return false;
  }

  async startGame(): Promise<void> {
    await this.notifyGameStarted();
    this._gameIsActive = true;
    while (!this._game.isGameOver()) {
      const command = await this._currentClient.listener.onNextStep(this._game);
      command.invoke(this._game);
      this.changeCurrentClient();
    }
    this._gameIsActive = false;
    this.sendWinnerGameResult();
    this.sendLoserGameResult();
  }

  private async notifyGameStarted() {
    const notification1 = this._client1.listener.onGameStart(this._game);
    const notification2 = this._client1.listener.onGameStart(this._game);
    await Promise.all([notification1, notification2]);
  }

  private async restart() {
    if (this._gameIsActive) {
      this._game = new Game(this._client1.id, this._client2.id);
    }
    await this.startGame();
  }

  private sendWinnerGameResult() {
    const winner = this.getClientById(this._game.winner.id);
    winner.listener.onGameOver(PlayerGameResult.Victory);
  }

  private sendLoserGameResult() {
    const winner = this.getClientById(this._game.loser.id);
    winner.listener.onGameOver(PlayerGameResult.Defeat);
  }

  private getClientById(id: string) {
    if (this._client1.id === id) {
      return this._client1;
    }
    if (this._client2.id === id) {
      return this._client2;
    }
    throw new Error(`Has no client with such id: ${id}`);
  }

  private getOpponent(id: string) {
    if (this._client1.id === id) {
      return this._client2;
    }
    if (this._client2.id === id) {
      return this._client1;
    }
    throw new Error(`Has no client with such id: ${id}`);
  }

  private changeCurrentClient() {
    this._currentClient =
      this._currentClient === this._client1 ? this._client2 : this._client1;
  }
}
