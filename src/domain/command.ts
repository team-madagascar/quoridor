import {Game} from './core/game';
import {Direction} from './core/point';
import {Wall} from './core/wall';

export interface Command {
  invoke(game: Game): void;
}

export class MoveCommand implements Command {
  constructor(readonly direction: Direction) {}

  invoke(game: Game): void {
    game.moveCurrentPlayerToDirection(this.direction);
  }
}

export class PlaceWallCommand implements Command {
  constructor(readonly wall: Wall) {}

  invoke(game: Game): void {
    game.placeWall(this.wall);
  }
}

export class Commands {
  static move(direction: Direction): Command {
    return new MoveCommand(direction);
  }

  static placeWall(wall: Wall): Command {
    return new PlaceWallCommand(wall);
  }
}
