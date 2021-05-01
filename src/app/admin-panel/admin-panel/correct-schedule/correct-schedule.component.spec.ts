import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectScheduleComponent } from './correct-schedule.component';

describe('CorrectScheduleComponent', () => {
  let component: CorrectScheduleComponent;
  let fixture: ComponentFixture<CorrectScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrectScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
