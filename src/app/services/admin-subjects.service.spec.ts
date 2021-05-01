import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AdminSubjectsService } from './admin-subjects.service';
import { Subject } from '../models/subjects.model';

describe('AdminSubjectsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminSubjectsService]
    })
  );

  const subjects: Subject[] = [
    {
      subjectName: 'Математика',
      subjectDescription: 'Цариця наук',
      subjectId: 1
    },
    {
      subjectName: 'Фізика',
      subjectDescription: 'Це цікава штука',
      subjectId: 2
    }
  ];

  it('should be created', () => {
    const service: AdminSubjectsService = TestBed.get(AdminSubjectsService);
    expect(service).toBeTruthy();
  });

  it('should return subjects array', inject(
    [AdminSubjectsService, HttpTestingController],
    (service: AdminSubjectsService, backend: HttpTestingController) => {
      service.getSubjectsList().subscribe(items => {
        expect(items).toEqual(subjects);
      });

      backend
        .expectOne({
          method: 'GET',
          url: 'subjects'
        })
        .flush({ data: subjects });
    }
  ));

  it('should return created subject', inject(
    [AdminSubjectsService, HttpTestingController],
    (service: AdminSubjectsService, backend: HttpTestingController) => {
      service.postSubject(subjects[0]).subscribe(item => {
        expect(item).toEqual(subjects[0]);
      });

      backend
        .expectOne({
          method: 'POST',
          url: 'subjects'
        })
        .flush({ data: subjects[0] });
    }
  ));

  it('should return updated subject', inject(
    [AdminSubjectsService, HttpTestingController],
    (service: AdminSubjectsService, backend: HttpTestingController) => {
      service.putSubject(subjects[0]).subscribe(item => {
        expect(item).toEqual(subjects[0]);
      });

      backend
        .expectOne({
          method: 'PUT',
          url: 'subjects/' + subjects[0].subjectId
        })
        .flush({ data: subjects[0] });
    }
  ));
});
