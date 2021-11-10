import {GameView} from '../domain/core/game';

export const estimateFunction = (game: GameView): number => {
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
  return opponentShortestDistance - playerShortestDistance;
};
