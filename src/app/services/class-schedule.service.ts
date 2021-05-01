import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule } from '../models/class-schedule';
import { Group } from '../models/group.model';
import { Subject } from '../models/subjects.model';

@Injectable({
  providedIn: 'root'
})
export class ClassScheduleService {
  constructor(private http: HttpClient) {}

  public getClasses(): Observable<Group[]> {
    return this.http.get<Group[]>('classes').map((response: any) => {
      response.data.forEach(item => {
        item.label = item.className;
        item.value = item.id;
      });
      return response.data;
    });
  }

  public getScheduleSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>('subjects').map((response: any) => {
      response.data.forEach(item => {
        item.label = item.subjectName;
        item.value = item.subjectId;
      });
      return response.data;
    });
  }

  public postSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http
      .post<Schedule>(
        'classes/' + schedule.className.id + '/schedule',
        schedule
      )
      .map((response: any) => {
        return response.data;
      });
  }

  public getSchedule(classId: number): Observable<Schedule> {
    return this.http
      .get<Schedule>('classes/' + classId + '/schedule')
      .map((response: any) => {
        return response.data;
      });
  }
}
