import {Game, GAME_GRID_SIZE} from '../../../src/domain/core/game';
import {Point} from '../../../src/domain/core/point';

/**
 * '${player id}' - player
 * '#' - wall
 * '*' - player node
 */
export const printGameGridToConsole = (game: Game) => {
  const grid: string[][] = [];
  for (let i = 0; i < GAME_GRID_SIZE; i++) {
    grid.push([]);
    for (let j = 0; j < GAME_GRID_SIZE; j++) {
      const point = Point.create(i, j);
      if (game.hasPlayer(point)) {
        const player = game.getPlayer(point);
        grid[point.row][point.column] = player.id;
        continue;
      }
      if (game.isBlocked(point)) {
        grid[point.row][point.column] = '#';
        continue;
      }
      if (point.isEven()) {
        grid[point.row][point.column] = '*';
        continue;
      }
      grid[point.row][point.column] = ' ';
    }
  }
  console.table(grid);
};
