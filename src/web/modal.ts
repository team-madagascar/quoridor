import {createElement} from './helpers/domHelper';

interface ModalParams {
  title: string;
  bodyElement: HTMLElement;
}

export const showModal = ({title, bodyElement}: ModalParams) => {
  const modalContainer = getModalContainer();
  const modal = createModal({title, bodyElement});

  modalContainer?.append(modal);
};

const getModalContainer = () => {
  return document.getElementById('modal');
};

const createModal = ({title, bodyElement}: ModalParams) => {
  const layer = createElement({tagName: 'div', className: 'modal-layer'});
  const modalContainer = createElement({
    tagName: 'div',
    className: 'modal-container',
  });
  const header = createHeader(title);

  modalContainer.append(header, bodyElement);
  layer.append(modalContainer);

  return layer;
};

const createHeader = (title: string) => {
  const headerElement = createElement({
    tagName: 'div',
    className: 'modal-header',
  });
  const titleElement = createElement({tagName: 'span'});

  titleElement.innerText = title;

  headerElement.append(titleElement);

  return headerElement;
};

export const hideModal = () => {
  const modal = document.getElementsByClassName('modal-layer')[0];
  if (modal) {
    modal.remove();
  }
};

export const createModalBody = (elementHTML: string) => {
  const modalBodyElement = createElement({
    tagName: 'div',
    className: 'modal-body-content-wrapper',
  });
  modalBodyElement.innerHTML = elementHTML;

  return modalBodyElement;
};
