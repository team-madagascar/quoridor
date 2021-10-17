import {PlayerGameResult} from '../../domain/game-facade';

export const ResultImagesPath: Record<PlayerGameResult, string> = {
  [PlayerGameResult.Victory]: './img/win.png',
  [PlayerGameResult.Defeat]: './img/pngwing.com.png',
};
