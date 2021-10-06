import {Command} from './command';
import {PlayerGameResult} from './game-facade';
import {GameView} from './core/game';

export class GameClient {
  private clientListener: ClientListener | undefined;

  constructor(
    private readonly _id: string,
    private readonly gameListener: GameListener
  ) {}

  get id(): string {
    return this._id;
  }

  setGameListener(clientListener: ClientListener) {
    this.clientListener = clientListener;
  }

  stopGame() {
    this.clientListener!.onStopGame();
  }

  get listener(): GameListener {
    return this.gameListener;
  }
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
