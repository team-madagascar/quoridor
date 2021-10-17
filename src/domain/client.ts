import {Command} from './command';
import {PlayerGameResult} from './game-facade';
import {GameView} from './core/game';

export class GameClient {
  constructor(
    private readonly _id: string,
    private readonly gameListener: GameListener
  ) {}

  get id(): string {
    return this._id;
  }

  get listener(): GameListener {
    return this.gameListener;
  }
}

export interface GameListener {
  onGameStart(game: GameView): Promise<void>;

  onNextStep(game: GameView): Promise<Command>;

  onGameOver(result: PlayerGameResult): Promise<void>;
}
