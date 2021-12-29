import {Command} from './command';
import {PlayerGameResult} from './game-facade';
import {GameView} from './core/game';

export class GameClient {
  private readonly _id: string;

  constructor(private readonly gameListener: GameListener) {
    this._id = this.gameListener.id;
  }

  get id(): string {
    return this._id;
  }

  get listener(): GameListener {
    return this.gameListener;
  }
}

export interface GameListener {
  id: string;

  onGameStart(game: GameView): Promise<void>;

  onOpponentStep(game: GameView, opponentStep: Command | null): Promise<void>;

  onNextStep(game: GameView, opponentStep: Command | null): Promise<Command>;

  onGameOver(result: PlayerGameResult): Promise<void>;
}
