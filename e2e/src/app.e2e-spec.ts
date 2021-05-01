import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Вхід до системи');
  });
  it('should display Enter button', () => {
    expect(page.getEnterButton().getText()).toEqual('Вхід');
  });
  it('should be an error message', () => {
    page.userName().sendKeys('Jane');
    page.password().sendKeys('Keen');
    page.getEnterButton().click();
    expect(page.loginError()).toEqual('Ви ввели невірні дані');
  });
  it('should go on admin panel and check dashboard', () => {
    page.allFields().clear();
    page.userName().sendKeys('admin');
    page.password().sendKeys('admin');
    page.getEnterButton().click();
    browser.pause();
    expect(page.dashBoard().count()).toBe(4);
  });
  it('should check students', () => {
    page.checkStudents().click();
    page.isActiveStudents().click();
    browser.pause();
    expect(page.tableUsers().count()).toBe(1);
  });
  it('should redirect to main menu', () => {
    page.goHome().click();
    browser.pause();
    expect(page.dashBoard().count()).toBe(4);
  });
  it('should check teachers', () => {
    page.checkTeachers().click();
    page.checkCreate().click();
    browser.pause();
    page.closeModal().click();
    expect(page.tableUsers().count()).toBe(1);
  });
  it('shold check subjects', () => {
    browser.sleep(1000);
    page
      .menuItem()
      .get(2)
      .click();
    expect(page.tableUsers().count()).toBe(1);
  });
  it('shold check classes', () => {
    page
      .menuItem()
      .get(3)
      .click();
    page.showClasses().click();
    browser.sleep(1000);
    expect(page.tableUsers().count()).toBe(2);
  });
  it('should check schedule of lessons', () => {
    page
      .menuItem()
      .get(4)
      .click();
    page
      .checkSelects()
      .get(3)
      .click();
    expect(page.checkFields().count()).toBe(6);
  });
  it('should check new studing year', () => {
    page
      .menuItem()
      .get(5)
      .click();
    expect(page.tableUsers().count()).toBe(1);
  });
  it('should check attach teacher to journal', () => {
    page
      .menuItem()
      .get(6)
      .click();
    expect(page.attachTeacher().count()).toBe(3);
  });
  it('should log out', () => {
    page.userInfo().click();
    browser.pause();
    page.logOut().click();
    expect(page.getParagraphText()).toEqual('Вхід до системи');
  });
  it('it should check log in teacher', () => {
    page.userName().sendKeys('gBublik23');
    page.password().sendKeys('password');
    page.getEnterButton().click();
    browser.sleep(2000);
    expect(page.journal().count()).toBe(2);
  });
  it('it pick selects', () => {
    page
      .dropDown()
      .get(0)
      .click();
    page
      .dropLis()
      .get(0)
      .click();
    page
      .dropDown()
      .get(1)
      .click();
    page
      .dropLis()
      .get(0)
      .click();
    page.dwnlJournal().click();
    expect(page.journal().count()).toBe(2);
  });
  it('should log out', () => {
    page.userInfo().click();
    browser.pause();
    page.logOut().click();
    expect(page.getParagraphText()).toEqual('Вхід до системи');
  });
  it('should log in student', () => {
    page.userName().sendKeys('zZapukh31');
    page.password().sendKeys('password');
    page.getEnterButton().click();
    browser.pause();
    expect(page.scheduleStudent().count()).toBe(5);
  });
  it('should check vertical schedule', () => {
    page.verticalList().click();
    browser.pause();
    expect(page.scheduleStudent().count()).toBe(5);
  });
  it('should log out', () => {
    page.userInfo().click();
    browser.pause();
    page.logOut().click();
    expect(page.getParagraphText()).toEqual('Вхід до системи');
  });
});
