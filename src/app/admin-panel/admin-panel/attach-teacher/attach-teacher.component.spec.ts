import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachTeacherComponent } from './attach-teacher.component';

describe('AttachTeacherComponent', () => {
  let component: AttachTeacherComponent;
  let fixture: ComponentFixture<AttachTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
