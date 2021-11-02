import {Game} from '../../../src/domain/core/game';
import {Direction, Point} from '../../../src/domain/core/point';
import {Wall} from '../../../src/domain/core/wall';
import {printGameGridToConsole} from '../utils/utils';
import {Players} from '../../../src/domain/core/players';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  it('should throw error when new wall intersect already placed wall', () => {
    game.placeWall(Wall.create(Point.create(0, 1), Direction.Down));

    const f = () =>
      game.placeWall(Wall.create(Point.create(1, 0), Direction.Right));

    expect(f).toThrow('Wall shouldn`t intersect already placed walls');
  });

  it('should throw error when players can`t reach their finishes', () => {
    game = new Game({
      walls: [
        Wall.create(Point.create(0, 7), Direction.Down),
        Wall.create(Point.create(3, 8), Direction.Right),
      ],
    });
    const f = () =>
      game.placeWall(Wall.create(Point.create(0, 11), Direction.Down));

    expect(f).toThrow('Players should be able to reach their finish lines');
  });

  it('should throw error when game is finished', () => {
    game = new Game({
      players: {
        black: {startPos: Point.create(Players.FINISH_ROW_BLACK, 0)},
      },
    });

    const f = () => game.moveCurrentPlayerToDirection(Direction.Down);

    expect(f).toThrow('Game is already over');
  });

  it('should make two steps when can`t do one step', () => {
    game = new Game({
      players: {
        black: {startPos: Point.create(8, 8)},
        white: {startPos: Point.create(10, 8)},
      },
    });

    const playersBeforeTwoSteps = game.players;
    expect(playersBeforeTwoSteps[0].currentPosition).toBe(Point.create(8, 8));
    expect(playersBeforeTwoSteps[1].currentPosition).toBe(Point.create(10, 8));

    game.moveCurrentPlayerToDirection(Direction.Up);

    const playersAfterTwoSteps = game.players;
    expect(playersAfterTwoSteps[0].currentPosition).toBe(Point.create(8, 8));
    expect(playersAfterTwoSteps[1].currentPosition).toBe(Point.create(6, 8));
  });
  it('should find shortest distance to', () => {
    const player = game.currentPlayer;
    game.moveCurrentPlayerToDirection(Direction.Up);
    game.placeWall(Wall.create(Point.create(1, 6), Direction.Right));
    const node = game.getNode(player.currentPosition);
    const distance = node.shortestDistanceTo(
      n => player.finishRow === n.position.row
    );
    expect(distance).toBe(8);
  });
});
