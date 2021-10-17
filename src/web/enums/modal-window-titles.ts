import {PlayerGameResult} from '../../domain/game-facade';

export enum SelectModeModalWindowTitles {
  SELECT_GAME_MODE = 'Select the game mode',
}

export const ResultModalWindowTitles: Record<PlayerGameResult, string> = {
  [PlayerGameResult.Victory]: 'You are winner!',
  [PlayerGameResult.Defeat]: 'You lost',
};
