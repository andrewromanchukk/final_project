import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpAttachTeacherService } from 'src/app/services/http-attach-teacher.service';
import { Teacher } from 'src/app/models/teacher.model';
import { Subject } from 'src/app/models/subjects.model';
import { Group } from 'src/app/models/group.model';
import { NgForm } from '@angular/forms';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { PageTitleService } from '../../../services/pageTitle.service';

@Component({
  selector: 'app-attach-teacher',
  templateUrl: './attach-teacher.component.html',
  styleUrls: ['./attach-teacher.component.scss'],
  providers: [PageTitleService]
})
export class AttachTeacherComponent implements OnInit {
  @ViewChild('AttachTeacherForm') form: NgForm;
  public title = 'Прив\'язка вчителя до журналу';

  public teacher: Teacher;
  public teachers: Teacher[] = [];

  public subject: Subject;
  public subjects: Subject[] = [];

  public group: Group;
  public classes: Group[] = [];

  constructor(
    private attachService: HttpAttachTeacherService,
    private notificationToasts: DataSharingService,
    private pageTitle: PageTitleService
  ) { }

  postAttachTeacher() {
    this.attachService
      .postAttachTeacher({
        subjectId: this.form.value.subject.subjectId,
        teacherId: this.form.value.teacher.id,
        classId: this.form.value.group.id
      })
      .subscribe(
        data => {
          this.notificationToasts.notify(
            'success',
            'Успішно виконано',
            'Прив\'язку вчителя до журналу'
          );
        },
        error => {
          this.notificationToasts.notify(
            'error',
            'Відхилено',
            'Невдалося виконати прив\'язку вчителя до журналу'
          );
        }
      );
    this.form.reset();
  }

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Прив\'язка вчителя до журналу');
    this.attachService.getTeachers().subscribe(data => (this.teachers = data));
    this.attachService.getSubjects().subscribe(data => (this.subjects = data));
    this.attachService.getClasses().subscribe(data => (this.classes = data.filter(classes => classes.isActive)));
  }
}
