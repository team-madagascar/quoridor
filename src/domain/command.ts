import {Game} from './core/game';
import {Direction} from './core/point';
import {Wall} from './core/wall';
import {Node} from './core/node';

export interface Command {
  invoke(game: Game): void;

  toString(): string;
}

export class MoveToDirectionCommand implements Command {
  constructor(readonly direction: Direction) {}

  invoke(game: Game): void {
    game.moveCurrentPlayerToDirection(this.direction);
  }

  toString(): string {
    return `move ${Direction[this.direction]}`;
  }
}

export class MoveToNodeCommand implements Command {
  constructor(readonly node: Node) {}

  invoke(game: Game): void {
    game.moveCurrentPlayerToNode(this.node);
  }

  toString(): string {
    return `move ${this.node.position.toString()}`;
  }
}

export class PlaceWallCommand implements Command {
  constructor(readonly wall: Wall) {}

  invoke(game: Game): void {
    game.placeWall(this.wall);
  }

  toString(): string {
    return `wall: ${this.wall.toString()}`;
  }
}

export class Commands {
  static moveToDirection(direction: Direction): Command {
    return new MoveToDirectionCommand(direction);
  }

  static moveToNode(node: Node): Command {
    return new MoveToNodeCommand(node);
  }

  static placeWall(wall: Wall): Command {
    return new PlaceWallCommand(wall);
  }
}
