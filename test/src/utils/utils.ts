import {Game} from '../../../src/domain/core/game';
import {Point} from '../../../src/domain/core/point';
import {GAME_GRID_SIZE, GameNode} from '../../../src/domain/core/node';
/**
 * '${player id}' - player
 * '#' - wall
 * '*' - player node
 */
export const printGameGridToConsole = (
  game: Game,
  marker: ((n: GameNode | Point) => string | null) | null = null
) => {
  if (marker === null) {
    marker = () => null;
  }

  const grid: string[][] = [];
  for (let i = 0; i < GAME_GRID_SIZE; i++) {
    grid.push([]);
    for (let j = 0; j < GAME_GRID_SIZE; j++) {
      const point = Point.create(i, j);
      if (game.isBlocked(point)) {
        grid[point.row][point.column] = '#';
        continue;
      }
      if (point.isNodePoint()) {
        const node = game.getNode(point);
        if (game.hasPlayer(node)) {
          const player = game.getPlayer(node);
          grid[point.row][point.column] = player.id;
          continue;
        }
        grid[point.row][point.column] = '*';

        const newMark = marker(node);
        if (newMark !== null) {
          grid[point.row][point.column] = newMark;
        }

        continue;
      }
      grid[point.row][point.column] = ' ';

      const newMark = marker(point);
      if (newMark !== null) {
        grid[point.row][point.column] = newMark;
      }
    }
  }
  console.log(`Current player: ${game.currentPlayer.id}`);
  console.table(grid);
};
