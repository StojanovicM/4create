import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Query } from '@datorama/akita';
import { SessionState, SessionStore } from '../session.store';
import { ModalComponent } from "../modal/modal.component";
import { UserService } from "../services/user.service";
import { User } from "../interfaces";


@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends Query<SessionState> {

  users$ = this.userService.getUsers()
  disableAddUser$ = this.userService.addingUserDisabled()
  displayedColumns: string[] = ['id', 'name', 'active'];

  constructor(
    protected override store: SessionStore,
    public dialog: MatDialog,
    private userService: UserService ) {
    super(store);
  }

  openModal = () => {
    this.dialog.open(ModalComponent, { 
      width: '50%'
    })
  }

  updateUser = (isActive:boolean, user: User) => {
    this.userService.updateUserActiveState(user.id, isActive)
  }
}
