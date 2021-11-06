import {Game} from '../domain/core/game';
import {SmartBot} from './smart-bot';
import {KorotenkoBot} from './korotenko-bot';
import {KorotenkoAdapter} from './korotenko-adapter';
import {LOGGER} from './logger';

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
  LOGGER.info('BOT COMMAND: ' + command.toString());
  const korotenkoCommand = adapter.toKorotenkoCommand(command);
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
    LOGGER.persist();
  }
});
