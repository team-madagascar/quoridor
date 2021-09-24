/**
 *  Different players: local player(website), remote player, our bot, console bot
 */

interface PlayerView {}

interface Command {
  apply(game: Game): void;
}

interface GameFieldView {}

interface GameView {
  get player(): PlayerView;

  get opponent(): PlayerView;

  get field(): GameFieldView;
}

class MoveCommand {}

class PlaceWallCommand {}

interface Client {
  doStep(gameView: GameView): Promise<Command>;
}

class GameFacade {
  private _currentClient: Client;

  constructor(
    private readonly client1: Client,
    private readonly client2: Client
  ) {}

  async startGame() {
    while (!this.gameIsEnd()) {
      const command = await this._currentClient.doStep();
      command.apply();
      this.changeCurrentClient();
    }
  }

  private changeCurrentClient() {
    // todo
  }

  private gameIsEnd(): boolean {
    // todo
  }
}

class LocalClient {}

class RemoteClient {}

class BotClient {}

import {GameField} from '../domain/game-field';

class Position {
  constructor(readonly x: number, readonly y: number) {}
}

enum Orientation {
  Horizontal,
  Vertical,
}

class Wall {
  constructor(readonly orientation: Orientation, readonly position: Position) {}
}

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

class Player {
  private _currentPosition: Position;
  private _remainingWallsCount: number;

  constructor(currentPosition: Position, wallsCount: number) {
    this._remainingWallsCount = wallsCount;
    this._currentPosition = currentPosition;
  }

  get remainingWallsCount(): number {
    return this._remainingWallsCount;
  }

  get currentPosition(): Position {
    return this._currentPosition;
  }

  move(direction: Direction, distance: number) {}

  placeWall(wall: Wall) {}
}

class Game {
  private _currentPlayer: Player;
  constructor(
    private readonly field: GameField,
    readonly player1: Player,
    readonly player2: Player
  ) {
    this._currentPlayer = player1;
  }

  move(direction: Direction) {}

  placeWall(wall: Wall) {}
}
