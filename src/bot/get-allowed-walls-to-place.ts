import {Wall} from '../domain/core/wall';
import {GameView} from '../domain/core/game';
import {Directions, Point} from '../domain/core/point';

export const getAllowedWallsToPlace = (game: GameView): Wall | null => {
  const currentOpponent = game.currentOpponent;
  let currentNode = game.getNode(currentOpponent.currentPosition);

  const opponentShortestPath = currentNode.shortestPathTo(
    n => currentOpponent.finishRow === n.position.row
  )?.path;

  let nextNode = opponentShortestPath![0];
  const finalNode = opponentShortestPath![opponentShortestPath!.length - 1];

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
      const nextNodeIndex = opponentShortestPath!.indexOf(nextNode);
      if (nextNodeIndex < opponentShortestPath!.length - 1) {
        currentNode = nextNode;
        nextNode = opponentShortestPath![nextNodeIndex + 1];
        return tryPlaceWall();
      }
      return null;
    }
  };
  return tryPlaceWall();
};

const flat = <T>(arr: T[][]): T[] => ([] as T[]).concat(...arr);

export const getWallToPlace = (game: GameView): Wall[] => {
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
