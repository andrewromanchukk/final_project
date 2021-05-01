import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Diary } from 'src/app/models/student-book-models/Diary.model';
import { WeekSchedule } from 'src/app/models/student-book-models/WeekSchedule.model';
import { File } from 'src/app/models/student-book-models/File.model';

@Injectable({
  providedIn: 'root'
})
export class StudentBookService {
  constructor(private _http: HttpClient) {}

  private months = [
    'Січня',
    'Лютого',
    'Березня',
    'Квітня',
    'Травня',
    'Червня',
    'Липня',
    'Серпня',
    'Вересня',
    'Жовтня',
    'Листопада',
    'Грудня'
  ];

  private dayOfWeek = [
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'П\'ятниця',
    'Субота'
  ];

  public getUkrainanDate(date: Date) {
    const day = date.getDate();
    const month = this.months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
  public getFormattedMonday(date: Date): string {
    const day = date.getDay(),
      diff = date.getDate() - day + 1;
    const monday = new Date(date.setDate(diff));
    const mondayMonth =
      monday.getMonth() + 1 < 10
        ? `0${monday.getMonth() + 1}`
        : monday.getMonth() + 1;
    const mondayDate =
      monday.getDate() < 10 ? `0${monday.getDate()}` : monday.getDate();
    return `${monday.getFullYear()}-${mondayMonth}-${mondayDate}`;
  }

  public sortDataByWeekDay(data: Diary[]): WeekSchedule[] {
    let arr = [];
    const sortedArray = [];
    for (let i = 0; i < this.dayOfWeek.length; i++) {
      data.forEach(el => {
        const currDate = new Date(el.date.join('-')).getDay() - 1;
        if (currDate === i) {
          arr.push(el);
        }
      });
      if (arr.length) {
        sortedArray.push({
          dayOfWeek: this.dayOfWeek[i],
          daySchedule: arr,
          dayDate: new Date(arr[0].date),
          dayUkrDate: this.convertedDate(arr[0])
        });
      }
      arr = [];
    }
    return sortedArray;
  }

  private b64toBlobUrl(
    b64Data: string,
    contentType: string = '',
    sliceSize = 512
  ): string {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return window.URL.createObjectURL(blob);
  }

  private addFilesToScheduleArray(data: Diary[]): Diary[] {
    const scheduleWithFiles = data.map(el => {
      if (el.homeworkFileId) {
        this.getFileById(el.lessonId).subscribe(
          response => {
            el.blobUrl = this.b64toBlobUrl(response.fileData, response.fileType);
            el.fileName = response.fileName;
          },
          err => {
            throwError(err);
          }
        );
      }
      return el;
    });
    return scheduleWithFiles;
  }
  public convertedDate(data: Diary): string {
    const day = new Date(data.date.join('-')).getDate();
    const month = this.months[new Date(data.date.join('-')).getMonth()];
    const year = new Date(data.date.join('-')).getFullYear();
    return `${day} ${month} ${year}`;
  }

  public getFileById(lessonId: number): Observable<File> {
    return this._http.get<any>(`/homeworks/files/${lessonId}`).map(response => {
      return response.data;
    });
  }

  public getDiariesList(date: Date = new Date()): Observable<WeekSchedule[]> {
    const formattedDate = this.getFormattedMonday(date);
    return this._http
      .get<any>(`/diaries?weekStartDate=${formattedDate}`)
      .map(response => {
        if (response.data.length) {
          const scheduleWithFiles = this.addFilesToScheduleArray(response.data);
          const sortedWeekData = this.sortDataByWeekDay(scheduleWithFiles);
          return [...sortedWeekData];
        } else {
          throw new Error('Наразі немає даних про розклад');
        }
      });
  }
}
