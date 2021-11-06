import {Game} from '../domain/core/game';
import {SmartBot} from './smart-bot';
import {KorotenkoBot} from './korotenko-bot';
import {KorotenkoAdapter} from './korotenko-adapter';
import {LOGGER} from './logger';

LOGGER.clearSavedLog();

const game = new Game();
const adapter = new KorotenkoAdapter(game);
const bot = new SmartBot();

const korotenko = new KorotenkoBot();

const doStep = () => {
  try {
    const command = bot.doStep(game);
    LOGGER.info('BOT COMMAND: ' + command.toString());
    const korotenkoCommand = adapter.toKorotenkoCommand(command);
    korotenko.sendCommand(korotenkoCommand);
    LOGGER.info('OUTPUT: ' + korotenkoCommand);
  } catch (e) {
    LOGGER.info('Output error');
    LOGGER.info(e);
  }
};

const applyKorotenkoBotStep = (data: string) => {
  try {
    const command = adapter.fromKorotenkoCommand(data);
    command.invoke(game);
    LOGGER.info('KOROTENKO COMMAND: ' + command.toString());
  } catch (e) {
    LOGGER.info('Input error');
    LOGGER.info(e);
  }
};

korotenko.setListener(input => {
  LOGGER.info('INPUT: ' + input);
  if (input === 'white') {
    doStep();
  } else {
    applyKorotenkoBotStep(input);
    doStep();
  }
  LOGGER.persist();
});
