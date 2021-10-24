import {GameView} from '../domain/core/game';
import {Command, Commands} from '../domain/command';
import {Direction} from '../domain/core/point';

export class SmartBot {
  doStep(gameView: GameView): Command {
    // todo make smart bot
    return Commands.moveToDirection(Direction.Up);
  }
}
