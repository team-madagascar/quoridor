import {GameView} from '../domain/core/game';

export const estimateFunction = (game: GameView): number => {
  const currentPlayer = game.currentPlayer;
  const currentOpponent = game.currentOpponent;

  const playerNode = game.getNode(currentPlayer.currentPosition);
  const opponentNode = game.getNode(currentOpponent.currentPosition);

  const playerShortestDistance: number = playerNode.shortestPathTo(
    n => currentPlayer.finishRow === n.position.row
  )?.distance as number;
  const opponentShortestDistance: number = opponentNode.shortestPathTo(
    n => currentOpponent.finishRow === n.position.row
  )?.distance as number;

  return opponentShortestDistance - playerShortestDistance;
};