import {Bot} from './bot';
import {GameView} from '../domain/core/game';
import {Command} from '../domain/command';
import {GameListener} from '../domain/client';

export class BotListener implements GameListener {
  private bot: Bot | null = null;

  onSessionOver() {}

  onGameStart(game: GameView): Promise<void> {
    this.bot = new Bot(
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
