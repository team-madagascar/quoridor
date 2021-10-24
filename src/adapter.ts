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

const LettersNodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const LettersWalls = ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class KorotenkoAdapter {
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
        column = LettersNodes.indexOf(coordinate[0]) * 2;
        row = parseInt(coordinate[1]) * 2 - 2;
        return Commands.moveToNode((Point.create(row, column)); // how convert point to node?
      case ConsoleCommands.wall:
        column = LettersWalls.indexOf(coordinate[0]) * 2 + 1;
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

  serializePoint(point: Point, isMove: boolean): string { // need smth to understand if point is jump or move
    const consoleCommand = isMove ? ConsoleCommands.move : ConsoleCommands.jump;
    const letterCoordinate = LettersNodes[point.column / 2];
    const numberCoordinate = String((point.row + 2) / 2);

    return `${consoleCommand} ${letterCoordinate}${numberCoordinate}`;
  }

  serializeWall(wall: Wall): string {
    const centerPoint = wall.points[1];
    const consoleCommand = ConsoleCommands.wall;
    const letterCoordinate = LettersWalls[(centerPoint.column - 1) / 2];
    const numberCoordinate = String((centerPoint.row + 1) / 2);
    const wallDirection =
      wall.points[0].row === centerPoint.row
        ? ConsoleWallDirections.h
        : ConsoleWallDirections.v;
    return `${consoleCommand} ${letterCoordinate}${numberCoordinate}${wallDirection}`;
  }
}
