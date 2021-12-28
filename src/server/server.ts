import {Server, WebSocket} from 'ws';

type MessageType = 'connect' | 'wall' | 'move' | 'error';
type MessageHandler<T> = (body: T, client: WebSocket) => void;

interface Message<T> {
  type: MessageType;
  body: T;
}

const send = (ws: WebSocket, body: unknown) => {
  ws.send(JSON.stringify(body));
};

const connections: Array<{connection: WebSocket}> = [];
const handlers: Map<MessageType, MessageHandler<unknown>> = new Map();

handlers.set('wall', (msg, client) => {
  send(client, {type: 'move', body: 'A1'});
});

const options = {port: 8080};
const wss = new Server(options);
console.log(`Start server on port: ${options.port}`);
wss.on('connection', ws => {
  connections.push({connection: ws});
  ws.on('message', msg => {
    try {
      const body = JSON.parse(
        msg as unknown as string
      ) as unknown as Message<unknown>;
      const handler = handlers.get(body.type);
      if (!handler) {
        send(ws, {type: 'error', body: 'Wrong message type'});
        return;
      }
      handler(body, ws);
    } catch (e: any) {
      console.log(`Error: ${e.message}`);
      send(ws, JSON.stringify({type: 'error', body: e.message}));
    }
  });
});
