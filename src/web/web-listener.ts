import {PlayersId} from './enums/players-id';
import {setWallsNumbers} from './helpers/set-walls-numbers';
import {emitter, eventTypes} from './emitter';
import {GameView} from '../domain/core/game';
import {PlayerGameResult} from '../domain/game-facade';
import {Command, Commands} from '../domain/command';
import {Direction, Point} from '../domain/core/point';
import {Wall} from '../domain/core/wall';
import {renderBoard} from './index';
import {GameListener} from '../domain/client';
import {showWinner, showWinnerForTwoPlayers} from './results-modal';

export abstract class WebListener implements GameListener {
  constructor(public id: PlayersId) {}

  onSessionOver() {}

  onGameStart(game: GameView): Promise<void> {
    renderBoard(
      game.currentPlayer.currentPosition.column,
      game.currentPlayer.currentPosition.row,
      game.currentOpponent.currentPosition.column,
      game.currentOpponent.currentPosition.row,
      game.placedWalls,
      game.allowedNodesToMove(),
      this.id
    );
    return Promise.resolve();
  }

  abstract onGameOver(result: PlayerGameResult): Promise<void>;

  onNextStep(game: GameView): Promise<Command> {
    renderBoard(
      game.players[0].currentPosition.column,
      game.players[0].currentPosition.row,
      game.players[1].currentPosition.column,
      game.players[1].currentPosition.row,
      game.placedWalls,
      game.allowedNodesToMove(),
      this.id
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

export class SinglePlayerWebListener extends WebListener {
  async onGameOver(result: PlayerGameResult): Promise<void> {
    await showWinner(result);
  }
}

export class TwoPlayersWebListener extends WebListener {
  async onGameOver(result: PlayerGameResult): Promise<void> {
    if (result === PlayerGameResult.Victory) {
      await showWinnerForTwoPlayers(this.id);
    }
  }
}
