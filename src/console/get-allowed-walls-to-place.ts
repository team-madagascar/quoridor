import {Wall} from './../domain/core/wall';
import {GameView} from '../domain/core/game';
import {Node} from '../domain/core/node';
import {Point} from '../domain/core/point';

export const getAllowedWallsToPlace = (game: GameView) => {
  const currentOpponent = game.currentOpponent;
  let currentNode = game.getNode(currentOpponent.currentPosition);

  const opponentShortestDistanceNodes: Array<Node> =
    currentNode.shortestDistanceTo(
      n => currentOpponent.finishRow === n.position.row
    )?.previousNodes as Array<Node>;

  let nextNode = opponentShortestDistanceNodes[0];
  const finalNode =
    opponentShortestDistanceNodes[opponentShortestDistanceNodes.length - 1];

  const tryPlaceWall = (): Wall | null => {
    const wallDirectionColumn =
      finalNode.position.column > currentNode.position.column ? 1 : -1;
    const wallDirectionRow =
      currentNode.position.row > finalNode.position.row ? -1 : 1;

    const newWallCenter = Point.create(
      currentNode.position.row + wallDirectionRow,
      currentNode.position.column + wallDirectionColumn
    );

    const newWall =
      nextNode.position.column === currentNode.position.column
        ? new Wall([
            Point.create(newWallCenter.row - 1, newWallCenter.column),
            newWallCenter,
            Point.create(newWallCenter.row + 1, newWallCenter.column),
          ])
        : new Wall([
            Point.create(newWallCenter.row, newWallCenter.column - 1),
            newWallCenter,
            Point.create(newWallCenter.row, newWallCenter.column + 1),
          ]);

    if (game.canPlaceWall(newWall)) {
      return newWall;
    } else {
      const nextNodeIndex = opponentShortestDistanceNodes.indexOf(nextNode);
      if (nextNodeIndex < opponentShortestDistanceNodes.length - 1) {
        currentNode = nextNode;
        nextNode = opponentShortestDistanceNodes[nextNodeIndex + 1];
        return tryPlaceWall();
      }
      return null;
    }
  };
};
