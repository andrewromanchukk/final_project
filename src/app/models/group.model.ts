export class Group {
  id?: number;
  className: string;
  classYear: number;
  classDescription: string;
  isActive: boolean;
  numOfStudents: number;

  constructor(defaultActive) {
    this.id = null;
    this.className = null;
    this.classYear = null;
    this.classDescription = null;
    this.isActive = defaultActive;
    this.numOfStudents = null;
  }
}
