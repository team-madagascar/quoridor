import {EventEmitter} from 'events';

export const emitter = new EventEmitter();

export const PLAYER_ACTION_EVENT = 'PLAYER_ACTION_EVENT';
export enum eventTypes {
  PLAYER_ACTION = 'PLAYER_ACTION',
  START_GAME = 'START_GAME',
}
