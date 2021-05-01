import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'src/app/models/subjects.model';
import { ClassScheduleService } from 'src/app/services/class-schedule.service';

@Component({
  selector: 'app-day-schedule',
  templateUrl: './day-schedule.component.html',
  styleUrls: ['./day-schedule.component.scss']
})
export class DayScheduleComponent implements OnInit {
  @Input() daySchedule;
  @Input() condition;
  @Input() schedule;
  @Input() days;
  @Input() isButtonDisabled;
  @Output() isButtonDisabledChange = new EventEmitter<boolean>();

  subjects: Subject[];

  constructor(private scheduleService: ClassScheduleService) {}

  ngOnInit() {
    // request to add a list of subjects
    this.scheduleService.getScheduleSubjects().subscribe(data => {
      this.subjects = data;
    });
  }

  onSubjectChange(selectedSubjectNew, rowData, daySchedule) {
    const subj = this.subjects.find(
      item => item.subjectId === selectedSubjectNew.value
    );
    const a = daySchedule.indexOf(rowData);
    daySchedule[a].subjectId = subj.subjectId;
    daySchedule[a].subjectName = subj.subjectName;
    daySchedule[a].description = subj.subjectDescription;

    if (this.findUndefinedSubject(this.schedule) === 1) {
      this.isButtonDisabledChange.emit(false);
    }
  }

  onRowDelete(rowData, daySchedule) {
    const a = daySchedule.indexOf(rowData);
    daySchedule.splice(a, 1);

    if (this.findUndefinedSubject(this.schedule) === 1) {
      this.isButtonDisabledChange.emit(false);
    }
  }

  onRowAdd(rowData, daySchedule) {
    const a = daySchedule.indexOf(rowData);
    daySchedule.splice(a + 1, 0, new Subject(-1, ''));
    daySchedule[a + 1].lessonNumber = daySchedule[a].lessonNumber + 1;
    this.isButtonDisabledChange.emit(true);
  }

  findUndefinedSubject(obj) {
    let indic = 1;
    Object.keys(obj).forEach((item: any) => {
      if (Array.isArray(obj[item])) {
        obj[item].forEach((subject: any) => {
          if (subject.subjectId === -1) {
            indic = -1;
          }
        });
      }
    });
    return indic;
  }
}
