import {GameView} from '../domain/core/game';
import {Command, Commands} from '../domain/command';
import {getWallToPlace} from './get-allowed-walls-to-place';
import {estimateFunction} from './estimate-function';
import {Wall} from '../domain/core/wall';
import {GameNode} from '../domain/core/node';

export class SmartBot {
  constructor(private readonly game: GameView) {}

  doStep(): Command {
    const bestNodeToMove = this.bestNodeToMove();
    const bestWallToPlace = this.bestWallToPlace();
    if (bestWallToPlace === undefined) {
      return Commands.moveToNode(bestNodeToMove.node);
    }
    if (bestNodeToMove === undefined) {
      return Commands.placeWall(bestWallToPlace.wall);
    }
    if (bestNodeToMove.estimate <= bestWallToPlace.estimate) {
      return Commands.moveToNode(bestNodeToMove.node);
    }
    return Commands.placeWall(bestWallToPlace.wall);
  }

  bestWallToPlace(): {wall: Wall; estimate: number} {
    const a = getWallToPlace(this.game).map(w => {
      const gameCopy = this.game.copy();
      gameCopy.placeWall(w);
      return {wall: w, estimate: estimateFunction(gameCopy)};
    });
    a.sort((a, b) => (a.estimate >= b.estimate ? 1 : -1));
    return a[0];
  }

  bestNodeToMove(): {node: GameNode; estimate: number} {
    const t = this.game.allowedNodesToMove().map(n => {
      const gameCopy = this.game.copy();
      gameCopy.moveCurrentPlayerToNode(gameCopy.getNode(n.position));
      const estimate = estimateFunction(gameCopy);
      return {node: n, estimate};
    });
    t.sort((a, b) => a.estimate - b.estimate);
    return t[0];
  }
}
