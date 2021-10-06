import {Bot} from './bot';
import {GameView} from '../domain/core/game';
import {Command} from '../domain/command';

export class BotListener {
  private bot: Bot | null = null;

  onSessionOver() {}

  onGameStart(game: GameView): Promise<void> {
    this.bot = new Bot(
      game.currentPlayer.currentPosition,
      game.currentPlayer.remainingWallsCount
    );
    return Promise.resolve();
  }

  onGameOver(): void {
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
