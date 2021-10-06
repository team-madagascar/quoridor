import {showModal, createModalBody, hideModal} from './modal';
import {SelectModeModalWindowTitles} from './enums/modalWindowTitles';
import {playerTypes} from './enums/playerTypes';
import {wallsCountTitle} from './enums/wallsCountTitle';

const SELECT_MODE_HTML = `
<div class="select-mode">
<button class="modal-button" id="one-player-mode">1 player</button>
<button class="modal-button" id="two-players-mode">2 players</button>
</div>
`;

const opponentWallsCountNumber = <HTMLElement>(
  document.querySelector('.opponent-walls-count-number')
);
const playerWallsCountNumber = <HTMLElement>(
  document.querySelector('.player-walls-count-number')
);

const setWallsNumbers = ({
  playerWallsCount,
  opponentWallsCount,
}: {
  playerWallsCount: number;
  opponentWallsCount: number;
}) => {
  opponentWallsCountNumber.innerText = String(opponentWallsCount);
  playerWallsCountNumber.innerText = String(playerWallsCount);
};

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

export const showSelectMode = () => {
  showModal({
    title: SelectModeModalWindowTitles.SELECT_GAME_MODE,
    bodyElement: createModalBody(SELECT_MODE_HTML),
  });

  const onePlayerModeButton = document.getElementById('one-player-mode');
  const twoPlayersModeButton = document.getElementById('two-players-mode');

  onePlayerModeButton?.addEventListener('click', () => {
    initGame(playerTypes.COMPUTER);
    hideModal();
  });
  twoPlayersModeButton?.addEventListener('click', () => {
    initGame(playerTypes.OTHER_PLAYER);
    hideModal();
  });
};
