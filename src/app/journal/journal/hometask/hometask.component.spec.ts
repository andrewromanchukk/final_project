import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HometaskComponent } from './hometask.component';

describe('HometaskComponent', () => {
  let component: HometaskComponent;
  let fixture: ComponentFixture<HometaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HometaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HometaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
