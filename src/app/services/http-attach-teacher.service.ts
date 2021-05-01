import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../models/teacher.model';
import { Subject } from '../models/subjects.model';
import { Group } from '../models/group.model';
import { AttachedTeacher } from '../models/attached-teacher.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpAttachTeacherService {

  constructor(private http: HttpClient) { }

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>('teachers')
      .map((response: any) => response.data)
      .pipe(tap(_ => _.map(teacher => teacher.fullname = `${teacher.lastname} ${teacher.firstname}`)));
  }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>('subjects').map((response: any) => response.data);
  }

  getClasses(): Observable<Group[]> {
    return this.http.get<Group[]>('classes').map((response: any) => response.data);
  }

  postAttachTeacher(object: AttachedTeacher): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<any>(`teachers/${object.teacherId}/classes/${object.classId}/subjects/${object.subjectId}/journal`, object);
  }
}
