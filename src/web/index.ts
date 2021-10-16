import {playerTypes} from './enums/playerTypes';
import {startGame} from './../domain/test';
import {emitter, eventTypes} from './emitter';
import {Point} from '../domain/core/point';
import {Direction} from '../domain/core/point';
import {showSelectMode} from './selectModeModal';
import {Wall} from '../domain/core/wall';

const rows = 17;
const columns = 17;
const board: Array<Array<Cell>> = [];

class Cell {
  column: number;
  row: number;
  value: number;
  node: boolean;
  wallv: boolean;
  wallh: boolean;

  constructor(
    column: number,
    row: number,
    value: number,
    node: boolean,
    wallv: boolean,
    wallh: boolean
  ) {
    this.column = column;
    this.row = row;
    this.value = value;
    this.node = node;
    this.wallv = wallv;
    this.wallh = wallh;
  }
}

export const renderBoard = (
  column1: number,
  row1: number,
  column2: number,
  row2: number,
  walls: ReadonlyArray<Wall> = [],
  currentPlayerIndex: number
) => {
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < columns; c++) {
      if (r % 2 === 0 && c % 2 !== 0)
        board[r].push(new Cell(c, r, 0, false, true, false));
      else if (r % 2 !== 0 && c % 2 === 0)
        board[r].push(new Cell(c, r, 0, false, false, true));
      else if (r % 2 === 0 && c % 2 === 0)
        board[r].push(new Cell(c, r, 0, true, false, false));
      else board[r].push(new Cell(c, r, 0, false, false, false));
    }
  }

  board[row1][column1].value = 1;
  board[row2][column2].value = 2;

  const gameContainer = document.getElementById('game_container');
  gameContainer!.innerHTML = '';

  let content = '';
  for (let r = 0; r < rows; r++) {
    content += '<div class="row">';
    for (let c = 0; c < columns; c++) {
      const cell = board[r][c];

      let addСlass = '';
      let addPlayer = '';
      if (cell.value === 1) addPlayer = 'player1';
      if (cell.value === 2) addPlayer = 'player2';
      if (cell.value === currentPlayerIndex) addPlayer += ' current-player';
      if (cell.node) addСlass = 'node';
      if (cell.wallh) addСlass = 'wallh';
      if (cell.wallv) addСlass = 'wallv';

      if (c % 2 !== 0 && r % 2 !== 0) {
        content += `<div class='cell ${addСlass}' id='cell11' data-column='${c}'
        data-row='${r}'></div>`;
      } else if (c % 2 === 0 && r % 2 !== 0) {
        content += `<div class='cell ${addСlass}' id='cell01' data-column='${c}'
        data-row='${r}'></div>`;
      } else if (c % 2 !== 0 && r % 2 === 0) {
        content += `<div class='cell ${addСlass}' id='cell10' data-column='${c}'
        data-row='${r}'></div>`;
      } else if (c % 2 === 0 && r % 2 === 0) {
        content += `<div class='cell ${addСlass} ${addPlayer}' id='cell' data-column='${c}'
        data-row='${r}'></div>`;
      }
    }
    content += '</div>';
  }
  gameContainer!.innerHTML = content;

  walls.forEach(wall => {
    for (const point of wall.points) {
      const wallPartColumn = point.column;
      const wallPartRow = point.row;
      const wallPart = document.querySelector(
        `.cell[data-column='${wallPartColumn}'][data-row='${wallPartRow}']`
      );

      wallPart?.classList.add('set');
    }
  });
};

document.querySelector('.restart-button')?.addEventListener('click', () => {});

document.getElementById('game_container')?.addEventListener('click', e => {
  const target: HTMLElement = e.target as HTMLElement;
  const options: Array<HTMLElement> = [];
  let direction;
  const column = +(target.getAttribute('data-column') as string);
  const row = +(target.getAttribute('data-row') as string);

  const column1 = column - 1;
  const column2 = column + 1;
  const column3 = column - 2;
  const column4 = column + 2;
  const row1 = row - 1;
  const row2 = row + 1;
  const row3 = row - 2;
  const row4 = row + 2;

  let wall1;
  let wall2;
  let wall3;
  let wall4;

  if (
    target.classList.contains('player1') ||
    target.classList.contains('player2')
  ) {
    if (row1 > -1) {
      wall1 = document.querySelector(
        `.cell[data-column='${column}'][data-row='${row1}']`
      );
    }
    if (row2 < 17) {
      wall2 = document.querySelector(
        `.cell[data-column='${column}'][data-row='${row2}']`
      );
    }
    if (column1 > -1) {
      wall3 = document.querySelector(
        `.cell[data-column='${column1}'][data-row='${row}']`
      );
    }
    if (column2 < 17) {
      wall4 = document.querySelector(
        `.cell[data-column='${column2}'][data-row='${row}']`
      );
    }

    if (row3 > -1 && wall1 && !wall1?.classList.contains('set'))
      options.push(
        document.querySelector(
          `.cell[data-column='${column}'][data-row='${row3}']`
        ) as HTMLElement
      );
    if (row4 < 17 && wall2 && !wall2?.classList.contains('set'))
      options.push(
        document.querySelector(
          `.cell[data-column='${column}'][data-row='${row4}']`
        ) as HTMLElement
      );
    if (column3 > -1 && wall3 && !wall3?.classList.contains('set'))
      options.push(
        document.querySelector(
          `.cell[data-column='${column3}'][data-row='${row}']`
        ) as HTMLElement
      );
    if (column4 < 17 && wall4 && !wall4?.classList.contains('set'))
      options.push(
        document.querySelector(
          `.cell[data-column='${column4}'][data-row='${row}']`
        ) as HTMLElement
      );

    for (let i = 0; i < options.length; i++) {
      if (
        !options[i].classList.contains('player1') &&
        !options[i].classList.contains('player2')
      ) {
        options[i].style.backgroundColor === 'rgb(0, 0, 128)'
          ? (options[i].style.backgroundColor = '#1c1cf0')
          : (options[i].style.backgroundColor = '#000080');
      }
    }
    emitter.emit(
      eventTypes.PLAYER_ACTION,
      Point.create(row, column),
      direction
    );
  } else if (target.classList.contains('wallv')) {
    direction = Direction.Down;
    emitter.emit(
      eventTypes.PLAYER_ACTION,
      Point.create(row, column),
      direction
    );
  } else if (target.classList.contains('wallh')) {
    direction = Direction.Right;
    emitter.emit(
      eventTypes.PLAYER_ACTION,
      Point.create(row, column),
      direction
    );
  } else if (target.classList.contains('node')) {
    emitter.emit(
      eventTypes.PLAYER_ACTION,
      Point.create(row, column),
      direction
    );
  }
});

document.getElementById('game_container')?.addEventListener('mouseover', e => {
  const target: HTMLElement = e.target as HTMLElement;
  const column = +(target.getAttribute('data-column') as string);
  const row = +(target.getAttribute('data-row') as string);
  const row1 = row + 1;
  const row2 = row + 2;
  const column1 = column + 1;
  const column2 = column + 2;

  const p1 = document.querySelector(
    `.cell[data-column='${column}'][data-row='${row1}']`
  ) as HTMLElement;
  const p2 = document.querySelector(
    `.cell[data-column='${column}'][data-row='${row2}']`
  ) as HTMLElement;
  const p3 = document.querySelector(
    `.cell[data-column='${column1}'][data-row='${row}']`
  ) as HTMLElement;
  const p4 = document.querySelector(
    `.cell[data-column='${column2}'][data-row='${row}']`
  ) as HTMLElement;

  if (
    target.classList.contains('wallv') &&
    row !== 16 &&
    !target.classList.contains('set') &&
    !p1.classList.contains('set') &&
    !p2.classList.contains('set')
  ) {
    target.style.backgroundColor = '#000080';
    p1.style.backgroundColor = '#000080';
    p2.style.backgroundColor = '#000080';
  } else if (
    target.classList.contains('wallh') &&
    column !== 16 &&
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

  const column = +(target.getAttribute('data-column') as string);
  const row = +(target.getAttribute('data-row') as string);
  const row1 = row + 1;
  const row2 = row + 2;
  const column1 = column + 1;
  const column2 = column + 2;

  const p1 = document.querySelector(
    `.cell[data-column='${column}'][data-row='${row1}']`
  ) as HTMLElement;
  const p2 = document.querySelector(
    `.cell[data-column='${column}'][data-row='${row2}']`
  ) as HTMLElement;
  const p3 = document.querySelector(
    `.cell[data-column='${column1}'][data-row='${row}']`
  ) as HTMLElement;
  const p4 = document.querySelector(
    `.cell[data-column='${column2}'][data-row='${row}']`
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

showSelectMode().then((opponent: playerTypes) => {
  startGame(opponent);
});
