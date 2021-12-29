import {GameListener} from '../domain/client';
import {PlayerGameResult} from '../domain/game-facade';
import {GameView} from '../domain/core/game';
import {Command} from '../domain/command';
import {KorotenkoAdapter} from '../console/korotenko-adapter';
import {renderBoard} from './index';
import {WebClient} from './web-client';

export interface Deferred<T> extends Promise<T> {
  resolve(value: unknown): void;
  reject(reason?: never): void;
}

export function createDeferredPromise<T>(): Deferred<T> {
  let resolve;
  let reject;

  const promise = new Promise((thisResolve, thisReject) => {
    resolve = thisResolve;
    reject = thisReject;
  });

  return Object.assign(promise, {resolve, reject}) as unknown as Deferred<T>;
}

export interface StepMessage {
  command: string;
}

export class RemoteListener implements GameListener {
  private nextStepDeffered: Deferred<Command> = createDeferredPromise();
  private adapter: KorotenkoAdapter | null = null;

  constructor(public readonly id: string, private readonly client: WebClient) {
    client.addHandler<StepMessage>('step', body => {
      this.nextStepDeffered.resolve(
        this.adapter?.fromKorotenkoCommand(body.command)
      );
    });
  }

  async onOpponentStep(game: GameView, opponentStep: Command): Promise<void> {
    this.client.send({
      type: 'opponent-step',
      body: {command: this.adapter?.toKorotenkoCommand(opponentStep)},
    });
  }

  async onGameStart(game: GameView): Promise<void> {
    renderBoard(
      game.currentPlayer.currentPosition.column,
      game.currentPlayer.currentPosition.row,
      game.currentOpponent.currentPosition.column,
      game.currentOpponent.currentPosition.row,
      game.placedWalls,
      game.allowedNodesToMove(),
      Number(this.id)
    );
    this.adapter = new KorotenkoAdapter(game);
  }

  async onGameOver(result: PlayerGameResult): Promise<void> {}

  async onNextStep(
    game: GameView,
    opponentStep: Command | null
  ): Promise<Command> {
    renderBoard(
      game.currentPlayer.currentPosition.column,
      game.currentPlayer.currentPosition.row,
      game.currentOpponent.currentPosition.column,
      game.currentOpponent.currentPosition.row,
      game.placedWalls,
      game.allowedNodesToMove(),
      Number(this.id)
    );
    if (opponentStep !== null) {
      this.client.send({
        type: 'step',
        body: {command: this.adapter?.toKorotenkoCommand(opponentStep)},
      });
    }
    console.log('Wait remote player response');
    const result = await this.nextStepDeffered;
    this.nextStepDeffered = createDeferredPromise();
    return result;
  }
}
