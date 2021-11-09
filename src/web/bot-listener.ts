import {GameListener} from '../domain/client';
import {RandomBot} from '../bot/random-bot';
import {GameView} from '../domain/core/game';
import {Command} from '../domain/command';

export class BotListener implements GameListener {
  private bot: RandomBot | null = null;

  constructor(public id: string) {}

  onSessionOver() {}

  onGameStart(game: GameView): Promise<void> {
    this.bot = new RandomBot(
      game.currentPlayer.currentPosition,
      game.currentPlayer.remainingWallsCount
    );
    return Promise.resolve();
  }

  async onGameOver(): Promise<void> {
    this.bot = null;
  }

  onNextStep(game: GameView): Promise<Command> {
    return Promise.resolve(
      this.bot?.randomMove(
        game.allowedNodesToMove(),
        game.canPlaceWall.bind(game)
      ) as Command
    );
  }
}