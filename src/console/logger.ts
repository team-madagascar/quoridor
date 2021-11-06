import * as fs from 'fs';

const STAGE_DELIMITER = '\n\n';

class Logger {
  static readonly LOG_PATH = 'game-log.txt';

  private logs: string[] = [];

  info(msg: string) {
    this.logs.push(msg);
    // try {
    //   fs.appendFileSync(Logger.LOG_PATH, msg + '\n');
    // } catch (e) {
    //   console.log('Log: append error');
    //   console.log(e);
    // }
  }

  clearSavedLog() {
    try {
      fs.writeFileSync(Logger.LOG_PATH, '');
    } catch (e) {
      console.log('Log: clear error');
      console.log(e);
    }
  }

  persist() {
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
