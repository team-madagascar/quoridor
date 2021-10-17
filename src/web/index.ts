import {playerTypes} from './enums/playerTypes';
import {emitter, eventTypes} from './emitter';
import {Direction, Point} from '../domain/core/point';
import {showSelectMode} from './selectModeModal';
import {Wall} from '../domain/core/wall';
import {Node} from '../domain/core/node';
import {GameClient} from '../domain/client';
import {WebListener} from './webListener';
import {BotListener} from '../bot/botListener';
import {GameFacade} from '../domain/game-facade';

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
  nodes: ReadonlyArray<Node> = [],
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

  nodes.forEach(node => {
    const optionColumn = node.position.column;
    const optionRow = node.position.row;
    const option = document.querySelector(
      `.cell[data-column='${optionColumn}'][data-row='${optionRow}']`
    );

    option?.classList.add('option');
  });
};

document.querySelector('.restart-button')?.addEventListener('click', () => {});

document.getElementById('game_container')?.addEventListener('click', e => {
  const target: HTMLElement = e.target as HTMLElement;
  let direction;
  const column = +(target.getAttribute('data-column') as string);
  const row = +(target.getAttribute('data-row') as string);

  if (target.classList.contains('current-player')) {
    const options = Array.from(
      document.getElementsByClassName('option') as HTMLCollectionOf<HTMLElement>
    );
    for (let i = 0; i < options.length; i++) {
      options[i].style.backgroundColor === 'rgb(0, 0, 128)'
        ? (options[i].style.backgroundColor = '#1c1cf0')
        : (options[i].style.backgroundColor = '#000080');
    }
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
    p1 &&
    p2 &&
    !target.classList.contains('set') &&
    !p1.classList.contains('set') &&
    !p2.classList.contains('set')
  ) {
    target.style.backgroundColor = '#000080';
    p1.style.backgroundColor = '#000080';
    p2.style.backgroundColor = '#000080';
  } else if (
    target.classList.contains('wallh') &&
    p3 &&
    p4 &&
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
    p1 &&
    p2 &&
    !p1.classList.contains('set') &&
    !p2.classList.contains('set')
  ) {
    target.style.backgroundColor = 'royalblue';
    p1.style.backgroundColor = 'royalblue';
    p2.style.backgroundColor = 'royalblue';
  } else if (
    target.classList.contains('wallh') &&
    !target.classList.contains('set') &&
    p3 &&
    p4 &&
    !p3.classList.contains('set') &&
    !p4.classList.contains('set')
  ) {
    target.style.backgroundColor = 'royalblue';
    p3.style.backgroundColor = 'royalblue';
    p4.style.backgroundColor = 'royalblue';
  }
});

showSelectMode().then((opponent: playerTypes) => {
  const player1 = new GameClient('1', new WebListener());
  const player2 = new GameClient(
    '2',
    opponent === playerTypes.COMPUTER ? new BotListener() : new WebListener()
  );

  GameFacade.start(player1, player2);
});
