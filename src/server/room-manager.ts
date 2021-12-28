import {WebSocket} from 'ws';
import {GameRoom, StepMessage} from './game-room';

export class RoomManager {
  private readonly queue: WebSocket[] = [];
  private readonly rooms: Map<WebSocket, GameRoom> = new Map();

  addNewPlayer(client: WebSocket) {
    console.log('Add player to queue');
    this.queue.push(client);
    if (this.queue.length < 2) {
      return;
    }
    const player1 = this.queue.shift()!;
    const player2 = this.queue.shift()!;
    const room = new GameRoom(player1, player2);
    console.log('Create new room');
    this.rooms.set(player1, room);
    this.rooms.set(player2, room);
  }

  handleStep(client: WebSocket, step: StepMessage) {
    const room = this.rooms.get(client);
    if (room === null) {
      console.log('Error: Client has no room');
      return;
    }
    room.handleStep(client, step);
  }
}
