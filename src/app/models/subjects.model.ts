export class Subject {
  subjectId?: number;
  subjectName: string;
  subjectDescription: string;
  lessonNumber: number;

  constructor(subjectId?, subjectName?) {
    this.subjectId = subjectId;
    this.subjectName = subjectName;
  }
}
