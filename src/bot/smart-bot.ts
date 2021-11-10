import {GameView} from '../domain/core/game';
import {Command, Commands} from '../domain/command';
import {getWallToPlace} from './get-allowed-walls-to-place';
import {estimateOpponentWinValue} from './estimate-function';

interface GameStep {
  command: Command;
  winValue: number;
}

export class SmartBot {
  constructor(private readonly game: GameView) {}

  doStep(): Command {
    const bestNodeToMove = this.bestNodeToMove();
    const bestWallToPlace = this.bestWallToPlace();
    return SmartBot.findBestGameStep([...bestNodeToMove, ...bestWallToPlace]);
  }

  bestWallToPlace(): GameStep[] {
    return getWallToPlace(this.game).map(w => {
      const gameCopy = this.game.copy();
      gameCopy.placeWall(w); // current player was changed
      return {
        command: Commands.placeWall(w),
        winValue: estimateOpponentWinValue(gameCopy),
      } as GameStep;
    });
  }

  bestNodeToMove(): GameStep[] {
    return this.game.allowedNodesToMove().map(n => {
      const gameCopy = this.game.copy();
      gameCopy.moveCurrentPlayerToNode(gameCopy.getNode(n.position));
      const value = estimateOpponentWinValue(gameCopy); // current player was changed
      return {
        command: Commands.moveToNode(n),
        winValue: value,
      } as GameStep;
    });
  }

  private static findBestGameStep(steps: GameStep[]): Command {
    steps.sort((a: GameStep, b: GameStep) => a.winValue - b.winValue);
    return steps[steps.length - 1].command;
  }
}
