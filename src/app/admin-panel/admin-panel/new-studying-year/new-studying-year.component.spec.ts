import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStudyingYearComponent } from './new-studying-year.component';

describe('NewStudyingYearComponent', () => {
  let component: NewStudyingYearComponent;
  let fixture: ComponentFixture<NewStudyingYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewStudyingYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStudyingYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
