import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../../services/admin-students.service';
import { Student } from '../../../models/students.model';
import { Classes } from '../../../models/classesForStudents.model';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { TeachersService } from 'src/app/services/teachers.service';
import { OverlayPanel } from 'primeng/primeng';
import { MessageService } from 'primeng/api';
import { PageTitleService } from '../../../services/pageTitle.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [StudentsService, MessageService, PageTitleService]
})
export class StudentsComponent implements OnInit {
  ua: object;
  classes: Classes[];
  students: Student[];
  newStudent: Student;
  selectedStudent: Student;
  numberOfStudents: number;
  isNew: boolean;
  loading: boolean;
  screenWidth: number;
  cols: any[];
  selectedClassName: string;
  selectedClassId: number;
  displayForm: boolean;
  photoMessage: string;
  photoPath: any = 'assets/avatar.png';
  loginStatusMessage: string;
  isLoginFree: boolean;
  imageUrl: any = 'assets/avatar.png';
  fileToUpload: File = null;
  constructor(
    private service_: StudentsService,
    private notificationToasts: DataSharingService,
    private _teacherServices: TeachersService,
    private messageService: MessageService,
    private pageTitle: PageTitleService
  ) { }

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Учні');
    this.screenWidthDetector();
    this.loading = true;
    this.isLoginFree = true;
    this.service_.getClasses()
      .subscribe(data => {
          this.classes = data;
          this.loading = false;
        });

    this.cols = [
      { field: 'lastname', header: 'Прізвище' },
      { field: 'firstname', header: 'Ім\'я' },
      { field: 'patronymic', header: 'По батькові' },
      { field: 'dateOfBirth', header: 'Дата народження' },
      { field: 'classe', header: 'Клас' }
    ];

    this.newStudent = new Student();
    this.selectedStudent = new Student();
    this._teacherServices.currentCalendar.subscribe(data => this.ua = data);
  }

  handlerFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      if (file.item(0).size > 500000) {
        this.photoMessage = 'Перевищено максимальний розмір 500 кб';
        this.imageUrl = 'assets/avatar.png';
      } else {
        this.photoMessage = '';
        this.photoPath = event.target.result;
        this.newStudent.avatar = event.target.result;
      }
    };
    reader.readAsDataURL(this.fileToUpload);
  }

  loadStudents(classID: number) {
    this.loading = true;
    this.selectedClassId = classID;
    this.service_.getStudents(classID)
      .subscribe(
        data => {
          this.students = data;
          this.loading = false;
          this.numberOfStudents = data.length;
        });
  }

  createStudent() {
    this.newStudent = new Student();
    this.isNew = true;
    this.showForm();
  }

  editStudent(student: Student) {
    this.selectedStudent = student;
    this.newStudent = new Student(
      student.firstname,
      student.lastname,
      student.patronymic,
      student.classId = null,
      student.dateOfBirth,
      student.email,
      student.phone,
      student.login,
      student.id,
      student.oldPass,
      student.newPass,
      student.avatar
    );
    this.isNew = false;
  }

  saveStudent() {
    if (this.isNew) {
      this.newStudent.dateOfBirth = this._teacherServices.formatDate(this.newStudent.dateOfBirth);
      this.newStudent.classId = this.selectedClassId;
      this.newStudent.avatar = this.photoPath;
      this.displayForm = false;
      this.service_.addStudent(this.newStudent).subscribe(data => {
        this.loadStudents(this.selectedClassId);
        this.displayForm = false;
        this.notificationToasts.notify(
          'success',
          'Успішно виконано',
          'Додано нового учня'
        );
      }, error => {
        this.notificationToasts.notify(
          'error',
          'Відхилено',
          'Не вдалося додати нового учня');
      });
    } else {
      this.newStudent.dateOfBirth = this._teacherServices.formatDate(this.newStudent.dateOfBirth);
      this.displayForm = false;
      this.service_.changeStudent(this.newStudent).subscribe(data => {
        this.loadStudents(this.selectedClassId);
        this.displayForm = false;
        this.notificationToasts.notify(
          'success',
          'Успішно виконано',
          'Збережено зміни учня'
        );
      }, error => {
        this.notificationToasts.notify(
          'error',
          'Відхилено',
          'Не вдалося зберегти учня');
      });
    }
  }

  selectedClassNameHandler(nameOfClass: string) {
    this.selectedClassName = nameOfClass;
  }

  showForm() {
    this.displayForm = true;
  }

  studentInfo(event, student: Student, overlaypanel: OverlayPanel) {
    this.selectedStudent = student;
    overlaypanel.toggle(event);
  }

  showConfirm(student: Student) {
    this.selectedStudent = student;
    this.messageService.clear();
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      summary: 'Ви впевнені, що хочите видалити такого учня:',
      detail: 'Підтвердіть, або скасуйте видалення'
    });
  }

  onConfirm() {
    this.service_.deleteStudent(this.newStudent).subscribe(data => {
      this.loadStudents(this.selectedClassId);
      this.notificationToasts.notify(
        'success',
        'Успішно виконано',
        'Учня видалено'
      );
    }, error => {
      this.notificationToasts.notify(
        'error',
        'Відхилено',
        'Не вдалося видалити учня');
    });
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
  }

  screenWidthDetector() {
    this.screenWidth = window.innerWidth;
  }

  printData() {
    window.print();
  }

  sendData() {
    this.service_.sendStudentsData(this.selectedClassId).subscribe(
      () => {
        this.notificationToasts.notify(
          'success',
          'Успішно виконано',
          'На вашу електронну адресу надіслано дані всіх учнів'
        );
      },
      err => {
        console.error(err);
        this.notificationToasts.notify(
          'error',
          'Відхилено',
          'Не вдалося надіслати дані'
        );
      }
    );
  }

  studentLogin() {
    this.service_.checkStudentLogin(this.newStudent).subscribe(data => {
      if (data == null && this.selectedStudent.login !== this.newStudent.login) {
        this.isLoginFree = false;
        this.loginStatusMessage = 'Такий логін вже використовується';
      } else {
        this.isLoginFree = true;
        this.loginStatusMessage = '';
      }
    }, err => {
      this.isLoginFree = true;
    });
  }
}
