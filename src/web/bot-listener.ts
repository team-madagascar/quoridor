import {GameListener} from '../domain/client';
import {RandomBot} from '../bot/random-bot';
import {GameView} from '../domain/core/game';
import {Command} from '../domain/command';
import {SmartBot} from '../bot/smart-bot';

export class BotListener implements GameListener {
  private bot: SmartBot | null = null;

  constructor(public id: string) {}

  onSessionOver() {}

  onGameStart(game: GameView): Promise<void> {
    this.bot = new SmartBot(game);
    return Promise.resolve();
  }

  async onGameOver(): Promise<void> {
    this.bot = null;
  }

  async onNextStep(game: GameView): Promise<Command> {
    return this.bot!.doStep();
  }
}
