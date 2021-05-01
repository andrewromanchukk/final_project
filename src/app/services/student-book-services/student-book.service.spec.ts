import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { StudentBookService } from './student-book.service';
import { Diary } from 'src/app/models/student-book-models/Diary.model';
import { WeekSchedule } from 'src/app/models/student-book-models/WeekSchedule.model';

describe('StudentBookService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentBookService]
    })
  );

  const diary: Diary = {
    date: [2018, 12, 3],
    homeWork: 'Домашнє завдання #44, #54',
    homeworkFileId: null,
    lessonId: 8491,
    lessonNumber: '1',
    mark: '6',
    note: '',
    subjectName: 'Математика'
  };

  const sortedArr: WeekSchedule[] = [
    {
      dayDate: new Date('2018-12-3'),
      dayOfWeek: 'Понеділок',
      daySchedule: [diary],
      dayUkrDate: '3 Грудня 2018'
    }
  ];

  it('should be created', inject(
    [StudentBookService],
    (service: StudentBookService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should return string 2018-11-12', inject(
    [StudentBookService],
    (service: StudentBookService) => {
      const date = new Date('2018-11-12');
      expect(service.getFormattedMonday(date)).toEqual('2018-11-12');
    }
  ));

  it('should return string with date in ukrainian', inject(
    [StudentBookService],
    (service: StudentBookService) => {
      expect(service.convertedDate(diary)).toEqual('3 Грудня 2018');
    }
  ));

  it('should return sorted by days of week array arrays', inject(
    [StudentBookService],
    (service: StudentBookService) => {
      expect(service.sortDataByWeekDay([diary])).toEqual(sortedArr);
    }
  ));

  it('should return week schedule', inject(
    [StudentBookService, HttpTestingController],
    (service: StudentBookService, backend: HttpTestingController) => {
      service.getDiariesList(new Date('2018-12-3')).subscribe(schedule => {
        expect(schedule).toEqual([...sortedArr]);
      });

      backend
        .expectOne({
          method: 'GET',
          url: '/diaries?weekStartDate=2018-12-03'
        })
        .flush([diary]);
    }
  ));
});
