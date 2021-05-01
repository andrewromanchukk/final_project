import { Component, OnInit } from '@angular/core';
import { TeachersService } from '../../../services/teachers.service';
import { Iteachers } from 'src/app/models/teachers';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { ConfirmationService } from 'primeng/api';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PageTitleService } from '../../../services/pageTitle.service';
import { TeacherJournalsService } from '../../../services/teacher-journals.service';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
  providers: [PageTitleService]
})
export class TeachersComponent implements OnInit {
  loading: boolean;
  confirmCheck: boolean;
  displayDialog: boolean;
  teachers: Iteachers[];
  teacher: any;
  columns: Array<object>;
  newTeacher: boolean;
  selectedTeacher: Iteachers;
  ua: object;
  photoData: string;
  imageUrl: any = 'assets/avatar.png';
  fileToUpload: File = null;
  loginStatus: string;
  requestSubject$ = new Subject<any>();

  constructor(
    private _teacherServices: TeachersService,
    private notificationToasts: DataSharingService,
    private confirmationService: ConfirmationService,
    private pageTitle: PageTitleService,
    private teacherJournalService: TeacherJournalsService
  ) {}

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Вчителі');
    this.loading = true;
    this._teacherServices.getTeachers().subscribe(users => {
      this.teachers = users;
      this.loading = false;
      this.teachers.forEach((teacher: any) => {
        this.teacherJournalService
          .getJournalsTeacher(teacher.id, true)
          .subscribe(data => this.setClassesSubjectsByTeacher(teacher, data));
      });
    });

    this.columns = [
      { field: 'lastname', header: 'Прізвище' },
      { field: 'firstname', header: "Ім'я" },
      { field: 'patronymic', header: 'По батькові' },
      { field: 'dateOfBirth', header: 'Дата народження' },
      { field: 'subjectName', header: 'Предмети' },
      { field: 'className', header: 'Класи' }
    ];
    this._teacherServices.currentCalendar.subscribe(data => (this.ua = data));
    this.requestSubject$.pipe(debounceTime(500)).subscribe(() => {
      return this._teacherServices.checkLoginTeacher(this.teacher).subscribe(
        result => {
          if (
            result == null &&
            this.selectedTeacher.login !== this.teacher.login
          ) {
            this.loginStatus = 'Даний логін вже використовується';
          }
        },
        () => {
          console.error(`This login is free to use!`);
        }
      );
    });
  }

  // set subjects and classes to this.teachers by teacher id
  setClassesSubjectsByTeacher(teacher, subjectsData) {
    const subjects = [];
    const classes = [];

    subjectsData.forEach((item: any) => {
      subjects.push(item.subjectName);
      classes.push(item.className);
    });

    teacher.subjectName = subjects
      .filter((item: any, index: any) => {
        return index === subjects.indexOf(item);
      })
      .join(',\n');

    teacher.className = classes
      .filter((item: any, index: any) => {
        return index === classes.indexOf(item);
      })
      .join(',\n');
  }

  handlerFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      if (file.item(0).size > 500000) {
        this.photoData = 'Перевищено максимальний розмір 500 кб';
        this.imageUrl = 'assets/avatar.png';
      } else {
        this.photoData = '';
        this.teacher.avatar = event.target.result;
      }
    };
    reader.readAsDataURL(this.fileToUpload);
  }
  showDialogToAdd() {
    this.displayDialog = true;
    this.newTeacher = true;
    this.teacher = {};
  }
  onRowSelect(rowData: Iteachers) {
    this.loginStatus = '';
    this.photoData = '';
    this.selectedTeacher = rowData;
    this.newTeacher = false;
    this.teacher = {
      ...rowData
    };
    this.displayDialog = true;
  }
  create() {
    this.displayDialog = false;
    this.teacher.dateOfBirth = this._teacherServices.formatDate(
      this.teacher.dateOfBirth
    );
    this._teacherServices.postTeacher(this.teacher).subscribe(
      teacher => {
        this.teachers.push(teacher);
        this._teacherServices
          .getTeachers()
          .subscribe(users => (this.teachers = users));
        this.notificationToasts.notify(
          'success',
          'Успішно виконано',
          'Додано нового вчителя'
        );
      },
      err => {
        console.error(err);
        this.notificationToasts.notify(
          'error',
          'Відхилено',
          'Невдалося додати нового вчителя'
        );
      }
    );
    this.teacher = null;
  }
  save() {
    this.displayDialog = false;
    this.teacher.dateOfBirth = this._teacherServices.formatDate(
      this.teacher.dateOfBirth
    );
    this.teacher.oldPass = '';
    this.teacher.newPass = '';
    this._teacherServices.putTeacher(this.teacher).subscribe(
      teacher => {
        const teachers = [...this.teachers];
        teachers[this.teachers.indexOf(this.selectedTeacher)] = teacher;
        this.teachers = teachers;
        this._teacherServices
          .getTeachers()
          .subscribe(users => (this.teachers = users));
        this.notificationToasts.notify(
          'success',
          'Успішно виконано',
          'Збережено зміни вчителя'
        );
      },
      err => {
        console.error(err);
        this.notificationToasts.notify(
          'error',
          'Відхилено',
          'Невдалося зберегти зміни вчителя'
        );
      }
    );
    this.teacher = null;
  }
  confirm(rowData: Iteachers) {
    this.selectedTeacher = rowData;
    this.confirmationService.confirm({
      message: `Ви справді бажаєте видалити учителя:  ${
        this.selectedTeacher.lastname
      } ${this.selectedTeacher.firstname}
      ${this.selectedTeacher.patronymic}?`,
      icon: 'pi pi-ban',
      accept: () => {
        this._teacherServices.deactivateTeacher(this.selectedTeacher).subscribe(
          () => {
            this.teachers.splice(
              this.teachers.indexOf(this.selectedTeacher),
              1
            );
            this.notificationToasts.notify(
              'success',
              'Успішно виконано',
              'Видалено вчителя'
            );
          },
          err => {
            console.error(err);
            this.notificationToasts.notify(
              'error',
              'Відхилено',
              'Невдалося видалити даного вчителя'
            );
          }
        );
      }
    });
  }
  sendData() {
    {
      this.confirmationService.confirm({
        message:
          'Бажаєте отримати персональні дані всіх учителів та їхні паролі для даного сервісу?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._teacherServices.sendDataTeachers().subscribe(
            () => {
              this.notificationToasts.notify(
                'success',
                'Успішно виконано',
                'На вашу електронну адресу відправлено дані всіх учителів'
              );
            },
            err => {
              console.error(err);
              this.notificationToasts.notify(
                'error',
                'Відхилено',
                'Невдалося відправити дані'
              );
            }
          );
        }
      });
    }
  }
  print() {
    window.print();
  }
  checkLogin(value) {
    this.loginStatus = '';
    this.requestSubject$.next(value);
  }
}
