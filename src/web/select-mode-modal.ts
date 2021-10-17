import {emitter, eventTypes} from './emitter';
import {showModal, createModalBody, hideModal} from './modal';
import {SelectModeModalWindowTitles} from './enums/modal-window-titles';
import {playerTypes} from './enums/player-types';
import {wallsCountTitle} from './enums/walls-count-title';
import {setWallsNumbers} from './helpers/set-walls-numbers';

const SELECT_MODE_HTML = `
<div class="select-mode">
<button class="modal-button" id="one-player-mode">1 player</button>
<button class="modal-button" id="two-players-mode">2 players</button>
</div>
`;

const initGame = (opponent: playerTypes) => {
  const opponentWallsCountTitleText = <HTMLElement>(
    document.querySelector('.opponent-walls-count-text')
  );
  const playerWallsCountTitleText = <HTMLElement>(
    document.querySelector('.player-walls-count-text')
  );
  opponentWallsCountTitleText.innerText = wallsCountTitle[opponent];
  playerWallsCountTitleText.innerText =
    wallsCountTitle[playerTypes.CURRENT_PLAYER];
  setWallsNumbers({playerWallsCount: 10, opponentWallsCount: 10});
};

export const showSelectMode = (): Promise<playerTypes> => {
  showModal({
    title: SelectModeModalWindowTitles.SELECT_GAME_MODE,
    bodyElement: createModalBody(SELECT_MODE_HTML),
  });

  const onePlayerModeButton = document.getElementById('one-player-mode');
  const twoPlayersModeButton = document.getElementById('two-players-mode');

  const ButtonIdToGameTypes: Record<string, playerTypes> = {
    ['one-player-mode']: playerTypes.COMPUTER,
    ['two-players-mode']: playerTypes.OTHER_PLAYER,
  };

  onePlayerModeButton?.addEventListener('click', e => {
    emitter.emit(eventTypes.START_GAME, e);
  });
  twoPlayersModeButton?.addEventListener('click', e => {
    emitter.emit(eventTypes.START_GAME, e);
  });

  return new Promise(resolve => {
    const selectModeHandler = (event: Event) => {
      const clickedButtonId = (event.target as HTMLElement).id;
      const gameType: playerTypes = ButtonIdToGameTypes[clickedButtonId];
      initGame(gameType);
      hideModal();
      emitter.off(eventTypes.START_GAME, selectModeHandler);
      resolve(gameType);
    };

    emitter.on(eventTypes.START_GAME, selectModeHandler);
  });
};
