import {GameView} from '../domain/core/game';
import {Command, Commands} from '../domain/command';
import {Direction} from '../domain/core/point';
import {Bot} from '../bot/bot';

export class SmartBot {
  doStep(gameView: GameView): Command {
    const bot = new Bot(
      gameView.currentPlayer.currentPosition,
      gameView.currentPlayer.remainingWallsCount
    );
    // todo make smart bot
    // return Commands.placeWall(Wall.create(Point.create(1, 6), Direction.Right));
    return bot.randomMove(
      gameView.allowedNodesToMove(),
      gameView.canPlaceWall.bind(gameView)
    );
    // if (gameView.currentPlayer.id === 'B') {
    //   return Commands.moveToDirection(Direction.Down);
    // } else {
    //   return Commands.moveToDirection(Direction.Up);
    // }
  }
}
