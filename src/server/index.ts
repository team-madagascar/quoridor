import {GameServer} from './game-server';
import {RoomManager} from './room-manager';
import {StepMessage} from './game-room';

const server = new GameServer(8080);
const roomManager = new RoomManager();

server.addHandler<{}>('connect', (msg, client) => {
  roomManager.addNewPlayer(client);
});

server.addHandler<StepMessage>('step', (msg, client) => {
  roomManager.handleStep(client, msg);
});
