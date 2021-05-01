import { Injectable } from '@angular/core';
import { Journal } from '../models/journal.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { Hometask } from '../models/hometask.model';
import { JournalData } from '../models/journalData.model';
import { Month } from '../models/month.model';
import { Mark } from '../models/journalMark.model';
import { HomeTaskFile } from '../models/homeTaskFile.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherJournalsService {

  public journalChanged = new Subject<Journal>();

  public markSelected = new Subject<Mark>();

  readonly allJournals: string = '/journals';
  readonly activeJournal: string = '/active';

  constructor(private http: HttpClient) { }

  public emitJournalChanged(journal: Journal) {
    this.journalChanged.next(journal);
  }
  public markSelect(mark: Mark) {
    this.markSelected.next(mark);
  }

  private homeTaskUrl(idSubject: number, idClass: number): string {
    return '/homeworks/subjects/' + idSubject + '/classes/' + idClass;
  }

  private homeTaskFileUrl(idLesson: number): string {
    return '/homeworks/files/' + idLesson;
  }

  private urlForTeacher(teacherId?: number, isActive?: boolean): string {
    if (teacherId > 0) {
      if (isActive) {
        return this.allJournals + '/teachers/' + teacherId + this.activeJournal;
      } else {
        return this.allJournals + '/teachers/' + teacherId;
      }
    } else {
      return this.allJournals; // all journals for current user/teacher
    }
  }

  private urlJournalSubject(idSubject: number, idClass: number) {
    if (idSubject + idClass > 1) {
      return this.allJournals + '/subjects/' + idSubject + '/classes/' + idClass;
    } else {
      return;
    }
  }

  public getJournalsTeacher(id?: number, isActive?: boolean): Observable<Journal[]> {
    const url = this.urlForTeacher(id, isActive);
    const observerResponse = this.http.get<Journal[]>(url)
      .map((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
        return throwError(error);
      });
    return observerResponse;
  }

  public getHomeworks(idSubject: number, idClass: number): Observable<Hometask[]> {
    return this.http.get<Hometask[]>(this.homeTaskUrl(idSubject, idClass))
      .map((response: any) => {
        return response.data;
      }).catch((error: any) => {
        return throwError(error);
      });
  }

  public getHomeTaskFile(idLesson: number): Observable<HomeTaskFile> {
    return this.http.get<HomeTaskFile>(this.homeTaskFileUrl(idLesson))
      .map((response: any) => {
        return response.data;
      }).catch((error: any) => {
        return throwError(error);
      });
  }

  public putHomeTaskFile(homeTaskFile: HomeTaskFile): Observable<any> {
    return this.http.put<HomeTaskFile>('/homeworks/files', homeTaskFile)
      .map((response: any) => {
        return response.status;
      }).catch((error: any) => {
        return throwError(error);
      });
  }

  public getjournals(idSubject: number, idClass: number): Observable<JournalData[]> {
    return this.http.get<JournalData[]>(this.urlJournalSubject(idSubject, idClass))
      .map((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
        return throwError(error);
      });
  }

  public getPreparedMonths(journal: JournalData[]): Month[] {
    const res: Month[] = [];
    if (journal) {
      const markDates: string[] = [];
      for (let studentIndex = 0; studentIndex < journal.length; studentIndex++) {
        for (let markIndex = 0; markIndex < journal[studentIndex].marks.length; markIndex++) {
          const markObject = journal[studentIndex].marks[markIndex];
          const month = this.getMonths(markObject.dateMark, '.');
          if (markDates.indexOf(month) >= 0) {
            continue;
          } else {
            markDates.push(month);
            const formatedDate = markObject.dateMark;
            const formatedMonth = formatedDate.slice(0, formatedDate.lastIndexOf('.'));
            const monthElement: Month = { label: month, value: formatedMonth };
            res.push(monthElement);
          }
        }
      }
      return res;
    } else { return []; }
  }

  private getMonths(date: string, separator: string): string {
    const months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень',
     'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
    const res = date.split(separator);
    if (res[1]) {
      return months[(+res[1] - 1)] + ' ' + res[0];
    }
    return;
  }

  public getExistingJournalMonths(month: Month, journalsData: JournalData[]) {
    const isThisMonth = (element, index, array) => {
      return (element.dateMark.indexOf(month) === 0);
    };
    for (let studentIndex = 0; studentIndex < journalsData.length; studentIndex++) {
      const marks = journalsData[studentIndex].marks;
      const marksFiltered = marks.filter(isThisMonth);
    }
    const filteredData: JournalData[] = journalsData.map(student => {
      const filteredStudent = new JournalData(student.idStudent, student.marks.filter(isThisMonth), student.studentFullName);
      return filteredStudent;
    });
    return filteredData;
  }


  public sendMark(mark: Mark, studentID: number): Observable<any> {
  const data = {
    idLesson: mark.idLesson,
    idMark: 0,
    idStudent: studentID,
    mark: mark.mark,
    note: mark.note
  };
  return this.http.post<any>('/marks', data).map( response => response.status);
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

  public getHomeTaskFileUrl(fileData: string, fileType: string): string {
    const fileUrl = this.b64toBlobUrl(fileData, fileType);
    return fileUrl;
  }
}
