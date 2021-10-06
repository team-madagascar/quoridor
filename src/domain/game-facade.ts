import {Game} from './core/game';
import {ClientListener, GameClient} from './client';

export enum PlayerGameResult {
  Victory,
  Defeat,
}

export class GameFacade implements ClientListener {
  private _game: Game | undefined;
  private _currentClient: GameClient;
  private _sessionOver = false;

  constructor(
    private readonly _client1: GameClient,
    private readonly _client2: GameClient
  ) {
    this._currentClient = _client1;
  }

  static async start(client1: GameClient, client2: GameClient): Promise<void> {
    const game = new GameFacade(client1, client2);
    while (!game._sessionOver) {
      await game.startGame();
    }
  }

  private async startGame(): Promise<void> {
    this._game = new Game(this._client1.id, this._client2.id);
    await this.notifyGameStarted();
    while (!this._game.isGameOver()) {
      const command = await this._currentClient.listener.onNextStep(this._game);
      if (this._sessionOver) {
        this.notifySessionOver();
        return;
      }
      command.invoke(this._game);
      this.changeCurrentClient();
    }
    this.sendWinnerGameResult();
    this.sendLoserGameResult();
  }

  private async notifyGameStarted() {
    const notification1 = this._client1.listener.onGameStart(this._game!);
    const notification2 = this._client1.listener.onGameStart(this._game!);
    await Promise.all([notification1, notification2]);
  }

  private sendWinnerGameResult() {
    const winner = this.getClientById(this._game!.winner.id);
    winner.listener.onGameOver(PlayerGameResult.Victory);
  }

  private sendLoserGameResult() {
    const winner = this.getClientById(this._game!.loser.id);
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

  private changeCurrentClient() {
    this._currentClient =
      this._currentClient === this._client1 ? this._client2 : this._client1;
  }

  onStopGame() {
    this._sessionOver = true;
  }

  private notifySessionOver() {
    this._client1.listener.onSessionOver();
    this._client1.listener.onSessionOver();
  }
}
