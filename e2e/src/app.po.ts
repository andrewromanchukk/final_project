import { browser, by, element, $ } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return $('app-root h1').getText();
  }
  getEnterButton() {
    return $('.ui-button-rounded');
  }
  userName() {
    return element(by.name('userName'));
  }
  password() {
    return element(by.name('password'));
  }
  allFields() {
    return element.all(by.tagName('input'));
  }
  loginError() {
    return element(by.css('.login-error')).getText();
  }
  dashBoard() {
    return element.all(by.css('.overview-subinfo'));
  }
  checkStudents() {
    return element(by.css('[routerLink="students"]'));
  }
  isActiveStudents() {
    return element.all(by.css('.animation-style')).first();
  }
  tableUsers() {
    return element.all(by.css('p-table'));
  }
  goHome() {
    return element(by.css('.fa-home'));
  }
  checkTeachers() {
    return element(by.css('[routerLink="teachers"]'));
  }
  checkCreate() {
    return element.all(by.css('.ui-clickable')).last();
  }
  closeModal() {
    return element.all(by.css('.pi-times')).last();
  }
  menuItem() {
    return element.all(by.css('.ui-menuitem-text'));
  }
  showClasses() {
    return element(by.css('.btn'));
  }
  checkSelects() {
    return element.all(by.css('p-dropdown'));
  }
  checkFields() {
    return element.all(by.css('p-fieldset'));
  }
  attachTeacher() {
    return element.all(by.css('p-autoComplete'));
  }
  userInfo() {
    return element(by.css('.fa-user'));
  }
  logOut() {
    return element(by.css('.pi-sign-out'));
  }
  journal() {
    return element.all(by.css('.ui-toolbar'));
  }
  dropDown() {
    return element.all(by.css('.ui-dropdown-label'));
  }
  dropLis() {
    return element.all(by.css('.ui-dropdown-item'));
  }
  dwnlJournal() {
    return element(by.css('p-button'));
  }
  scheduleStudent() {
    return element.all(by.css('.ui-table-wrapper'));
  }
  verticalList() {
    return element(by.css('.pi-list'));
  }
}
