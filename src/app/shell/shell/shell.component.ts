import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem, MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';

import { Subscription } from 'rxjs';

import { TeachersService } from 'src/app/services/teachers.service';
import { StudentsService } from 'src/app/services/admin-students.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {

  items: MenuItem[];
  displaySidebar = false;
  userRoleLabel = this._authService.getRoleLocalizedName();
  logOutLabel = 'Вийти';
  editActiveUserLabel = 'Редагувати';
  userFullName: string;
  activeUser = {};
  private subscription: Subscription;


  constructor(
    private _authService: AuthenticationService,
    private messageService: MessageService,
    private notificationToasts: DataSharingService,
    private studentService: StudentsService,
    private teacherService: TeachersService,
    private router: Router) { }

  ngOnInit() {
    this.subscribeToNotifications();
    this.setUserFullName(this.userRoleLabel);
  }

  setUserFullName(userRole: string): void {
    if (userRole === 'Вчитель') {
      this.teacherService.getTeacherBy(this._authService.getCurrentUserId()).subscribe(teacher => {
        this.activeUser = teacher;
        this.userFullName = `${teacher.lastname} ${teacher.firstname} ${teacher.patronymic}`;
      });
    } else if (userRole === 'Користувач') {
      this.studentService.getStudent(this._authService.getCurrentUserId()).subscribe(student => {
        this.activeUser = student;
        this.userFullName = `${student.lastname} ${student.firstname} ${student.patronymic}`;
      });
    } else {
      this.userFullName = userRole;
    }
  }

  LogOut() {
    this._authService.logOut();
  }

  subscribeToNotifications() {
    this.subscription = this.notificationToasts
      .getToasts()
      .subscribe(notification => this.messageService.add(notification));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  homeButtonClicked() {
    this.router.navigate([this._authService.defaultRoute()]);
  }
  editActiveUser() {
    console.log('User edit btn pressed'); // TODO-->>>
  }

}
