import { Diary } from 'src/app/models/student-book-models/Diary.model';

export interface WeekSchedule {
  dayOfWeek: string;
  dayDate: Date;
  dayUkrDate: string;
  daySchedule: Diary[];
}
