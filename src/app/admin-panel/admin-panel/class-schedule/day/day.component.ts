import { Component, OnInit, Input } from '@angular/core';
import { ClassScheduleService } from 'src/app/services/class-schedule.service';
import { Subject } from 'src/app/models/subjects.model';
import { Schedule } from 'src/app/models/class-schedule';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {
  @Input() daySubjectsList;

  subjects: Subject[];
  schedule: Schedule;
  selectedSubject: any;
  subjectNames: any;

  constructor(private scheduleService: ClassScheduleService) {}

  ngOnInit() {
    this.getScheduleSubjects();
  }

  // request to add a list of subjects
  getScheduleSubjects(): void {
    this.scheduleService.getScheduleSubjects().subscribe(data => {
      this.subjects = data;
    });
  }

  // event for button to delete subject
  delSubject(subject, day, i) {
    day[i] = subject.value;
    day.splice(i, 1);
  }

  // event to add new subject element to array
  addSubject(selectedSubjectNew, daySubjects, i) {
    const subj = this.subjects.find(
      item => item.subjectId === selectedSubjectNew.value
    );
    daySubjects[i] = new Subject(subj.subjectId, subj.subjectName);
    daySubjects[i].lessonNumber = i + 1;
    daySubjects[i].description = subj.subjectDescription;
    if (i === daySubjects.length - 1) {
      daySubjects[i + 1] = {};
    }
    this.daySubjectsList = daySubjects;
  }

  addSecondSubject(selectedSubjectNew, daySubjects, i) {
    daySubjects[i].secondSubject = new Subject(-1, '');
  }

  // write second subject to array
  changeSecondSubject(selectedSubjectNew, daySubjects, i) {
    const subj = this.subjects.find(
      item => item.subjectId === selectedSubjectNew.value
    );
    daySubjects[i].secondSubject = new Subject(
      subj.subjectId,
      subj.subjectName
    );
    daySubjects[i].secondSubject.lessonNumber = i + 1;
    daySubjects[i].secondSubject.description = subj.subjectDescription;
  }
}
