import {PlayerGameResult} from '../domain/game-facade';
import {showModal, createModalBody, hideModal} from './modal';
import {
  ResultModalWindowTitles,
  ResultModalWindowTitlesForTwoPlayers,
} from './enums/modal-window-titles';
import {ResultImagesPath} from './enums/result-images-path';

const getResultHTML = (imagePath: string) => `
<div class="result-image-wrapper">
<img class="result-image" src="${imagePath}" alt="">
<button class="modal-button" id="restart-button">Restart</button>
</div>
`;

export const showWinner = async (result: PlayerGameResult) => {
  showModal({
    title: ResultModalWindowTitles[result],
    bodyElement: createModalBody(getResultHTML(ResultImagesPath[result])),
  });
  const restartButton = document.getElementById('restart-button')!;
  return new Promise<void>(resolve => {
    restartButton.addEventListener('click', () => {
      hideModal();
      resolve();
    });
  });
};

export const showWinnerForTwoPlayers = async (playerId: string) => {
  showModal({
    title: ResultModalWindowTitlesForTwoPlayers[playerId],
    bodyElement: createModalBody(
      getResultHTML(ResultImagesPath[PlayerGameResult.Victory])
    ),
  });
  const restartButton = document.getElementById('restart-button')!;
  return new Promise<void>(resolve => {
    restartButton.addEventListener('click', () => {
      hideModal();
      resolve();
    });
  });
};
