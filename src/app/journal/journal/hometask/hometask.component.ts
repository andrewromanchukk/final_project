import { Component, OnInit} from '@angular/core';
import { Hometask } from '../../../models/hometask.model';
import { SelectItem, MessageService } from 'primeng/api';
import { TeacherJournalsService } from '../../../services/teacher-journals.service';
import { Journal } from '../../../models/journal.model';
import { formatDate } from '@angular/common';
import { HomeTaskFile } from '../../../models/homeTaskFile.model';
import { Mark } from '../../../models/journalMark.model';

@Component({
  selector: 'app-hometask',
  templateUrl: './hometask.component.html',
  styleUrls: ['./hometask.component.scss'],
  providers: [MessageService]
})
export class HometaskComponent implements OnInit {

  hometasks: Hometask[];
  hometasksToDisplay: Hometask[];
  sortKey: string;
  sortOptions: SelectItem[];
  sortField: string;
  sortOrder: number;
  showPastTasks = false;
  activeJournal: Journal;
  currentDate: string;
  today = new Date();
  homeTaskFiles: HomeTaskFile[];
  activeMark: Mark;
  activeHomeTaskFile: HomeTaskFile;
  uploadHomeTaskFile: HomeTaskFile;
  fileToUpload: File = null;
  fileData: string;

  constructor(
    private teacherJournalService: TeacherJournalsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.teacherJournalService.journalChanged.subscribe((journal: Journal) => {
      this.activeJournal = journal;
      this.getSelectedMarks();
      this.teacherJournalService.getHomeworks(this.activeJournal.idSubject, this.activeJournal.idClass)
        .subscribe(hometasks => {
            this.hometasks = hometasks;
            this.hometasksToDisplay = this.hometasks.filter( hometask => {
              return this.isHometaskEnableToShow(hometask.date, this.showPastTasks);
            });
        });
    });

    this.sortOptions = [
      {label: 'Спочатку нові', value: '!date'},
      {label: 'Спочатку старі', value: 'date'},
      {label: 'По опису', value: 'homework'}
    ];

    this.currentDate = formatDate(this.today, 'yyyy.MM.dd', 'en-US', '+0200');
  }

  getSelectedMarks() {
    this.teacherJournalService.markSelected.subscribe( mark => {
      this.activeMark = mark;
      this.teacherJournalService.getHomeTaskFile(mark.idLesson).subscribe(homeTaskFile => {
        this.activeHomeTaskFile = homeTaskFile;
        this.uploadHomeTaskFile = homeTaskFile;
      });
    });
  }

  onSortChange(event): void {
    const value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  openHomeTask(idLesson: number): void {
    let fileUrl: string;
    let fileData: string;
    let fileType: string;

    if (!idLesson) {
      fileUrl = '';
    } else {
      fileData = this.homeTaskFiles[idLesson].fileData;
      fileType = this.homeTaskFiles[idLesson].fileType;
      fileUrl = this.teacherJournalService.getHomeTaskFileUrl(fileData, fileType);
    }
    window.open(fileUrl);
  }

  openSingleHomeTask(activeHomeTaskFile: HomeTaskFile): void {
    let fileUrl: string;
    let fileData: string;
    let fileType: string;

    fileData = activeHomeTaskFile.fileData;
    fileType = activeHomeTaskFile.fileType;
    fileUrl = this.teacherJournalService.getHomeTaskFileUrl(fileData, fileType);

    window.open(fileUrl);
  }

  onPastTasksChange(): void {
    this.hometasksToDisplay = this.hometasks.filter( hometask => {
      return this.isHometaskEnableToShow(hometask.date, this.showPastTasks);
    });
    this.homeTaskFiles = [];
    this.hometasksToDisplay.forEach(hometask => {
      if (hometask.fileName) {
        this.teacherJournalService.getHomeTaskFile(hometask.idLesson).subscribe(homeTaskFile => {
          this.homeTaskFiles[homeTaskFile.idLesson] = homeTaskFile;
        });
      }
    });
  }

  isHometaskEnableToShow(hometaskDate: string, showPast = false): boolean {
    let rule = showPast;
    if (hometaskDate > this.currentDate) {
      rule = true;
    }
    return rule;
  }

  sendHomeTaskFile(uploadHomeTaskFile: HomeTaskFile) {
    this.teacherJournalService.putHomeTaskFile(uploadHomeTaskFile)
      .subscribe(status => {
        if (status.code && status.code !== 201) {
          this.showNotification(
            'error',
            'Завдання не збережно!',
            status.message
          );
        } else {
          this.showNotification(
            'success',
            'Завдання збережно!',
            status.message
          );
        }
    });
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

  changeHometaskDescription(homework: any) {
    this.uploadHomeTaskFile.homework = homework.target.value;
  }

  handlerFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      if (file.item(0).size > 500000) {
        this.fileData = 'Перевищено максимальний розмір 500 кб';
      } else {
        this.fileData = '';
        this.uploadHomeTaskFile.fileData = event.target.result.toString().split(',')[1];
      }
    };
    reader.readAsDataURL(this.fileToUpload);
    this.uploadHomeTaskFile.fileType = this.fileToUpload.type;
    this.uploadHomeTaskFile.fileName = this.fileToUpload.name;
  }
}
