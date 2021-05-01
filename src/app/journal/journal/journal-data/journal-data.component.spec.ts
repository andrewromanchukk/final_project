import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalDataComponent } from './journal-data.component';

describe('JournalDataComponent', () => {
  let component: JournalDataComponent;
  let fixture: ComponentFixture<JournalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
