import {Command} from './command';
import {PlayerGameResult} from './game-facade';
import {GameView} from './core/game';

export abstract class GameClient {
  private clientListener: ClientListener | undefined;

  protected constructor(private readonly _id: string) {}

  get id(): string {
    return this._id;
  }

  setGameListener(clientListener: ClientListener) {
    this.clientListener = clientListener;
  }

  stopGame() {
    this.clientListener!.onStopGame();
  }

  abstract get listener(): GameListener;
}

export interface GameListener {
  onSessionOver(): void;

  onGameStart(game: GameView): Promise<void>;

  onNextStep(game: GameView): Promise<Command>;

  onGameOver(result: PlayerGameResult): void;
}

export interface ClientListener {
  onStopGame(): void;
}
