import {Game, GameView} from '../domain/core/game';
import {Command, Commands} from '../domain/command';

export class SmartBot {
  constructor(private readonly game: GameView) {}

  doStep(gameView: GameView): Command {
    const t = gameView.allowedNodesToMove().map(n => ({
      node: n,
      distance: n.shortestDistanceTo(
        n => n.position.row === gameView.currentPlayer.finishRow
      ),
    }));
    t.sort((a, b) => (a.distance >= b.distance ? 1 : -1));
    return Commands.moveToNode(t[0].node);
  }
}
