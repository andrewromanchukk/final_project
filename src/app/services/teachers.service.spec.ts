import { TestBed, inject } from '@angular/core/testing';
import { TeachersService } from './teachers.service';
import { Iteachers } from '../models/teachers';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

const mockTeachers: Iteachers[] = [
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
    newPass: '',
    oldPass: ''
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
    newPass: '',
    oldPass: ''
  }
];
describe('TeachersService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeachersService]
    })
  );
  it('should be created', inject(
    [TeachersService],
    (service: TeachersService) => {
      expect(service).toBeTruthy();
    }
  ));
  it('should return date', inject(
    [TeachersService],
    (service: TeachersService) => {
      const date = new Date('2018-4-6');
      expect(service.formatDate(date)).toEqual('2018-04-06');
    }
  ));
  it('should get teachers', inject(
    [TeachersService, HttpTestingController],
    (service: TeachersService, backend: HttpTestingController) => {
      service.getTeachers().subscribe(users => {
        expect(users).toEqual(mockTeachers);
      });
      backend
        .expectOne({
          method: 'GET',
          url: 'teachers'
        })
        .flush({ data: mockTeachers });
    }
  ));
  it('should  return the teacher', inject(
    [TeachersService, HttpTestingController],
    (service: TeachersService, backend: HttpTestingController) => {
      service.postTeacher(mockTeachers[0]).subscribe(user => {
        expect(user).toEqual(mockTeachers[0]);
      });
      backend
        .expectOne({
          method: 'POST',
          url: 'teachers'
        })
        .flush({ data: mockTeachers[0] });
    }
  ));
  it('should update the teacher', inject(
    [TeachersService, HttpTestingController],
    (service: TeachersService, backend: HttpTestingController) => {
      service.putTeacher(mockTeachers[0]).subscribe(user => {
        expect(user).toEqual(mockTeachers[0]);
      });
      backend
        .expectOne({
          method: 'PUT',
          url: '/admin/teachers/' + mockTeachers[0].id
        })
        .flush({ data: mockTeachers[0] });
    }
  ));
});
