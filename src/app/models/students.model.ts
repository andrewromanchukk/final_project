export class Student {
  constructor (
    public firstname: string = '',
    public lastname: string = '',
    public patronymic: string = '',
    public classId: number = 0,
    public dateOfBirth: string = '',
    public email: string = '',
    public phone: string = '',
    public login: string = '',
    public id: number = 0,
    public oldPass: string = '',
    public newPass: string = '',
    public avatar: any = 'assets/avatar.png') { }
}
