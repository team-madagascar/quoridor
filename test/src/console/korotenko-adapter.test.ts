import {KorotenkoAdapter} from '../../../src/console/korotenko-adapter';
import {Game} from '../../../src/domain/core/game';

describe('KorotenkoAdapter', () => {
  const game = new Game();
  const adapter = new KorotenkoAdapter(game);
});
