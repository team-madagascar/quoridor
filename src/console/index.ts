import {Game} from '../domain/core/game';
import {SmartBot} from './smart-bot';
import {KorotenkoBot} from './korotenko-bot';
import {KorotenkoAdapter} from './korotenko-adapter';

const game = new Game();
const adapter = new KorotenkoAdapter(game);
const bot = new SmartBot();
const korotenko = new KorotenkoBot();

const doStep = () => {
  const command = bot.doStep(game);
  const korotenkoCommand = adapter.toKorotenkoCommand(command);
  korotenko.sendCommand(korotenkoCommand);
};

const processKorotenkoBotStep = (data: string) => {
  const command = adapter.fromKorotenkoCommand(data);
  command.invoke(game);
};

korotenko.setListener(data => {
  if (data === 'white') {
    doStep();
    return;
  }
  if (data === 'black') {
    return;
  }
  processKorotenkoBotStep(data);
});
