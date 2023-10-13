import { Component, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from "../services/user.service";
import { Subject, takeUntil } from "rxjs";
import { UniqueUserValidator } from "../validators/unique-user.validator";

@Component({
  selector: 'add-user-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.scss'],
})
export class ModalComponent implements OnDestroy {
  
  componentIsActive = new Subject();

  constructor(
    private dialogRef: MatDialogRef<ModalComponent>,
    private userService: UserService,
    private uniqueUserValidator: UniqueUserValidator
  ) { }

  userForm = new FormGroup({
    name: new FormControl('', {
      validators: Validators.required,
      asyncValidators: [this.uniqueUserValidator.validatorFunction]
    }),
    active: new FormControl(false)
  })

  onSubmit = () =>
    this.userService
      .addUser({
        name: this.userForm.controls.name.value as string,
        active: this.userForm.controls.active.value as boolean
      })
      .pipe(takeUntil(this.componentIsActive))
      .subscribe(() => this.onCancel())

  onCancel = () => this.dialogRef.close();

  getUserFormErrorMessage = (errors: ValidationErrors, fieldName: string) => {
    if (errors['nonUniqueUser']) { return `${fieldName} is not unique` }
    else if (errors['required']) { return `${fieldName} is required` }
    else { return 'Unknown error' }
  }

  ngOnDestroy(): void {
    this.componentIsActive.next(true);
    this.componentIsActive.complete();
  }
}