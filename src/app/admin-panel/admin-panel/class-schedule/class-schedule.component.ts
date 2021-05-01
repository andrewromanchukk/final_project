import { Component, OnInit, ViewChild } from '@angular/core';
import { ClassScheduleService } from 'src/app/services/class-schedule.service';
import { Schedule } from 'src/app/models/class-schedule';
import { Group } from 'src/app/models/group.model';
import { Subject } from 'src/app/models/subjects.model';
import { TeachersService } from 'src/app/services/teachers.service';
import { NgForm } from '@angular/forms';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { PageTitleService } from '../../../services/pageTitle.service';

@Component({
  selector: 'app-class-schedule',
  templateUrl: './class-schedule.component.html',
  styleUrls: ['./class-schedule.component.scss'],
  providers: [PageTitleService]
})
export class ClassScheduleComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  subjects: Subject[];
  subjectNames: any;

  classes: Group[];
  selectedClass: any;
  selectedSubject: any;

  reset: any;
  ua: any;

  minDateValue: Date;
  maxDateValue: Date;

  schedule: Schedule;

  constructor(
    private _teacherServices: TeachersService,
    private notificationToasts: DataSharingService,
    private scheduleService: ClassScheduleService,
    private pageTitle: PageTitleService
  ) {}

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Розклад Уроків');
    this.getClasses();
    this.calendar();
    this.minDateValue = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // minDate is tomorrow
    this.maxDateValue = new Date(
      new Date().getTime() + 7 * 31 * 24 * 60 * 60 * 1000 // maxDate is a day in a year ahead
    );
    this.schedule = new Schedule();
  }

  // event to select group
  onClassSelected(selectedClassEvent): void {
    this.schedule.className = this.classes.find(
      item => item.id === selectedClassEvent.value
    );
    this.schedule.classId = this.schedule.className.id;
  }

  calendar(): void {
    this._teacherServices.currentCalendar.subscribe(data => (this.ua = data));
  }

  // request to add a list of classes
  getClasses(): void {
    this.scheduleService.getClasses().subscribe(data => {
      this.classes = data.filter(g => g.isActive);
    });
  }

  // request to save schedule
  submitForm(form: NgForm): void {
    Object.keys(this.schedule).forEach((item: any) => {
      if (this.schedule[item].pop) {
        this.schedule[item].pop();
        Object.keys(this.schedule[item]).forEach((i: any) => {
          const elem = this.schedule[item][i];
          if (
            elem.secondSubject !== undefined &&
            elem.secondSubject.subjectId !== -1
          ) {
            this.schedule[item].push(elem.secondSubject);
          }
        });
      }
    });
    this.schedule.startOfSemester = this._teacherServices.formatDate(
      this.schedule.startOfSemester
    );
    this.schedule.endOfSemester = this._teacherServices.formatDate(
      this.schedule.endOfSemester
    );
    this.scheduleService.postSchedule(this.schedule).subscribe(
      data => {
        this.notificationToasts.notify(
          'success',
          'Успішно виконано',
          'Розклад збережено'
        );
        this.form.reset();
        this.schedule = new Schedule();
      },
      error => {
        this.notificationToasts.notify(
          'error',
          'Відхилено',
          'Не вдалося зберегти розклад уроків'
        );
        Object.keys(this.schedule).forEach((item: any) => {
          if (this.schedule[item].push) {
            this.schedule[item].push({});
          }
        });
      }
    );
  }
}
