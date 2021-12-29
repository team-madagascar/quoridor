import {createDeferredPromise} from './remote-listener';

interface Message<T> {
  type: string;
  body: T;
}

interface StartMessage {
  playerNumber: number;
}

type MessageHandler<T> = (body: T) => void;

export class WebClient {
  private connectToGameDeffered = createDeferredPromise<number>();
  private handlers: Map<string, MessageHandler<unknown>> = new Map();
  private constructor(public readonly ws: WebSocket) {
    this.messageHandler();
    this.startHandler();
  }

  private startHandler() {
    this.addHandler<StartMessage>('start', body => {
      this.connectToGameDeffered.resolve(body.playerNumber);
      this.connectToGameDeffered = createDeferredPromise();
    });
  }

  private messageHandler() {
    this.ws.addEventListener('message', ev => {
      try {
        console.log(`Message: ${ev.data}`);
        const msg = JSON.parse(ev.data) as Message<unknown>;
        const handler = this.handlers.get(msg.type);
        if (handler === null) {
          console.log(`Has no handler for: ${msg.type}`);
          return;
        }
        handler(msg.body);
      } catch (e: any) {
        console.log(`Error: ${e.message}`);
      }
    });
  }

  async connectToGame(): Promise<number> {
    this.send({type: 'connect', body: {}});
    return this.connectToGameDeffered;
  }

  static async create(url: string): Promise<WebClient> {
    const ws = new WebSocket(url);
    const promise = createDeferredPromise<{}>();
    ws.addEventListener('open', () => {
      console.log('Open WebSocket connection');
      promise.resolve({});
    });
    await promise;
    console.log('Create WebClient');
    return new WebClient(ws);
  }

  send(msg: unknown): void {
    console.log('Send message: ' + msg);
    this.ws.send(JSON.stringify(msg));
  }

  addHandler<T>(type: string, handler: MessageHandler<T>) {
    this.handlers.set(type, handler);
  }
}
