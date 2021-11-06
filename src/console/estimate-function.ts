import {GameView} from '../domain/core/game';

export const estimateFunction = (game: GameView) => {
  const currentPlayer = game.currentPlayer;
  const currentOpponent = game.currentOpponent;

  const currentPlayerPositionNode = game.getNode(currentPlayer.currentPosition);
  const opponentPositionNode = game.getNode(currentOpponent.currentPosition);

  const currentPlayerShortestDistance: number =
    currentPlayerPositionNode.shortestDistanceTo(
      n => currentPlayer.finishRow === n.position.row
    )?.currDistance as number;
  const opponentShortestDistance: number =
    opponentPositionNode.shortestDistanceTo(
      n => currentOpponent.finishRow === n.position.row
    )?.currDistance as number;

  const estimate = opponentShortestDistance - currentPlayerShortestDistance;

  return estimate;
};
