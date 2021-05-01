import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarksService {
  constructor(private http: HttpClient) {}

  public getMarks(
    start: string,
    end: string,
    subject_id: number,
    class_id: number,
    student_id: number
  ): Observable<any[]> {
    return this.http
      .get<any>(
        `marks?student_id=${student_id}&class_id=${class_id}&subject_id=${subject_id}
    &period_start=${start}&period_end=${end}`
      )
      .map(response => response.data);
  }

  public getAvgMarks(
    student_id: number,
    start: string,
    end: string
  ): Observable<any[]> {
    return this.http
      .get<any>(
        `marks/avg?student_id=${student_id}&period_start=${start}&period_end=${end}`
      )
      .map(response => response.data);
  }
}
