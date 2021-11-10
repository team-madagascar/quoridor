import {Point} from '../domain/core/point';
import {Wall} from '../domain/core/wall';
import {
  Command,
  Commands,
  MoveToDirectionCommand,
  MoveToNodeCommand,
  PlaceWallCommand,
} from '../domain/command';
import {GameView} from '../domain/core/game';

enum ConsoleCommands {
  move = 'move',
  jump = 'jump',
  wall = 'wall',
}

enum ConsoleWallDirections {
  h = 'h',
  v = 'v',
}

const NodeLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const WallLetters = ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export class KorotenkoAdapter {
  toKorotenkoCommand(command: Command): string {
    if (command instanceof PlaceWallCommand) {
      return this.serializePlaceWallCommand(command.wall);
    }
    if (command instanceof MoveToNodeCommand) {
      const currentNode = this.currentPlayerNode();
      const isJump = !currentNode.isNeighbor(command.node);
      const type = isJump ? ConsoleCommands.jump : ConsoleCommands.move;
      return this.serializeMoveCommand(command.node.position, type);
    }
    const c = command as MoveToDirectionCommand;
    const nodes = this.game.allowedNodesInDirection(
      this.game.getNode(this.game.currentPlayer.currentPosition),
      c.direction
    );
    if (nodes.length === 0) {
      throw new Error('Command is not supported: ' + command);
    }

    return this.toKorotenkoCommand(Commands.moveToNode(nodes[0]));
  }
  constructor(private readonly game: GameView) {}

  fromKorotenkoCommand(data: string): Command {
    let column: number;
    let row: number;
    let wall: Wall;

    const [command, coordinate]: [ConsoleCommands, string] = data.split(
      ' '
    ) as [ConsoleCommands, string];

    switch (command) {
      case ConsoleCommands.jump:
      case ConsoleCommands.move:
        column = NodeLetters.indexOf(coordinate[0]) * 2;
        row = parseInt(coordinate[1]) * 2 - 2;
        return Commands.moveToNode(
          this.game.getNode(Point.create(row, column))
        );
      case ConsoleCommands.wall:
        column = WallLetters.indexOf(coordinate[0]) * 2 + 1;
        row = parseInt(coordinate[1]) * 2 - 1;
        if (coordinate[2] === ConsoleWallDirections.h) {
          wall = new Wall([
            Point.create(row, column - 1),
            Point.create(row, column),
            Point.create(row, column + 1),
          ]);
        } else {
          wall = new Wall([
            Point.create(row - 1, column),
            Point.create(row, column),
            Point.create(row + 1, column),
          ]);
        }
        return Commands.placeWall(wall);
    }
  }

  private currentPlayerNode() {
    return this.game.getNode(this.game.currentPlayer.currentPosition);
  }

  private serializeMoveCommand(point: Point, command: ConsoleCommands): string {
    const letterCoordinate = NodeLetters[point.column / 2];
    const numberCoordinate = String((point.row + 2) / 2);
    return `${command} ${letterCoordinate}${numberCoordinate}`;
  }

  private serializePlaceWallCommand(wall: Wall): string {
    const centerPoint = wall.points[1];
    const consoleCommand = ConsoleCommands.wall;
    const letterCoordinate = WallLetters[(centerPoint.column - 1) / 2];
    const numberCoordinate = String((centerPoint.row + 1) / 2);
    const wallDirection =
      wall.points[0].row === centerPoint.row
        ? ConsoleWallDirections.h
        : ConsoleWallDirections.v;
    return `${consoleCommand} ${letterCoordinate}${numberCoordinate}${wallDirection}`;
  }
}
