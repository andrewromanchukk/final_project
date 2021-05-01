import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/students.model';
import { Classes } from '../models/classesForStudents.model';
import { Observable } from 'rxjs';

@Injectable()
export class StudentsService {

  constructor(private http: HttpClient) { }

  public getClasses(): Observable<Classes[]> {
    return this.http.get<Classes[]>('classes').map((response: any) => {
      return response.data;
    });
  }

  public getStudents(idClass): Observable<Student[]> {
    return this.http.get<Student[]>('students/classes/' + idClass).map((response: any) => {
      return response.data;
    });
  }

  public getStudent(idStudent): Observable<Student> {
    return this.http.get<Student>('students/' + idStudent).map((response: any) => {
      return response.data;
    });
  }

  public addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>('students', student).map((response: any) => {
      return response.data;
    });
  }

  public changeStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`/admin/students/${student.id}`, student).map((response: any) => {
      return response.data;
    });
  }

  public deleteStudent(student: Student): Observable<Student> {
    return this.http.patch<Student>(`/users/${student.id}`, student).map((response: any) => {
      return response.data;
    });
  }

  public sendStudentsData(currentClassId): Observable<Student[]> {
    return this.http.get<Student[]>(`/users/credentials/students?classId=${currentClassId}`).map((response: any) => {
      return response.data;
    });
  }

  public checkStudentLogin(student: Student): Observable<Student> {
    return this.http.head<Student>(`/users/login/${student.login}/`);
  }
}
