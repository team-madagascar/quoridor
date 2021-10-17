import {PlayersId} from './players-id';
import {PlayerGameResult} from '../../domain/game-facade';

export enum SelectModeModalWindowTitles {
  SELECT_GAME_MODE = 'Select the game mode',
}

export const ResultModalWindowTitles: Record<PlayerGameResult, string> = {
  [PlayerGameResult.Victory]: 'You won!',
  [PlayerGameResult.Defeat]: 'You lost',
};

export const ResultModalWindowTitlesForTwoPlayers: Record<PlayersId, string> = {
  [PlayersId.Player1]: 'First player won!',
  [PlayersId.Player2]: 'Second player won!',
};
