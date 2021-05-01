import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ClassScheduleService } from 'src/app/services/class-schedule.service';
import { Group } from 'src/app/models/group.model';
import { Schedule } from 'src/app/models/class-schedule';
import { Subject } from 'src/app/models/subjects.model';
import { TeachersService } from 'src/app/services/teachers.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-correct-schedule',
  templateUrl: './correct-schedule.component.html',
  styleUrls: ['./correct-schedule.component.scss']
})
export class CorrectScheduleComponent implements OnInit {
  classes: Group[];

  selectedGroupId: number;
  selectedGroup: string;

  schedule: Schedule;

  startOfSemester: Date;
  endOfSemester: Date;
  minDateValue: Date;
  maxDateValue: Date;

  isButtonDisabled = false;

  ua: any;

  condition = false;

  days: any;

  constructor(
    private _teacherServices: TeachersService,
    private scheduleService: ClassScheduleService,
    private notificationToasts: DataSharingService
  ) {}

  ngOnInit() {
    this.getClasses();
    this.calendar();
    this.minDateValue = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // minDate is tomorrow
    this.maxDateValue = new Date(
      new Date().getTime() + 7 * 31 * 24 * 60 * 60 * 1000 // maxDate is a day in a year ahead
    );
    this.schedule = new Schedule();
    this.days = [
      'Понеділок',
      'Вівторок',
      'Середа',
      'Четвер',
      "П'ятниця",
      'Субота'
    ];
  }

  // request to add a list of classes
  getClasses(): void {
    this.scheduleService.getClasses().subscribe(data => {
      this.classes = data.filter(g => g.isActive);
    });
  }

  // event to select group and group id
  onClassSelected(selectedClassEvent): void {
    const group = this.classes.find(
      item => item.id === selectedClassEvent.value
    );
    this.selectedGroupId = group.id;
    this.selectedGroup = group.className;
    this.condition = false;
  }

  calendar(): void {
    this._teacherServices.currentCalendar.subscribe(data => (this.ua = data));
  }

  getSchedule(): void {
    this.scheduleService.getSchedule(this.selectedGroupId).subscribe(data => {
      this.schedule = data;
      this.condition = true;
      let count = 0;
      Object.keys(this.schedule).forEach((item: any) => {
        if (Array.isArray(this.schedule[item])) {
          count += this.schedule[item].length;
        }
      });
      if (count === 0) {
        this.notificationToasts.notify(
          'warn',
          '',
          ` Для ${this.selectedGroup} класу розклад не створено`
        );
      }

      this.startOfSemester = new Date(this.schedule.startOfSemester);
      this.endOfSemester = new Date(this.schedule.endOfSemester);
    });

    this.calendar();
  }

  // request to save schedule
  submitForm(): void {
    this.schedule.startOfSemester = this._teacherServices.formatDate(
      this.startOfSemester
    );
    this.schedule.endOfSemester = this._teacherServices.formatDate(
      this.endOfSemester
    );

    this.scheduleService.postSchedule(this.schedule).subscribe(
      data => {
        this.notificationToasts.notify(
          'success',
          'Успішно виконано',
          'Розклад збережено'
        );
        this.condition = false;
        this.selectedGroupId = null;
      },
      error => {
        this.notificationToasts.notify(
          'error',
          'Відхилено',
          'Не вдалося зберегти розклад уроків'
        );
      }
    );
  }
}
