import { TestBed } from '@angular/core/testing';

import { DataSharingService } from './data-sharing.service';
import { Subject } from 'rxjs';

describe('DataSharingService', () => {

  let service: DataSharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(DataSharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created showToasts', () => {
    expect(service.showToasts).toEqual(new Subject<Object>());
  });

  it('should be call notify', () => {
    expect(service.notify('success', 'Успішно виконано', 'Прив\'язку вчителя до журналу'))
      .toEqual(service.showToasts.next({
        severity: 'success',
        summary: 'Успішно виконано',
        detail: 'Прив\'язку вчителя до журналу'
      }));
  });

});
