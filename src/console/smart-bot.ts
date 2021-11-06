import {GameView} from '../domain/core/game';
import {Command, Commands} from '../domain/command';
import {RandomBot} from '../bot/bot';

export class SmartBot {
  private readonly bot = new RandomBot(
    this.game.currentPlayer.currentPosition,
    this.game.currentPlayer.remainingWallsCount
  );

  constructor(private readonly game: GameView) {}

  doStep(gameView: GameView): Command {
    return Commands.moveToNode(gameView.allowedNodesToMove()[0]);
  }
}
