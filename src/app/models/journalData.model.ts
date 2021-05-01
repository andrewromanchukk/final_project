import { Mark } from './journalMark.model';

export class JournalData {
  idStudent: number;
  marks: Mark[];
  studentFullName: string;
  rating: number[];

  constructor(id: number, marks: Mark[], fullName: string) {
    this.idStudent = id;
    this.rating = [0, 0];
    this.marks = marks;
    this.studentFullName = fullName;

  }
}
