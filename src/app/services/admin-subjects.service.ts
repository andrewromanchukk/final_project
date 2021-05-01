import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from '../models/subjects.model';

@Injectable({
  providedIn: 'root'
})
export class AdminSubjectsService {

  constructor(private _http: HttpClient) { }

  public getSubjectsList(): Observable<Subject[]> {
    return this._http.get<any>('subjects').map(response => response.data);
  }

  public postSubject(subject: Subject): Observable<Subject> {
    return this._http
      .post<any>('subjects', subject)
      .map(response => response.data);
  }

  public putSubject(subject: Subject): Observable<Subject> {
    return this._http.put<any>(`subjects/${subject.subjectId}`, subject).map(response => response.data);
  }

  public getSubjectsListForClass(classId): Observable<Subject[]> {
    return this._http.get<any>(`subjects?classId=${classId}`).map(response => response.data);
  }
}
