import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdmingroupsService } from './admingroups.service';
import { Group } from '../models/group.model';


const mockGroups: Group[] = [
  {
    id: 1,
    className: '7-Б',
    classYear: 2018,
    classDescription: null,
    isActive: true,
    numOfStudents: 5
  },
  {
    id: 11,
    className: '11-Б',
    classYear: 2019,
    classDescription: 'Гуманітарний',
    isActive: false,
    numOfStudents: 15
  },
  {
    id: null,
    className: '10-Б',
    classYear: 2017,
    classDescription: 'Гуманітарний',
    isActive: false,
    numOfStudents: 15
  },
];

describe('AdmingroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [AdmingroupsService]
  }));

  it('should be created', inject(
    [AdmingroupsService], (service: AdmingroupsService) => {
      expect(service).toBeTruthy();
    }));

  it('should get all groups', inject(
    [AdmingroupsService, HttpTestingController],
    (service: AdmingroupsService, backend: HttpTestingController) => {
      service.getClasses().subscribe(groups => {
        expect(groups).toEqual(mockGroups);
      });
      backend.expectOne({
        method: 'GET',
        url: 'classes'
      })
        .flush({ data: mockGroups });
    }
  ));

  it('should create the group', inject(
    [AdmingroupsService, HttpTestingController],
    (service: AdmingroupsService, backend: HttpTestingController) => {
      service.saveClass(mockGroups[2]).subscribe(groups => {
        expect(groups).toEqual(mockGroups[2]);
      });
      backend
        .expectOne({
          method: 'POST',
          url: 'classes'
        })
        .flush({ data: mockGroups[2] });
    }
  ));

  it('should update the group', inject(
    [AdmingroupsService, HttpTestingController],
    (service: AdmingroupsService,
      backend: HttpTestingController) => {
      service.saveClass(mockGroups[1]).subscribe(groups => {
        expect(groups).toEqual(mockGroups[1]);
      });
      backend
        .expectOne({
          method: 'PUT',
          url: 'classes/11'
        })
        .flush({ data: mockGroups[1] });
    }
  ));
});
