import {createInterface} from 'readline';

export class KorotenkoBot {
  private rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  sendCommand(data: string) {
    console.log(data);
  }

  setListener(listener: (data: string) => void) {
    this.rl.on('line', listener);
  }

  removeListener() {
    this.rl.removeAllListeners('line');
  }
}
