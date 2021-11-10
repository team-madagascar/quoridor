import {KorotenkoAdapter} from '../../../src/console/korotenko-adapter';
import {Game} from '../../../src/domain/core/game';

describe('KorotenkoAdapter', () => {
  it('should test', () => {
    const game = new Game();
    const adapter = new KorotenkoAdapter(game);
    const t = adapter.fromKorotenkoCommand('move E2');
    console.log(t);
    expect(1).toBe(1);
  });
});
