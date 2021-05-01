import { Component, OnInit } from '@angular/core';
import { StudentBookService } from 'src/app/services/student-book-services/student-book.service';
import { MenuItem } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { WeekSchedule } from 'src/app/models/student-book-models/WeekSchedule.model';
import { DomSanitizer } from '@angular/platform-browser';
import { PageTitleService } from '../../services/pageTitle.service';

@Component({
  selector: 'app-student-book',
  templateUrl: './student-book.component.html',
  styleUrls: ['./student-book.component.scss'],
  providers: [PageTitleService]
})
export class StudentBookComponent implements OnInit {
  public weekSchedule: WeekSchedule[];

  public startAndEndOfWeek: string;

  public offset = 0;

  public saveOffset = 0;

  public ukrCurrDate: string;

  public menuItems: MenuItem[];

  public cols: Array<object>;

  public scheduleOptions: SelectItem[];

  public view = false;

  public selectedType = 'week';

  private clonedWeekSchedule: WeekSchedule[];

  public viewOptions: SelectItem[];

  public viewType = 'group';

  public loading = true;

  constructor(
    private studentBookService: StudentBookService,
    private notificationToasts: DataSharingService,
    private sanitizer: DomSanitizer,
    private pageTitle: PageTitleService
  ) {}

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Щоденник');
    this.ukrCurrDate = this.studentBookService.getUkrainanDate(new Date());
    this.studentBookService.getDiariesList().subscribe(
      data => {
        this.weekSchedule = data;
        this.startAndEndOfWeek = `${this.weekSchedule[0].dayUkrDate} - ${
          this.weekSchedule[this.weekSchedule.length - 1].dayUkrDate
        }`;
        this.loading = false;
      },
      () => {
        this.changeWeekSchedule(true, 5);
      }
    );

    this.cols = [
      { field: 'lessonNumber', header: '№', class: 'lesson-number' },
      { field: 'subjectName', header: 'Предмет', class: 'lesson-name' },
      {
        field: 'homeWork',
        header: 'Домашня робота',
        class: 'lesson-description'
      },
      { field: 'mark', header: 'Оцінка', class: 'lesson-mark' }
    ];

    this.scheduleOptions = [
      { label: 'День', value: 'day' },
      { label: 'Тиждень', value: 'week' }
    ];

    this.viewOptions = [
      { value: 'list', icon: 'pi pi-list' },
      { value: 'group', icon: 'pi pi-th-large' }
    ];
  }

  changeWeekSchedule(week: boolean, lengthOfCalls: number): void {
    const day = new Date();
    let currDay = day.getDate();
    if (week) {
      this.offset += 7;
    } else {
      this.offset -= 7;
    }
    currDay += this.offset;
    const changedWeek = new Date(day.setDate(currDay));
    this.studentBookService.getDiariesList(changedWeek).subscribe(
      data => {
        this.weekSchedule = data;
        this.startAndEndOfWeek = `${this.weekSchedule[0].dayUkrDate} - ${
          this.weekSchedule[this.weekSchedule.length - 1].dayUkrDate
        }`;
        this.clonedWeekSchedule = [...this.weekSchedule];
        this.saveOffset = this.offset;
        this.loading = false;
      },
      err => {
        if (lengthOfCalls >= 0) {
          this.changeWeekSchedule(week, lengthOfCalls - 1);
        } else {
          this.offset = this.saveOffset;
          this.notificationToasts.notify('error', 'Помилка', err.message);
          this.loading = false;
        }
      }
    );
  }

  changeScheduleView(): void {
    if (this.viewType === 'list' && !this.view) {
      this.view = true;
      this.cols.push({ field: 'note', header: 'Примітка' });
    } else if (this.viewType === 'group' && this.view) {
      this.view = false;
      this.cols.length = this.cols.length - 1;
    }
  }

  changeDataView(): void {
    if (this.selectedType === 'day') {
      this.viewType = 'list';
      this.changeScheduleView();
      const currDate = new Date().setHours(0, 0, 0, 0);
      const today = this.weekSchedule.filter(el => {
        return currDate === el.dayDate.getTime();
      });
      this.clonedWeekSchedule = [...this.weekSchedule];
      this.weekSchedule = today.length ? today : [this.weekSchedule[0]];
      this.startAndEndOfWeek = `${this.weekSchedule[0].dayUkrDate}`;
    } else {
      this.weekSchedule = this.clonedWeekSchedule || this.weekSchedule;
      this.startAndEndOfWeek = `${this.weekSchedule[0].dayUkrDate} - ${
        this.weekSchedule[this.weekSchedule.length - 1].dayUkrDate
      }`;
      this.viewType = 'group';
      this.changeScheduleView();
    }
  }

  switchSchedule(direction: boolean): void {
    if (this.selectedType === 'day') {
      this.changeDaySchedule(direction);
    } else {
      this.loading = true;
      this.changeWeekSchedule(direction, 5);
    }
  }

  changeDaySchedule(type: boolean): void {
    const index = this.clonedWeekSchedule.indexOf(this.weekSchedule[0]);
    if (type && index !== this.clonedWeekSchedule.length - 1) {
      this.weekSchedule = [this.clonedWeekSchedule[index + 1]];
      this.startAndEndOfWeek = `${this.weekSchedule[0].dayUkrDate}`;
    } else if (!type && index !== 0) {
      this.weekSchedule = [this.clonedWeekSchedule[index - 1]];
      this.startAndEndOfWeek = `${this.weekSchedule[0].dayUkrDate}`;
    }
  }

  printSchedule(): void {
    window.print();
  }
}
