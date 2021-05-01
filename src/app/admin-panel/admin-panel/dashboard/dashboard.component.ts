import { Component, OnInit } from '@angular/core';
import { HttpAttachTeacherService } from 'src/app/services/http-attach-teacher.service';
import { PageTitleService } from '../../../services/pageTitle.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [PageTitleService]
})
export class DashboardComponent implements OnInit {
  public students: number;
  public teachers: number;
  public classes: number;
  public subjects: number;

  constructor(private http: HttpAttachTeacherService, private pageTitle: PageTitleService) { }

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Панель Керування');
    this.http.getClasses().subscribe(data => {
      const activeClasses = data.filter(classes => classes.isActive);
      this.classes = activeClasses.length;
      this.students = activeClasses.reduce((sumStudents, currentClass) => sumStudents + currentClass.numOfStudents, 0);
    });
    this.http.getTeachers().subscribe(data => this.teachers = data.length);
    this.http.getSubjects().subscribe(data => this.subjects = data.length);
  }

}
