import {Command} from './command';
import {PlayerGameResult} from './game-facade';
import {PlayerView} from './core/player';
import {Point} from './core/point';
import {GameView} from './core/view';

export abstract class GameClient {
  protected constructor(
    private readonly _clientListener: ClientListener,
    private readonly _id: string
  ) {}

  get id(): string {
    return this._id;
  }

  abstract get listener(): GameListener;
}

export interface GameListener {
  onRestart(opponentResult: PlayerGameResult): Promise<boolean>;

  onGameStart(game: GameView): Promise<void>;

  onNextStep(game: GameView): Promise<Command>;

  onGameOver(result: PlayerGameResult): void;
}

export interface ClientListener {
  onRestartRequest(
    clientId: string,
    clientResult: PlayerGameResult
  ): Promise<boolean>;
}
