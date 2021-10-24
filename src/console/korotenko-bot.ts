import {createInterface} from 'readline';

export class KorotenkoBot {
  private rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  sendCommand(data: string) {
    this.rl.write(data + '\n');
  }

  setListener(listener: (data: string) => void) {
    this.rl.on('line', listener);
  }
}
