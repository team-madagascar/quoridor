import {emitter, PLAYER_ACTION_EVENT} from './emitter';
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
      game.currentOpponent.currentPosition.row
    );
    return new Promise(resolve => {
      const playerActionHandler = (position: Point, direction?: Direction) => {
        if (direction) {
          resolve(Commands.placeWall(Wall.create(position, direction)));
        } else {
          if (!game.allowedNodesToMove().includes(game.getNode(position))) {
            return;
          }
          resolve(Commands.moveToNode(game.getNode(position)));
        }
        emitter.off(PLAYER_ACTION_EVENT, playerActionHandler);
      };

      emitter.on(PLAYER_ACTION_EVENT, playerActionHandler);
    });
  }
}
