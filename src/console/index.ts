import {Game} from '../domain/core/game';
import {SmartBot} from './smart-bot';
import {KorotenkoBot} from './korotenko-bot';
import {KorotenkoAdapter} from './korotenko-adapter';
import {LOGGER} from './logger';

LOGGER.isActive = false;
LOGGER.clearSavedLog();

const game = new Game();
const adapter = new KorotenkoAdapter(game);
let bot: SmartBot | undefined = undefined;

const korotenko = new KorotenkoBot();

const doStep = () => {
  if (bot === undefined) {
    bot = new SmartBot(game);
  }
  const command = bot.doStep(game);
  const korotenkoCommand = adapter.toKorotenkoCommand(command);
  command.invoke(game);
  LOGGER.info('BOT COMMAND: ' + command.toString());
  korotenko.sendCommand(korotenkoCommand);
  LOGGER.info('OUTPUT: ' + korotenkoCommand);
};

const applyKorotenkoBotStep = (data: string) => {
  const command = adapter.fromKorotenkoCommand(data);
  command.invoke(game);
  LOGGER.info('KOROTENKO COMMAND: ' + command.toString());
};

korotenko.setListener(input => {
  LOGGER.info('INPUT: ' + input);
  try {
    if (game.isGameOver()) {
      return;
    }
    switch (input) {
      case 'white': {
        doStep();
        break;
      }
      case 'black': {
        break;
      }
      default: {
        applyKorotenkoBotStep(input);
        doStep();
      }
    }
  } catch (e) {
    LOGGER.info('Error: ');
    LOGGER.info(e);
  } finally {
    if (game.isGameOver()) {
      LOGGER.info('Game is over');
      LOGGER.info('Winner: ' + game.winner.id);
      // eslint-disable-next-line no-process-exit
      process.exit(200);
    }
    LOGGER.persist();
  }
});
