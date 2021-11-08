import {Game, GameView} from '../domain/core/game';
import {Command, Commands} from '../domain/command';
import {getWallToPlace} from './get-allowed-walls-to-place';
import {estimateFunction} from './estimate-function';
import {Direction} from '../domain/core/point';

export class SmartBot {
  constructor(private readonly game: Game) {}

  doStep(gameView: GameView): Command {
    return Commands.moveToNode(this.bestNodeToMove(gameView));
  }

  private bestWallToPlace(): Command {
    const a = getWallToPlace(this.game).map(w => {
      this.game.placeWall(w);
      const r = {wall: w, estimate: estimateFunction(this.game)};
      this.game.removeWall(w);
      return r;
    });

    return Commands.moveToDirection(Direction.Up);
  }

  private bestNodeToMove(gameView: GameView) {
    const t = gameView.allowedNodesToMove().map(n => ({
      node: n,
      distance: n.shortestPathTo(
        n => n.position.row === gameView.currentPlayer.finishRow
      )!.distance,
    }));
    t.sort((a, b) => (a.distance >= b.distance ? 1 : -1));
    return t[0].node;
  }
}
