import { TestBed, inject } from '@angular/core/testing';
import { StudentsService } from './admin-students.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Student } from '../models/students.model';
import { Classes } from '../models/classesForStudents.model';

const mockStudents: Student[] = [
  {
    firstname: 'Степан',
    lastname: 'Когут',
    patronymic: 'Григорійович',
    dateOfBirth: '1998-02-14',
    classId: 0,
    email: null,
    phone: null,
    login: 'sKohyt14',
    id: 141,
    oldPass: null,
    newPass: null,
    avatar: null
  },
  {
    firstname: 'Зеновій',
    lastname: 'Запухляк',
    patronymic: 'Віталійович',
    dateOfBirth: '1999-12-31',
    classId: 0,
    email: null,
    phone: null,
    login: 'zZapukh31',
    id: 151,
    oldPass: null,
    newPass: null,
    avatar: null
  },
  {
    firstname: 'Тетяна',
    lastname: 'Куца',
    patronymic: 'Орестівна',
    dateOfBirth: '1999-12-01',
    classId: 0,
    email: null,
    phone: null,
    login: 'tKutsa01',
    id: 161,
    oldPass: null,
    newPass: null,
    avatar: null
  }
];

describe('StudentsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentsService]
    })
  );

  it('should be created', () => {
    const service: StudentsService = TestBed.get(StudentsService);
    expect(service).toBeTruthy();
  });

  it('should get all students from class', inject(
    [StudentsService, HttpTestingController],
    (service: StudentsService, backend: HttpTestingController) => {
      service.getStudents(1).subscribe(students => {
        expect(students).toEqual(mockStudents);
      });
      backend.expectOne({
        method: 'GET',
        url: 'students/classes/1'
      }).flush({data: mockStudents});
  }));


  it('should get one student', inject(
    [StudentsService, HttpTestingController],
    (service: StudentsService, backend: HttpTestingController) => {
      service.getStudent(141).subscribe(student => {
        expect(student).toEqual(mockStudents[0]);
      });
      backend.expectOne({
        method: 'GET',
        url: 'students/141'
      }).flush({data: mockStudents[0]});
    }));

  it('should put one student', inject(
    [StudentsService, HttpTestingController],
    (service: StudentsService, backend: HttpTestingController) => {
      service.changeStudent(mockStudents[0]).subscribe(student => {
        expect(student).toEqual(mockStudents[0]);
      });
      backend.expectOne({
        method: 'PUT',
        url: '/admin/students/141'
      }).flush({data: mockStudents[0]});
    }));

  it('should return student', inject(
    [StudentsService, HttpTestingController],
    (service: StudentsService, backend: HttpTestingController) => {
      service.addStudent(mockStudents[2]).subscribe(student => {
        expect(student).toEqual(mockStudents[2]);
      });
      backend.expectOne({
        method: 'POST',
        url: 'students'
      }).flush({data: mockStudents[2]});
  }));
});
