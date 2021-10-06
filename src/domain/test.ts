import {GameClient} from './client';
import {WebListener} from '../web/webListener';
import {GameFacade} from './game-facade';
import {BotListener} from '../bot/botListener';

export const startGame = () => {
  const player1 = new GameClient('1', new WebListener());
  const player2 = new GameClient('2', new BotListener());

  GameFacade.start(player1, player2);
};
