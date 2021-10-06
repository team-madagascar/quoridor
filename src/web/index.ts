import {startGame} from './../domain/test';
import {emitter, PLAYER_ACTION_EVENT} from './emitter';
import {Point} from '../domain/core/point';
import {Direction} from '../domain/core/point';

console.log('dhjjfjvjf');

const rows = 17;
const columns = 17;
const board: Array<Array<Cell>> = [];

class Cell {
  x: number;
  y: number;
  value: number;
  wallv: boolean;
  wallh: boolean;

  constructor(
    x: number,
    y: number,
    value: number,
    wallv: boolean,
    wallh: boolean
  ) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.wallv = wallv;
    this.wallh = wallh;
  }
}

export const renderBoard = (
  px1: number,
  py1: number,
  px2: number,
  py2: number
) => {
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < columns; c++) {
      if (r % 2 === 0 && c % 2 !== 0)
        board[r].push(new Cell(c, r, 0, true, false));
      else if (r % 2 !== 0 && c % 2 === 0)
        board[r].push(new Cell(c, r, 0, false, true));
      else board[r].push(new Cell(c, r, 0, false, false));
    }
  }

  board[px1][py1].value = 1;
  board[px2][py2].value = 2;

  const gameContainer = document.getElementById('game_container');
  gameContainer!.innerHTML = '';

  let content = '';
  for (let r = 0; r < rows; r++) {
    content += '<div class="row">';
    for (let c = 0; c < columns; c++) {
      const cell = board[r][c];

      let addСlass = '';
      if (cell.value === 1) addСlass = 'player1';
      if (cell.value === 2) addСlass = 'player2';
      if (cell.wallh) addСlass = 'wallh';
      if (cell.wallv) addСlass = 'wallv';

      if (c % 2 !== 0 && r % 2 !== 0) {
        content += `<div class='cell ${addСlass}' id='cell11' data-x='${c}'
        data-y='${r}'></div>`;
      } else if (c % 2 === 0 && r % 2 !== 0) {
        content += `<div class='cell ${addСlass}' id='cell01' data-x='${c}'
        data-y='${r}'></div>`;
      } else if (c % 2 !== 0 && r % 2 === 0) {
        content += `<div class='cell ${addСlass}' id='cell10' data-x='${c}'
        data-y='${r}'></div>`;
      } else {
        content += `<div class='cell ${addСlass}' id='cell' data-x='${c}'
        data-y='${r}'></div>`;
      }
    }
    content += '</div>';
  }
  gameContainer!.innerHTML = content;
};

document.getElementById('game_container')?.addEventListener('click', e => {
  const target: HTMLElement = e.target as HTMLElement;
  const options: Array<HTMLElement> = [];
  let direction;
  const x = +(target.getAttribute('data-x') as string);
  const y = +(target.getAttribute('data-y') as string);

  let x1;
  let ox1;
  let x2;
  let ox2;
  let x3;
  let y1;
  let oy1;
  let y2;
  let oy2;
  let y3;

  if (x > 0) x1 = x - 1;
  if (x < 16) x2 = x + 1;
  if (y > 0) y1 = y - 1;
  if (y < 16) y2 = y + 1;

  if (x > 1) ox1 = x - 2;
  if (x < 15) ox2 = x + 2;
  if (y > 1) oy1 = y - 2;
  if (y < 15) oy2 = y + 2;

  if (x < 14) x3 = x + 2;
  if (y < 14) y3 = y + 2;

  if (
    target.classList.contains('player1') ||
    target.classList.contains('player2')
  ) {
    const wall1 = document.querySelector(
      `.cell[data-x='${x}'][data-y='${y1}']`
    );
    const wall2 = document.querySelector(
      `.cell[data-x='${x}'][data-y='${y2}']`
    );
    const wall3 = document.querySelector(
      `.cell[data-x='${x1}'][data-y='${y}']`
    );
    const wall4 = document.querySelector(
      `.cell[data-x='${x2}'][data-y='${y}']`
    );

    if (!wall1?.classList.contains('set'))
      options.push(
        document.querySelector(
          `.cell[data-x='${x}'][data-y='${oy1}']`
        ) as HTMLElement
      );
    if (!wall2?.classList.contains('set'))
      options.push(
        document.querySelector(
          `.cell[data-x='${x}'][data-y='${oy2}']`
        ) as HTMLElement
      );
    if (!wall3?.classList.contains('set'))
      options.push(
        document.querySelector(
          `.cell[data-x='${ox1}'][data-y='${y}']`
        ) as HTMLElement
      );
    if (!wall4?.classList.contains('set'))
      options.push(
        document.querySelector(
          `.cell[data-x='${ox2}'][data-y='${y}']`
        ) as HTMLElement
      );

    for (let i = 0; i < options.length; i++) {
      options[i].style.backgroundColor === 'rgb(0, 0, 128)'
        ? (options[i].style.backgroundColor = '#1c1cf0')
        : (options[i].style.backgroundColor = '#000080');
    }
  } else if (target.classList.contains('wallv')) {
    direction = Direction.Down;
    target.classList.add('set');
    document
      .querySelector(`.cell[data-x='${x}'][data-y='${y2}']`)
      ?.classList.add('wallv');
    document
      .querySelector(`.cell[data-x='${x}'][data-y='${y2}']`)
      ?.classList.add('set');
    document
      .querySelector(`.cell[data-x='${x}'][data-y='${y3}']`)
      ?.classList.add('set');
  } else if (target.classList.contains('wallh')) {
    direction = Direction.Right;
    target.classList.add('set');
    document
      .querySelector(`.cell[data-x='${x2}'][data-y='${y}']`)
      ?.classList.add('wallh');
    document
      .querySelector(`.cell[data-x='${x2}'][data-y='${y}']`)
      ?.classList.add('set');
    document
      .querySelector(`.cell[data-x='${x3}'][data-y='${y}']`)
      ?.classList.add('set');
  }
  emitter.emit(PLAYER_ACTION_EVENT, Point.create(x, y), direction);
});

document.getElementById('game_container')?.addEventListener('mouseover', e => {
  const target: HTMLElement = e.target as HTMLElement;
  const x = +(target.getAttribute('data-x') as string);
  const y = +(target.getAttribute('data-y') as string);
  const y1 = y + 1;
  const y2 = y + 2;
  const x1 = x + 1;
  const x2 = x + 2;

  const p1 = document.querySelector(
    `.cell[data-x='${x}'][data-y='${y1}']`
  ) as HTMLElement;
  const p2 = document.querySelector(
    `.cell[data-x='${x}'][data-y='${y2}']`
  ) as HTMLElement;
  const p3 = document.querySelector(
    `.cell[data-x='${x1}'][data-y='${y}']`
  ) as HTMLElement;
  const p4 = document.querySelector(
    `.cell[data-x='${x2}'][data-y='${y}']`
  ) as HTMLElement;

  if (
    target.classList.contains('wallv') &&
    y !== 16 &&
    !target.classList.contains('set') &&
    !p1.classList.contains('set') &&
    !p2.classList.contains('set')
  ) {
    target.style.backgroundColor = '#000080';
    p1.style.backgroundColor = '#000080';
    p2.style.backgroundColor = '#000080';
  } else if (
    target.classList.contains('wallh') &&
    x !== 16 &&
    !target.classList.contains('set') &&
    !p3.classList.contains('set') &&
    !p4.classList.contains('set')
  ) {
    target.style.backgroundColor = '#000080';
    p3.style.backgroundColor = '#000080';
    p4.style.backgroundColor = '#000080';
  }
});

document.getElementById('game_container')?.addEventListener('mouseout', e => {
  const target = e.target as HTMLElement;

  const x = +(target.getAttribute('data-x') as string);
  const y = +(target.getAttribute('data-y') as string);
  const y1 = y + 1;
  const y2 = y + 2;
  const x1 = x + 1;
  const x2 = x + 2;

  const p1 = document.querySelector(
    `.cell[data-x='${x}'][data-y='${y1}']`
  ) as HTMLElement;
  const p2 = document.querySelector(
    `.cell[data-x='${x}'][data-y='${y2}']`
  ) as HTMLElement;
  const p3 = document.querySelector(
    `.cell[data-x='${x1}'][data-y='${y}']`
  ) as HTMLElement;
  const p4 = document.querySelector(
    `.cell[data-x='${x2}'][data-y='${y}']`
  ) as HTMLElement;
  if (
    target.classList.contains('wallv') &&
    !target.classList.contains('set') &&
    !p1.classList.contains('set') &&
    !p2.classList.contains('set')
  ) {
    target.style.backgroundColor = 'royalblue';
    p1.style.backgroundColor = 'royalblue';
    p2.style.backgroundColor = 'royalblue';
  } else if (
    target.classList.contains('wallh') &&
    !target.classList.contains('set') &&
    !p3.classList.contains('set') &&
    !p4.classList.contains('set')
  ) {
    target.style.backgroundColor = 'royalblue';
    p3.style.backgroundColor = 'royalblue';
    p4.style.backgroundColor = 'royalblue';
  }
});

startGame();
