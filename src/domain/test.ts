import {playerTypes} from './../web/enums/playerTypes';
import {GameClient} from './client';
import {WebListener} from '../web/webListener';
import {GameFacade} from './game-facade';
import {BotListener} from '../bot/botListener';

export const startGame = (opponent: playerTypes) => {
  const player1 = new GameClient('1', new WebListener());
  const player2 = new GameClient(
    '2',
    opponent === playerTypes.COMPUTER ? new BotListener() : new WebListener()
  );

  GameFacade.start(player1, player2);
};
