import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeacherJournalsService } from 'src/app/services/teacher-journals.service';
import { JournalData } from 'src/app/models/journalData.model';
import { Journal } from 'src/app/models/journal.model';
import { Mark } from 'src/app/models/journalMark.model';
import { MessageService } from 'primeng/api';
import { PageTitleService } from '../../../services/pageTitle.service';

@Component({
  selector: 'app-journal-data',
  templateUrl: './journal-data.component.html',
  styleUrls: ['./journal-data.component.scss'],
  providers: [MessageService, PageTitleService]
})
export class JournalDataComponent implements OnInit {
  constructor(
    private teacherJournalService: TeacherJournalsService,
    private messageService: MessageService,
    private pageTitle: PageTitleService
  ) {}

  journalData: JournalData[];
  isActiveJournal: boolean;
  isDataRecived = false;
  scrollableCols: { field: string; header: string }[];
  preventSimpleClick: boolean;
  timerDoubleClick: any;
  markEditValue: string;
  markDescription: string;
  isDisplayDialogVisable = false;
  contextMenuItems: any[];
  selectedMark: { row: JournalData; col: Header };
  frozenCols: Header[] = [
    new Header('studentFullName', 'Студент', '14rem'),
    new Header('rating', 'Середня Рейтинг', '6rem')
  ];

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Журнал');
    this.contextMenuItems = [
      {
        label: 'Опис оцінки',
        icon: 'pi pi-comments',
        command: () => this.changeDescription()
      },
      {
        label: 'Видалити',
        icon: 'pi pi-times',
        command: () => this.deleteMark()
      },
      {
        label: 'Вибрати',
        icon: 'pi pi-check',
        items: [
          {
            label: 'за місяць',
            icon: 'pi pi-ellipsis-v',
            command: () => this.selectMarksMonth(false)
          },
          {
            label: 'всіх за місяць',
            icon: 'pi pi-bars',
            command: () => this.selectMarksMonth(true)
          }
        ]
      },
      {
        label: 'Інверт вибір',
        icon: 'pi pi-check',
        items: [
          {
            label: 'за місяць',
            icon: 'pi pi-ellipsis-v',
            command: () => this.selectMarksMonth(false, true)
          },
          {
            label: 'всіх за місяць',
            icon: 'pi pi-bars',
            command: () => this.selectMarksMonth(true, true)
          }
        ]
      }
    ];
    this.subscribeData();
  }
  subscribeData() {
    this.teacherJournalService.journalChanged.subscribe((journal: Journal) => {
      this.teacherJournalService
        .getjournals(journal.idSubject, journal.idClass)
        .subscribe(data => {
          this.journalData = data;
          this.sortingByDate();
          this.sortingByAlphabet();
          this.replaceNames();
          this.countRating();
          this.scrollableCols = this.journalDeys;
          this.isDataRecived = data.length > 0;
          if (data.length < 1) {
            this.showNotification(
              'warn',
              'Журнал порожній',
              'Адміністратор має заповнити дані про клас та визначити графік'
            );
          }
        });
    });
  }

  // sorting journalData by date
  sortingByDate() {
    this.journalData.forEach( item => {
      item.marks.sort( (day1, day2) =>
      + new Date(day1.dateMark.replace( /\./g, '-' )) - + new Date(day2.dateMark.replace( /\./g, '-' )) );
    });
  }

  // sorting journalData by alphabet
  sortingByAlphabet() {
    this.journalData.sort( (name1, name2) =>
      name1.studentFullName.split(' ')[1].localeCompare(name2.studentFullName.split(' ')[1]) );
  }

  // changes names in places
  replaceNames() {
  this.journalData.forEach( item =>
    item.studentFullName = item.studentFullName.split(' ')[1] + ' ' + item.studentFullName.split(' ')[0] );
  }

  get journalDeys(): { field: string; header: string }[] {
    if (this.journalData && this.journalData.length > 0) {
      return this.journalData[0].marks.map((mark, index) => {
        const dayType = mark.typeMark ? mark.typeMark + ',' : ',';
        const weekDay = this.dayForMonth(mark.dateMark) + ',';
        const day = mark.dateMark.slice(mark.dateMark.indexOf('.') + 1);
        const formatedDay = day.split('.')[1] + '/' + day.split('.')[0];
        return {
          field: '' + index,
          header: dayType + weekDay + formatedDay,
          width: '5em'
        };
      });
    } else {
      return;
    }
  }
  countRating() {
    this.journalData = this.journalData.map(student => {
      let totalRating = 0;
      let countMarks = 0;
      let countSelected = 0;
      let totalSelected = 0;
      student.marks.forEach(mark => {
        if (mark.mark) {
          countMarks++;
          totalRating = totalRating + +mark.mark;
          if (mark.isSelected) {
            totalSelected = totalSelected + +mark.mark;
            countSelected++;
          }
        }
      });
      const prepareStudent = new JournalData(
        student.idStudent,
        student.marks,
        student.studentFullName
      );
      if (totalRating > 0) {
        prepareStudent.rating[0] = totalRating / countMarks;
      }
      if (countSelected > 0) {
        prepareStudent.rating[1] = totalSelected / countSelected;
      }
      return prepareStudent;
    });
  }
  dayForMonth(date: string): string {
    const weakDay = new Date( date.replace( /\./g, '-' )).getDay();
    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[weakDay];
  }

  markStudent(student: JournalData, markIndex: number): string {
    if (!isNaN(markIndex)) {
      const mark = student.marks[markIndex].mark;
      if (mark) {
        return mark;
      } else {
        return '';
      }
    } else {
      return student[markIndex];
    }
  }
  singleClick(student: JournalData, mark: number) {
    if (isNaN(mark)) {
      return;
    }
    if (student.marks[mark].isEdit) {
      return;
    }
    this.preventSimpleClick = false;
    const delay = 200;
    this.timerDoubleClick = setTimeout(() => {
      if (!this.preventSimpleClick) {
        this.selected(student, mark);
      }
    }, delay);
  }
  doubleClick(student: JournalData, mark: number) {
    this.preventSimpleClick = true;
    clearTimeout(this.timerDoubleClick);
    this.edit(student, mark);
  }
  selected(student: JournalData, mark: any) {
    if (student.marks[mark].mark) {
      student.marks[mark].isSelected = !student.marks[mark].isSelected;
      this.teacherJournalService.markSelect(student.marks[mark]);
      this.countRating();
    }
  }
  daySelected(day: Header) {
    if (!day) {
      return;
    }
    const indexDay = +day.field;
    if (isNaN(indexDay)) {
      return;
    }
    this.journalData.forEach(student => {
      if (student.marks[indexDay].mark && +student.marks[indexDay].mark > 0) {
        student.marks[indexDay].isSelected = !student.marks[indexDay]
          .isSelected;
      }
    });
    if (this.journalData.length > 0) {
      this.teacherJournalService.markSelect(
        this.journalData[0].marks[indexDay]
      );
    }
    this.countRating();
  }
  edit(student: JournalData, mark: number) {
    if (isNaN(mark) || !student) {
      return;
    }
    student.marks[mark].isEdit = true;
    student.marks[mark].isSelected = false;
  }
  isEditMode(student: JournalData, mark: number): boolean {
    if (student.marks[mark]) {
      if (student.marks[mark].isEdit) {
        return student.marks[mark].isEdit;
      }
    }
  }
  isSelected(student: JournalData, mark: number): boolean {
    return (
      student.marks[mark] &&
      student.marks[mark].isSelected &&
      student.marks[mark].isSelected
    );
  }
  bgColorForMarkType(col: Header): string {
    if (!col) {
      return 'mark';
    }
    const indexMark: number = +col.field;
    if (!(indexMark + 1) || this.journalData.length < 1) {
      return '#f4f4f4';
    }
    const mark: Mark = this.journalData[0].marks[indexMark];
    if (!mark.typeMark) {
      return '#f4f4f4';
    }
    switch (mark.typeMark.toLowerCase()) {
      case 'лабораторна':
        return 'rgba(255, 205, 150, 0.5)';
      case 'контрольна':
        return 'rgba(0, 255, 0, 0.5)';
      case 'тематична':
        return 'rgba(255, 0, 0, 0.5)';
      default:
        return '#f4f4f4';
    }
  }
  markEditExit(student: JournalData, mark: number) {
    if (student.marks[mark]) {
      if (student.marks[mark].isEdit) {
        student.marks[mark].isEdit = false;
        this.markEditValue = '';
        let markValue = +student.marks[mark].mark;
        if (markValue > 12) {
          markValue = 12;
        }
        if (markValue < 1) {
          return;
        }
        student.marks[mark].mark = '' + markValue;
        this.teacherJournalService
          .sendMark(student.marks[mark], student.idStudent)
          .subscribe(status => {
            if (status.code && status.code !== 201) {
              this.showNotification(
                'error',
                'Оцінка не збережена!',
                status.message
              );
            }
          });
        this.countRating();
      }
    }
  }
  onKeydown(event: any) {
    if (event.target.value) {
      if (+event.target.value > 12) {
        event.target.value = '12';
        return false;
      } else {
        if (event.target.value.charAt(0) === '0') {
          event.target.value = '';
        }
      }
    }
  }
  resetMarks(marks: Mark[]): Mark[] {
    return marks.map(mark => {
      mark.isSelected = false;
      mark.isEdit = false;
      return mark;
    });
  }
  deleteMark() {
    if (
      !this.selectedMark ||
      !this.selectedMark.row ||
      !this.selectedMark.col
    ) {
      this.isDisplayDialogVisable = false;
      return;
    } else {
      const studentIndex = this.journalData.indexOf(this.selectedMark.row);
      if (!isNaN(+this.selectedMark.col.field)) {
        const markForDelete: Mark = this.journalData[studentIndex].marks[
          this.selectedMark.col.field
        ];
        markForDelete.mark = '0';
        markForDelete.note = '';
        this.teacherJournalService
          .sendMark(markForDelete, this.journalData[studentIndex].idStudent)
          .subscribe(status => {
            if (status.code && status.code !== 201) {
              this.showNotification(
                'error',
                'Видалення не вдалось!',
                status.message
              );
            } else {
              if (markForDelete.isSelected) {
                markForDelete.isSelected = false;
              }
              markForDelete.mark = undefined;
              this.countRating();
            }
          });
      }
    }
  }
  changeDescription() {
    if (
      !this.selectedMark ||
      !this.selectedMark.row ||
      !this.selectedMark.col
    ) {
      this.isDisplayDialogVisable = false;
      return;
    }
    const colomn = +this.selectedMark.col.field;
    if (isNaN(colomn) || colomn === undefined) {
      return;
    } else {
      this.markDescription = this.selectedMark.row.marks[colomn].note;
      this.isDisplayDialogVisable = true;
    }
  }
  storeMarkDescription() {
    const studentIndex = this.journalData.indexOf(this.selectedMark.row);
    const storeMark: Mark = this.selectedMark.row.marks[
      this.selectedMark.col.field
    ];
    storeMark.note = this.markDescription;
    this.teacherJournalService
      .sendMark(storeMark, this.journalData[studentIndex].idStudent)
      .subscribe(status => {
        if (status.code && status.code !== 201) {
          this.showNotification(
            'error',
            'Опис оцінки не змінено!',
            status.message
          );
        }
        this.isDisplayDialogVisable = false;
      });
  }
  selectMarksMonth(all: boolean = false, invert: boolean = false) {
    const month = this.selectedMark.col.header.split(',')[2].split('/')[1];
    if (all) {
      this.journalData.forEach((student: JournalData) => {
        student.marks.forEach((mark: Mark) => {
          if (mark.mark && mark.dateMark.split('.')[1] === month) {
            mark.isEdit = false;
            mark.isSelected = invert ? !mark.isSelected : true;
          }
        });
      });
    } else {
      const selectedStudent = this.journalData.indexOf(this.selectedMark.row);
      if (isNaN(selectedStudent)) {
        return;
      } else {
        this.journalData[selectedStudent].marks.forEach((mark: Mark) => {
          if (mark.mark && mark.dateMark.split('.')[1] === month) {
            mark.isEdit = false;
            mark.isSelected = invert ? !mark.isSelected : true;
          }
        });
      }
    }
    this.countRating();
  }
  showNotification(type: string, message: string, detail: string) {
    const list = ['info', 'warn', 'error', 'success'];
    if (list.indexOf(type) >= 0) {
      this.messageService.add({
        key: 'error',
        severity: type,
        summary: message,
        detail: detail
      });
    } else {
      this.messageService.add({
        key: 'error',
        severity: 'info',
        summary: message,
        detail: detail
      });
    }
  }
}
class Header {
  public field: string;
  public header: string;
  public width: string;
  constructor(field: string, header: string, width: string) {
    this.field = field;
    this.header = header;
    this.width = width;
  }
}
