import {showSelectMode} from './select-mode-modal';
import {PlayerTypes} from './enums/player-types';
import {
  SinglePlayerWebListener,
  TwoPlayersWebListener,
  WebListener,
} from './web-listener';
import {GameFacade} from '../domain/game-facade';
import {GameClient} from '../domain/client';
import {PlayersId} from './enums/players-id';
import {BotListener} from './bot-listener';

export async function startGame() {
  const opponent = await showSelectMode();
  let listener1;
  let listener2;
  switch (opponent) {
    case PlayerTypes.COMPUTER:
      listener1 = new SinglePlayerWebListener(PlayersId.Player1.toString());
      listener2 = new BotListener(PlayersId.Player2.toString());
      break;
    case PlayerTypes.OTHER_PLAYER:
      listener1 = new TwoPlayersWebListener(PlayersId.Player1.toString());
      listener2 = new TwoPlayersWebListener(PlayersId.Player2.toString());
      break;
  }
  await GameFacade.start(
    new GameClient(listener1 as WebListener),
    new GameClient(listener2 as WebListener)
  );
}
