import {Point} from './domain/core/point';
import {Wall} from './domain/core/wall';
import {Command, Commands} from './domain/command';

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
  deserializeCommand(data: string): Command {
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
        return Commands.moveToNode(Point.create(row, column));
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

  serializePoint(point: Point, command: ConsoleCommands): string {
    const letterCoordinate = NodeLetters[point.column / 2];
    const numberCoordinate = String((point.row + 2) / 2);
    return `${command} ${letterCoordinate}${numberCoordinate}`;
  }

  serializeWall(wall: Wall): string {
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
