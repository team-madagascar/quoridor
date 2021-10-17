import {showSelectMode} from './select-mode-modal';
import {PlayerTypes} from './enums/player-types';
import {
  SinglePlayerWebListener,
  TwoPlayersWebListener,
  WebListener,
} from './web-listener';
import {BotListener} from '../bot/bot-listener';
import {GameFacade} from '../domain/game-facade';
import {GameClient} from '../domain/client';

export async function startGame() {
  const opponent = await showSelectMode();
  let listener1;
  let listener2;
  switch (opponent) {
    case PlayerTypes.COMPUTER:
      listener1 = new SinglePlayerWebListener();
      listener2 = new BotListener();
      break;
    case PlayerTypes.OTHER_PLAYER:
      listener1 = new TwoPlayersWebListener();
      listener2 = new TwoPlayersWebListener();
      break;
  }
  await GameFacade.start(
    new GameClient('1', listener1 as WebListener),
    new GameClient('2', listener2 as WebListener)
  );
}
