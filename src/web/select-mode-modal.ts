import {emitter, eventTypes} from './emitter';
import {showModal, createModalBody, hideModal} from './modal';
import {SelectModeModalWindowTitles} from './enums/modal-window-titles';
import {PlayerTypes} from './enums/player-types';
import {wallsCountTitle} from './enums/walls-count-title';
import {setWallsNumbers} from './helpers/set-walls-numbers';

const SELECT_MODE_HTML = `
<div class="select-mode">
<button class="modal-button" id="one-player-mode">Player vs Bot</button>
<button class="modal-button" id="two-players-mode">PVP offline</button>
<button class="modal-button" id="online-players-mode">PVP online</button>
</div>
`;

const initGame = (opponent: PlayerTypes) => {
  const opponentWallsCountTitleText = <HTMLElement>(
    document.querySelector('.opponent-walls-count-text')
  );
  const playerWallsCountTitleText = <HTMLElement>(
    document.querySelector('.player-walls-count-text')
  );
  opponentWallsCountTitleText.innerText = wallsCountTitle[opponent];
  playerWallsCountTitleText.innerText =
    wallsCountTitle[PlayerTypes.CURRENT_PLAYER];
  setWallsNumbers({playerWallsCount: 10, opponentWallsCount: 10});
};

export const showSelectMode = (): Promise<PlayerTypes> => {
  showModal({
    title: SelectModeModalWindowTitles.SELECT_GAME_MODE,
    bodyElement: createModalBody(SELECT_MODE_HTML),
  });

  const onePlayerModeButton = document.getElementById('one-player-mode');
  const twoPlayersModeButton = document.getElementById('two-players-mode');
  const onlineModeButton = document.getElementById('online-players-mode');

  const ButtonIdToGameTypes: Record<string, PlayerTypes> = {
    ['one-player-mode']: PlayerTypes.COMPUTER,
    ['two-players-mode']: PlayerTypes.OTHER_PLAYER,
    ['online-players-mode']: PlayerTypes.ONLINE,
  };

  onePlayerModeButton?.addEventListener('click', e => {
    emitter.emit(eventTypes.START_GAME, e);
  });
  twoPlayersModeButton?.addEventListener('click', e => {
    emitter.emit(eventTypes.START_GAME, e);
  });
  onlineModeButton?.addEventListener('click', e => {
    emitter.emit(eventTypes.START_GAME, e);
  });

  return new Promise(resolve => {
    const selectModeHandler = (event: Event) => {
      const clickedButtonId = (event.target as HTMLElement).id;
      const gameType: PlayerTypes = ButtonIdToGameTypes[clickedButtonId];
      initGame(gameType);
      hideModal();
      emitter.off(eventTypes.START_GAME, selectModeHandler);
      resolve(gameType);
    };
    emitter.on(eventTypes.START_GAME, selectModeHandler);
  });
};
