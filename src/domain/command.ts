import {Game} from './core/game';
import {Direction, Point} from './core/point';
import {Wall} from './core/wall';
import {Node} from './core/node';
import {node} from 'webpack';

export interface Command {
  invoke(game: Game): void;
}

export class MoveToDirectionCommand implements Command {
  constructor(readonly direction: Direction) {}

  invoke(game: Game): void {
    game.moveCurrentPlayerToDirection(this.direction);
  }
}

export class MoveToNodeCommand implements Command {
  constructor(readonly node: Node | Point) {}

  invoke(game: Game): void {
    if (node instanceof Node) {
      game.moveCurrentPlayerToNode(this.node as Node);
    } else if (node instanceof Point) {
      game.moveCurrentPlayerToNode(game.getNode(node));
    }
  }
}

export class PlaceWallCommand implements Command {
  constructor(readonly wall: Wall) {}

  invoke(game: Game): void {
    game.placeWall(this.wall);
  }
}

export class Commands {
  static moveToDirection(direction: Direction): Command {
    return new MoveToDirectionCommand(direction);
  }

  static moveToNode(node: Node | Point): Command {
    return new MoveToNodeCommand(node);
  }

  static placeWall(wall: Wall): Command {
    return new PlaceWallCommand(wall);
  }
}
