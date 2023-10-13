import { Store, StoreConfig } from '@datorama/akita';
import { User } from './interfaces'
import { Injectable } from '@angular/core';

export interface SessionState {
   users: User[]
}

export function createInitialState(): SessionState {
  return {
    users: [
      { id: 1, name: 'Homer Simpson', active: true },
      { id: 2, name: 'Peter Griffin', active: true },
      { id: 3, name: 'Bugs Bunny', active: true }
    ]
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {
  constructor() {
    super(createInitialState());
  }
}
