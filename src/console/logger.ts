import * as fs from 'fs';

const STAGE_DELIMITER = '\n\n';

class Logger {
  static readonly LOG_PATH = 'game-log.txt';

  private logs: string[] = [];
  isActive = true;

  info(msg: string) {
    if (this.isActive) {
      this.logs.push(msg);
    }
  }

  clearSavedLog() {
    if (this.isActive) {
      try {
        fs.writeFileSync(Logger.LOG_PATH, '');
      } catch (e) {
        console.log('Log: clear error');
        console.log(e);
      }
    }
  }

  persist() {
    if (this.isActive) {
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
}

export const LOGGER = new Logger();
