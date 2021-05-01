import { TestBed, inject } from '@angular/core/testing';

import { HttpAttachTeacherService } from './http-attach-teacher.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Teacher } from '../models/teacher.model';
import { Subject } from '../models/subjects.model';
import { Group } from '../models/group.model';
import { AttachedTeacher } from '../models/attached-teacher.model';

describe('HttpAttachTeacherService', () => {

  let service: HttpAttachTeacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(HttpAttachTeacherService);
  });

  /**Test created service */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**Test method getTeachers*/
  it('should get teachers', inject([HttpTestingController], (backend: HttpTestingController) => {

    const mockTeachers: Teacher[] = [
      {
        firstname: 'Михайло',
        lastname: 'Грушевський',
        patronymic: 'Сергійович',
        dateOfBirth: '1866-09-29',
        id: 0,
        email: 'grush@gmail.com',
        avatar: 'avatar2',
        login: 'grush1',
        phone: '0509754632',
        fullname: ''
      },
      {
        firstname: 'Іван',
        lastname: 'Франко',
        patronymic: 'Якимович',
        dateOfBirth: '1856-08-27',
        id: 1,
        email: 'franko@gmail.com',
        avatar: 'avatar1',
        login: 'grush1',
        phone: '0973159560',
        fullname: ''
      }
    ];

    service.getTeachers().subscribe(teachers => {
      expect(teachers).toEqual(mockTeachers);
    });

    backend.expectOne({ method: 'GET', url: 'teachers' })
      .flush({ data: mockTeachers });
  }));

  /**Test method getSubjects*/
  it('should get Subjects', inject([HttpTestingController], (backend: HttpTestingController) => {
    const mockSubjects: Subject[] = [
      { subjectName: 'Математика', subjectDescription: 'Цариця наук', subjectId: 1 },
      { subjectName: 'Фізика', subjectDescription: 'Це цікава штука', subjectId: 2 }
    ];

    service.getSubjects().subscribe(subjects => {
      expect(subjects).toEqual(mockSubjects);
    });

    backend.expectOne({ method: 'GET', url: 'subjects' })
      .flush({ data: mockSubjects });
  }));

  /**Test method getClasses */
  it('should get groups', inject([HttpTestingController], (backend: HttpTestingController) => {

    const mockGroups: Group[] = [
      {
        id: 1,
        className: '7-A',
        classYear: 2018,
        classDescription: 'Новий клас',
        isActive: true,
        numOfStudents: 20
      },
      {
        id: 2,
        className: '7-Б',
        classYear: 2018,
        classDescription: 'Розумні діти',
        isActive: true,
        numOfStudents: 25
      }
    ];

    service.getClasses().subscribe(groups => {
      expect(groups).toEqual(mockGroups);
    });

    backend.expectOne({ method: 'GET', url: 'classes' })
      .flush({ data: mockGroups });
  }));

  /**Test method postAttachTeacher */
  it('should post Attach teacher to jornal', inject([HttpTestingController], (backend: HttpTestingController) => {
    const mock: AttachedTeacher = {
      classId: 1,
      subjectId: 1,
      teacherId: 1,
    };

    service.postAttachTeacher(mock).subscribe(data => {
      expect(data).toEqual(mock);
    });

    backend.expectOne({ method: 'POST', url: `teachers/${mock.teacherId}/classes/${mock.classId}/subjects/${mock.subjectId}/journal` })
      .flush(mock);
  }));
});
