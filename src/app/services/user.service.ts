import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SessionState, SessionStore } from '../session.store';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService extends Query<SessionState> {

  users$ = this.select(state => state.users);

  constructor(protected override store: SessionStore) {
    super(store);
  }

  getUsers = () => this.users$;

  addUser = (values: { name: string, active: boolean }) => {
    const users = this.getValue().users;

    this.store.update({
      users: [
        ...users,
        {
          id: users.length + 1,
          name: values.name,
          active: values.active,
        }
      ]
    })

    return of(true);
  }

  updateUserActiveState = (id: number, active: boolean) => {
    const users = structuredClone(this.getValue().users).map(user => {
      if (user.id === id) user.active = active;
      return user;
    });

    this.store.update({
      users: [...users]
    });
  }

  addingUserDisabled = () =>
    this.users$.pipe(map(users => users.length > 4 || !users.every(u => u.active)));
}