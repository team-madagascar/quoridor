import {PlayersId} from './../web/enums/players-id';
import {Command} from './command';
import {PlayerGameResult} from './game-facade';
import {GameView} from './core/game';

export class GameClient {
  private readonly _id: PlayersId;

  constructor(private readonly gameListener: GameListener) {
    this._id = this.gameListener.id;
  }

  get id(): PlayersId {
    return this._id;
  }

  get listener(): GameListener {
    return this.gameListener;
  }
}

export interface GameListener {
  id: PlayersId;

  onGameStart(game: GameView): Promise<void>;

  onNextStep(game: GameView): Promise<Command>;

  onGameOver(result: PlayerGameResult): Promise<void>;
}
