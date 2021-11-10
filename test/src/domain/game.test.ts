import {Game, GameView} from '../../../src/domain/core/game';
import {Direction, Point} from '../../../src/domain/core/point';
import {Wall} from '../../../src/domain/core/wall';
import {printGameGridToConsole} from '../utils/utils';
import {Players} from '../../../src/domain/core/players';
import {SmartBot} from '../../../src/bot/smart-bot';

function test2(gameView: GameView) {
  const t = gameView.allowedNodesToMove().map(n => ({
    node: n,
    distance: n.shortestPathTo(
      n => n.position.row === gameView.currentPlayer.finishRow
    ),
  }));
  t.sort((a, b) => (a.distance! >= b.distance! ? 1 : -1));
  return t[0];
}

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  it('should throw error when new wall intersect already placed wall', () => {
    printGameGridToConsole(game);
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
      currOpponent: {startPos: Point.create(Players.FINISH_ROW_BLACK, 0)},
    });

    const f = () => game.moveCurrentPlayerToDirection(Direction.Down);

    expect(f).toThrow('Game is already over');
  });

  it('should make two steps when can`t do one step', () => {
    game = new Game({
      currOpponent: {startPos: Point.create(8, 8)},
      currPlayer: {startPos: Point.create(10, 8)},
    });

    const playersBeforeTwoSteps = [game.currentOpponent, game.currentPlayer];
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
    const result = player.currentNode.shortestPathTo(
      n => player.finishRow === n.position.row
    );
    expect(result?.distance).toBe(8);
  });
  it('should test', () => {
    // const bot = new SmartBot(game);
    // game.moveCurrentPlayerToDirection(Direction.Up);
    // game.placeWall(Wall.create(Point.create(1, 6), Direction.Right));
    // printGameGridToConsole(game);
    // const n = bot.bestNodeToMove();
    // const w = bot.bestWallToPlace();
    // console.log({node: n.node.toString(), e: n.estimate});
    // console.log({wall: w.wall.toString(), e: w.estimate});
    // expect(0).toBe(0);
  });
});
