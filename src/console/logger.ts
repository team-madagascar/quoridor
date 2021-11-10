import * as fs from 'fs';

const STAGE_DELIMITER = '\n\n';

class Logger {
  static readonly LOG_PATH = 'game-log.txt';

  private logs: unknown[] = [];
  isActive = true;

  info(msg: unknown) {
    if (!this.isActive) {
      return;
    }
    this.logs.push(msg);
  }

  clearSavedLog() {
    if (!this.isActive) {
      return;
    }
    try {
      fs.writeFileSync(Logger.LOG_PATH, '');
    } catch (e) {
      console.log('Log: clear error');
      console.log(e);
    }
  }

  persist() {
    if (!this.isActive) {
      return;
    }
    if (this.logs.length === 0) {
      return;
    }
    const data = this.logs.join('\n') + STAGE_DELIMITER;
    this.logs = [];
    try {
      fs.appendFileSync(Logger.LOG_PATH, data);
    } catch (e) {
      console.log('Log: append error');
      console.log(e);
    }
  }
}

export const LOGGER = new Logger();
