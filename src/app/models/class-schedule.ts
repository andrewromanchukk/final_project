import { Group } from 'src/app/models/group.model';
import { Subject } from 'src/app/models/subjects.model';

export class Schedule {
  classId: number;
  className: Group;

  startOfSemester: string;
  endOfSemester: string;

  mondaySubjects: Subject[];
  tuesdaySubjects: Subject[];
  wednesdaySubjects: Subject[];
  thursdaySubjects: Subject[];
  fridaySubjects: Subject[];
  saturdaySubjects: Subject[];

  constructor() {
    this.mondaySubjects = [new Subject(-1, '')];
    this.tuesdaySubjects = [new Subject(-1, '')];
    this.wednesdaySubjects = [new Subject(-1, '')];
    this.thursdaySubjects = [new Subject(-1, '')];
    this.fridaySubjects = [new Subject(-1, '')];
    this.saturdaySubjects = [new Subject(-1, '')];
  }
}
