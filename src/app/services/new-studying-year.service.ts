import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassId } from '../models/classId.model';
import { Group } from '../models/group.model';
import { SmallGroup } from '../models/transitional-studing.model';

@Injectable({
  providedIn: 'root'
})

export class NewStudyingYearService {
  constructor(private http: HttpClient) { }
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getGroups(): Observable<Group[]> {
    return this.http
      .get<Group[]>('classes', this.httpOptions)
      .map((response: any) => response.data);
  }

  postNewGroups(groupObject: SmallGroup[]): Observable<Group[]> {
    return this.http
      .post<Group[]>('students/transition', groupObject)
      .map((response: any) => response.data);
  }

  putNewOldId(idObject: ClassId[]): Observable<ClassId[]> {
    return this.http
      .put<ClassId[]>('students/transition', idObject)
      .map((response: any) => response.data);
  }

}
