import {GameView} from '../domain/core/game';
import {Command, Commands} from '../domain/command';
import {Direction, Point} from '../domain/core/point';
import {Wall} from '../domain/core/wall';

export class SmartBot {
  doStep(gameView: GameView): Command {
    // todo make smart bot
    return Commands.placeWall(Wall.create(Point.create(1, 6), Direction.Right));
  }
}
