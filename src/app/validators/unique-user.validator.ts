import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, Validator } from "@angular/forms";
import { Query } from "@datorama/akita";
import { SessionState, SessionStore } from "../session.store";
import { debounceTime, map, switchMap, timer, first } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UniqueUserValidator extends Query<SessionState> implements Validator {
  users$ = this.select(state => state.users);

  constructor(protected override store: SessionStore) {
    super(store);
  }

  validatorFunction: AsyncValidatorFn = (control: AbstractControl) =>
    timer(3000)
      .pipe(debounceTime(1000))
      .pipe(
        switchMap(() =>
          this.users$
            .pipe(
              map(users => users.some(u => u.name.toLowerCase() === control.value.toLowerCase())),
              map(result => result ? { nonUniqueUser: true } : null),
              first()
            )
        )
      );


  validate = (control: AbstractControl) => this.validatorFunction(control)
}
