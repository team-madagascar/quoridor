import {GameView} from '../domain/core/game';
import {Command, Commands} from '../domain/command';
import {Wall} from '../domain/core/wall';
import {Directions} from '../domain/core/point';

const flat = <T>(arr: T[][]): T[] => ([] as T[]).concat(...arr);

const getWallToPlace = (game: GameView): Wall[] => {
  const opponent = game.currentOpponent;
  const opponentNode = game.getNode(opponent.currentPosition);
  const path = opponentNode.shortestPathTo(
    n => opponent.finishRow === n.position.row
  )!.path;
  const resultWalls = path.map(node => {
    const points = node.position.neighbors();
    const walls = points.map(
      startPoint =>
        Directions.allDirections()
          .map(direction => Wall.tryCreate(startPoint, direction))
          .filter(w => w !== null && game.canPlaceWall(w)) as Wall[]
    );
    return flat(walls);
  });
  return flat(resultWalls);
};

const estimateOpponentWinValue = (game: GameView): number => {
  if (game.isGameOver()) {
    return Number.POSITIVE_INFINITY;
  }

  const currentPlayer = game.currentPlayer;
  const currentOpponent = game.currentOpponent;

  const playerNode = currentPlayer.currentNode;
  const opponentNode = currentOpponent.currentNode;

  const playerShortestDistance: number = playerNode.shortestPathTo(
    n => currentPlayer.finishRow === n.position.row
  )?.distance as number;
  const opponentShortestDistance: number = opponentNode.shortestPathTo(
    n => currentOpponent.finishRow === n.position.row
  )?.distance as number;
  return playerShortestDistance - opponentShortestDistance;
};

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

  private bestWallToPlace(): GameStep[] {
    return getWallToPlace(this.game).map(w => {
      const gameCopy = this.game.copy();
      gameCopy.placeWall(w); // current player was changed
      return {
        command: Commands.placeWall(w),
        winValue: estimateOpponentWinValue(gameCopy),
      } as GameStep;
    });
  }

  private bestNodeToMove(): GameStep[] {
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
