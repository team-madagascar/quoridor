import {GameView} from '../domain/core/game';
import {Command} from '../domain/command';
import {Bot} from '../bot/bot';

export class SmartBot {
  private readonly bot = new Bot(
    this.game.currentPlayer.currentPosition,
    this.game.currentPlayer.remainingWallsCount
  );

  constructor(private readonly game: GameView) {}

  doStep(gameView: GameView): Command {
    return this.bot.randomMove(
      gameView.allowedNodesToMove(),
      gameView.canPlaceWall.bind(gameView)
    );
  }
}
