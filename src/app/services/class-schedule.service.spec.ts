import { TestBed } from '@angular/core/testing';

import { ClassScheduleService } from './class-schedule.service';

describe('ClassScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClassScheduleService = TestBed.get(ClassScheduleService);
    expect(service).toBeTruthy();
  });
});
