import {PlayerGameResult} from '../domain/game-facade';
import {showModal, createModalBody, hideModal} from './modal';
import {ResultModalWindowTitles} from './enums/modalWindowTitles';
import {ResultImagesPath} from './enums/resultImagesPath';

const getResultHTML = (imagePath: string) => `
<div class="result-image-wrapper">
<img class="result-image" src="${imagePath}" alt="">
<button class="modal-button" id="restart-button">Restart</button>
</div>
`;

export const showWinner = (result: PlayerGameResult) => {
  showModal({
    title: ResultModalWindowTitles[result],
    bodyElement: createModalBody(getResultHTML(ResultImagesPath[result])),
  });

  const restartButton = document.getElementById('restart-button');
  restartButton?.addEventListener('click', () => hideModal());
};
