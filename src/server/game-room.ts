import {WebSocket} from 'ws';
import {Game} from '../domain/core/game';
import {KorotenkoAdapter} from '../console/korotenko-adapter';
import {send} from './game-server';

export interface StepMessage {
  command: string;
}

export class GameRoom {
  private readonly players: WebSocket[];
  private currentPlayer: WebSocket;
  private game = new Game();
  private adapter = new KorotenkoAdapter(this.game);

  constructor(player1: WebSocket, player2: WebSocket) {
    this.players = [player1, player2];
    this.currentPlayer = player1;
    send(player1, {type: 'start', body: {playerNumber: 1}});
    send(player2, {type: 'start', body: {playerNumber: 2}});
  }

  handleStep(player: WebSocket, step: StepMessage) {
    if (player !== this.currentPlayer) {
      send(player, {type: 'error', body: 'Not your step'});
      return;
    }
    const command = this.adapter.fromKorotenkoCommand(step.command);
    command.invoke(this.game);
    send(this.getCurrentOpponent(), {
      type: 'step',
      body: {command: this.adapter.toKorotenkoCommand(command)},
    });
    this.changeCurrentPlayer();
  }

  private changeCurrentPlayer() {
    this.currentPlayer = this.getCurrentOpponent();
  }

  private getCurrentOpponent(): WebSocket {
    if (this.currentPlayer === this.players[0]) {
      return this.players[1];
    }
    return this.players[0];
  }
}
