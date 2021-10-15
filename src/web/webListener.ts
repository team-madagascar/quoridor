import {setWallsNumbers} from './helpers/setWallsNumbers';
import {emitter, eventTypes} from './emitter';
import {GameView} from '../domain/core/game';
import {PlayerGameResult} from '../domain/game-facade';
import {Command, Commands} from '../domain/command';
import {Point} from '../domain/core/point';
import {Wall} from '../domain/core/wall';
import {Direction} from '../domain/core/point';
import {showWinner} from './resultsModal';
import {renderBoard} from './index';

export class WebListener {
  onSessionOver() {}

  onGameStart(game: GameView): Promise<void> {
    renderBoard(
      game.currentPlayer.currentPosition.column,
      game.currentPlayer.currentPosition.row,
      game.currentOpponent.currentPosition.column,
      game.currentOpponent.currentPosition.row
    );
    return Promise.resolve();
  }

  onGameOver(result: PlayerGameResult): void {
    showWinner(result);
  }

  onNextStep(game: GameView): Promise<Command> {
    renderBoard(
      game.currentPlayer.currentPosition.column,
      game.currentPlayer.currentPosition.row,
      game.currentOpponent.currentPosition.column,
      game.currentOpponent.currentPosition.row,
      game.placedWalls
    );
    setWallsNumbers({
      playerWallsCount: game.currentPlayer.remainingWallsCount,
      opponentWallsCount: game.currentOpponent.remainingWallsCount,
    });
    return new Promise(resolve => {
      const playerActionHandler = (position: Point, direction?: Direction) => {
        if (
          position === game.currentPlayer.currentPosition ||
          position === game.currentOpponent.currentPosition
        ) {
          return;
        }
        if (direction) {
          if (!game.currentPlayer.remainingWallsCount) {
            return;
          }

          const newWall = Wall.create(position, direction);
          if (game.canPlaceWall(newWall)) {
            resolve(Commands.placeWall(newWall));
          } else {
            return;
          }
        } else {
          if (!game.allowedNodesToMove().includes(game.getNode(position))) {
            return;
          }
          resolve(Commands.moveToNode(game.getNode(position)));
        }
        emitter.off(eventTypes.PLAYER_ACTION, playerActionHandler);
      };

      emitter.on(eventTypes.PLAYER_ACTION, playerActionHandler);
    });
  }
}
