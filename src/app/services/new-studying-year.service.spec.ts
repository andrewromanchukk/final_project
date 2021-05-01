import { TestBed, inject } from '@angular/core/testing';
import { NewStudyingYearService } from './new-studying-year.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Group } from '../models/group.model';
import { SmallGroup } from '../models/transitional-studing.model';
import { ClassId } from '../models/classId.model';

const mockGroups: Group[] = [
  {
    id: 1,
    className: '6-Б',
    classYear: 2019,
    classDescription: 'Гуманітарний',
    isActive: true,
    numOfStudents: 20,
  }
];

const mockSmallGroup: SmallGroup[] = [
  {
    className: '5-Б',
    classYear: 2019
  }
];

const mockClassId: ClassId[] = [
  {
    oldClassId: 1,
    newClassId: 11
  }
];

describe('NewStudyingYearService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [NewStudyingYearService]
  }));

  it('should be created', inject(
    [NewStudyingYearService],
    (service: NewStudyingYearService) => {
      expect(service).toBeTruthy();
    }));

  it('should get groups', inject(
    [NewStudyingYearService, HttpTestingController],
    (service: NewStudyingYearService, backend: HttpTestingController) => {
      service.getGroups().subscribe(groups => {
        expect(groups).toEqual(mockGroups);
      });
      backend
        .expectOne({
          method: 'GET',
          url: 'classes'
        })
        .flush({ data: mockGroups });
    }
  ));

  it('should return the groups', inject(
    [NewStudyingYearService, HttpTestingController],
    (service: NewStudyingYearService, backend: HttpTestingController) => {
      service.postNewGroups(mockSmallGroup).subscribe(groups => {
        expect(groups).toEqual(mockGroups);
      });
      backend
        .expectOne({
          method: 'POST',
          url: 'students/transition'
        })
        .flush({ data: mockGroups });
    }
  ));

  it('should update the groups', inject(
    [NewStudyingYearService, HttpTestingController],
    (service: NewStudyingYearService, backend: HttpTestingController) => {
      service.putNewOldId(mockClassId).subscribe(groups => {
        expect(groups).toEqual(mockClassId);
      });
      backend
        .expectOne({
          method: 'PUT',
          url: 'students/transition'
        })
        .flush({ data: mockClassId });
    }
  ));

});
