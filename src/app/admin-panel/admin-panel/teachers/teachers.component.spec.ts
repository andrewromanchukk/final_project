import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersComponent } from './teachers.component';
import { TeachersService } from 'src/app/services/teachers.service';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { Iteachers } from 'src/app/models/teachers';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {
  FieldsetModule,
  DialogModule,
  InputTextModule,
  InputMaskModule,
  CalendarModule
} from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

describe('TeachersComponent', () => {
  let component: TeachersComponent;
  let fixture: ComponentFixture<TeachersComponent>;
  let teachersService: TeachersService;
  let spy: jasmine.Spy;
  const mockTeachers: Iteachers[] = [
    {
      firstname: 'Михайло',
      lastname: 'Грушевський',
      patronymic: 'Сергійович',
      dateOfBirth: '1866-09-29',
      id: 0,
      email: 'grush@gmail.com',
      avatar: 'avatar2',
      login: 'grush1',
      phone: '0509754632',
      newPass: '',
      oldPass: ''
    },
    {
      firstname: 'Іван',
      lastname: 'Франко',
      patronymic: 'Якимович',
      dateOfBirth: '1856-08-27',
      id: 1,
      email: 'franko@gmail.com',
      avatar: 'avatar1',
      login: 'grush1',
      phone: '0973159560',
      newPass: '',
      oldPass: ''
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TableModule,
        ButtonModule,
        FieldsetModule,
        DialogModule,
        InputTextModule,
        InputMaskModule,
        CalendarModule,
        FormsModule
      ],
      declarations: [TeachersComponent],
      providers: [TeachersService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersComponent);
    component = fixture.componentInstance;
    teachersService = fixture.debugElement.injector.get(TeachersService);
    spy = spyOn(teachersService, 'getTeachers').and.returnValue(
      Observable.of(mockTeachers)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call teachers service', () => {
    component.ngOnInit();
    expect(spy.calls.any()).toBeTruthy();
  });
  it('should set teachers', () => {
    component.ngOnInit();
    expect(component.teachers).toBeTruthy(mockTeachers);
  });
});
