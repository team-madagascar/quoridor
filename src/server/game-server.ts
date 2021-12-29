import {Server, WebSocket, WebSocketServer} from 'ws';

export type MessageType = 'connect' | 'step' | 'error' | 'opponent-step';
export type MessageHandler<T> = (body: T, client: WebSocket) => void;

export interface Message<T> {
  type: MessageType;
  body: T;
}

export const send = (ws: WebSocket, body: unknown) => {
  const data = JSON.stringify(body);
  ws.send(data);
  console.log(`Send Message: ${data}`);
};

export class GameServer {
  private server: WebSocketServer;
  private handlers: Map<MessageType, MessageHandler<unknown>> = new Map();

  constructor(port: number) {
    const options = {port};
    this.server = new Server(options);
    this.initConnectionHandler();
    console.log(`Start server on port: ${options.port}`);
  }

  private initConnectionHandler() {
    this.server.on('connection', ws => {
      ws.on('message', msg => {
        try {
          console.log('Obtain Message: ' + msg);
          const message = JSON.parse(
            msg as unknown as string
          ) as unknown as Message<unknown>;
          const handler = this.handlers.get(message.type);
          if (!handler) {
            send(ws, {
              type: 'error',
              body: `Wrong message type: ${message.type}`,
            });
            return;
          }
          handler(message.body, ws);
        } catch (e: any) {
          console.log(`Error: ${e.message}`);
          send(ws, JSON.stringify({type: 'error', body: e.message}));
        }
      });
    });
  }

  addHandler<T>(type: MessageType, handler: MessageHandler<T>) {
    this.handlers.set(type, handler);
  }
}
