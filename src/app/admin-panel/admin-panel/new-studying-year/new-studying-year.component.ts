import { Component, OnInit } from '@angular/core';
import { NewStudyingYearService } from 'src/app/services/new-studying-year.service';
import { ClassId } from 'src/app/models/classId.model';
import {
  Transition,
  SmallGroup
} from 'src/app/models/transitional-studing.model';
import { Group } from 'src/app/models/group.model';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { PageTitleService } from '../../../services/pageTitle.service';

@Component({
  selector: 'app-new-studying-year',
  templateUrl: './new-studying-year.component.html',
  styleUrls: ['./new-studying-year.component.scss'],
  providers: [PageTitleService]
})

export class NewStudyingYearComponent implements OnInit {
  groupList: Group[];
  newGroupList: Group[];
  activeGroups: Group[];
  newActiveGroups: Group[];
  cols: Array<object>;
  disableButtonCreateTransition = false;
  hideTag = false;
  classIdArray: Array<ClassId> = [];
  classIdArrayBefore: Array<ClassId> = [];
  allGroupsList: Array<Transition> = [];
  groupDigitsArray: Array<number> = [];
  numOfStudentsArray: Array<number> = [];
  checkedNumOfStudentsArray: Array<number> = [];
  counter: number;
  val = true;
  groupsExistArray: Array<SmallGroup> = [];
  isCurrentStudingYear: Array<boolean> = [];
  checkboxStateArray: Array<boolean> = [];
  loading: boolean;
  checkboxDisabled = false;
  studingCircle = 11;
  currentYear: number;
  arrayLength: number;
  counterId = 0;
  booleanAfterChecking: boolean;
  checkedGroupsExistArray: Array<SmallGroup> = [];
  messageCounter = 0;

  constructor(
    private httpService: NewStudyingYearService,
    private notificationToasts: DataSharingService,
    private pageTitle: PageTitleService
  ) {}

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Новий Навчальний Рік');
    this.loading = true;
    this.getGroupList();
  }

  getGroupList() {
    this.httpService.getGroups().subscribe(data => {
      this.groupList = data;
      this.filterGroups();
      this.checkStudingYearAndCreateMessage();
      this.checkNumOfStudentsAndCreate();
      this.checkGroupsExisting();
      this.loading = false;
    },
      err => {
        this.showErrorMessage();
        this.loading = false;
      }
    );
    this.cols = [
      {
        classNameField: 'className',
        classYearField: 'classYear',
        newClassNameField: 'newClassName',
        newClassYearField: 'newClassYear',
        checkboxField: 'checkbox',
        colorStyleField: 'colorStyle',
        iconStyleField: 'icon',
        counterIdField: 'counterId'
      }
    ];
  }

  showErrorMessage() {
    this.notificationToasts.notify(
      'error',
      'Відхилено',
      'Неможливо загрузити перелік класів',
      true
    );
  }

  filterGroups() {
    this.activeGroups = this.groupList.filter(g => g.isActive)
      .sort((gr1, gr2) => parseInt(gr1.className, 10) - parseInt(gr2.className, 10));
    this.activeGroups.forEach(item => {
      this.allGroupsList.push({
        oldClassId: item.id,
        className: item.className,
        classYear: item.classYear,
        isActive: item.isActive,
        numOfStudents: item.numOfStudents,
        newClassId: null,
        newClassName: null,
        newClassYear: null,
        checkbox: true,
        colorStyle: null,
        icon: null,
        counterId: this.counterId++
      });
    });
    this.allGroupsList.forEach(item => {
      if (item.className.includes('(')) {
        this.groupDigitsArray.push(parseInt(item.className, 10 ) + 4);
      } else {
        this.groupDigitsArray.push(parseInt(item.className, 10));
      }
    });
  }

  transitionToTheNewStudingYear() {
    this.loading = true;
    this.filterFalseCheckedGroups();
    this.httpService.putNewOldId(this.classIdArrayBefore).subscribe(() => {
      this.createGroupsListWithNewNameAndYear();
      this.httpService.postNewGroups(this.groupsExistArray).subscribe(data => {
        this.newGroupList = data;
        this.filterNewGroups();
        this.passOldAndNewId();
        this.httpService.putNewOldId(this.classIdArray).subscribe(() => {
          this.hideTag = true;
          this.attachSuccesIcon();
          this.disableButtonCreateTransition = true;
          this.checkboxDisabled = true;
          this.loading = false;
          this.notificationToasts.notify(
            'success',
            'Успішно виконано',
            'Перехід на новий навчальний рік'
          );
        });
      });
    });
  }

  filterFalseCheckedGroups() {
    this.allGroupsList.forEach(item => {
      if (item.checkbox !== true) {
        item.newClassName = 'Не діючий';
        item.newClassYear = item.classYear + 1;
        item.colorStyle = '#a9a39e';
        this.classIdArrayBefore.push({
          oldClassId: item.oldClassId,
          newClassId: 0
        });
      }
    });
  }

  filterNewGroups() {
    this.newActiveGroups = this.newGroupList.filter(gr => gr.isActive);
    let counter = 0;
    this.allGroupsList.forEach((item, i) => {
      if (item.checkbox === true) {
        if (this.groupDigitsArray[i] > this.studingCircle - 1) {
          item.newClassName = 'Випущений';
          item.newClassId = 0;
          item.newClassYear = item.classYear;
          item.colorStyle = '#ff9c33';
        } else {
          item.newClassName = this.newActiveGroups[counter].className;
          item.newClassId = this.newActiveGroups[counter].id;
          item.newClassYear = this.newActiveGroups[counter].classYear;
          counter++;
        }
      }
    });
  }

  passOldAndNewId() {
    this.allGroupsList.forEach(item => {
      if (item.checkbox === true) {
        this.classIdArray.push({
          oldClassId: item.oldClassId,
          newClassId: item.newClassId
        });
      }
    });
  }

  setMainCheckbox(val: boolean) {
    this.allGroupsList.forEach( (item, i) => {
      item.checkbox = val;
      this.attachAndHideIcons(i);
    });
    this.setButtonTransition();
  }

  checkNumOfStudentsAndCreate() {
    this.allGroupsList.forEach(item =>
      this.numOfStudentsArray.push(item.numOfStudents)
    );
    if (this.numOfStudentsArray.includes(0)) {
      this.disableButtonCreateTransition = true;
      this.notificationToasts.notify(
        'error',
        'Відхилено',
        'В даному переліку класів є такі, ' +
          'в яких немає жодного учня. Будь ласка, додайте хоча б одного учня до класу або видаліть ' +
          'такий клас з переліку активних',
        true
      );
      this.attachIconForGroupsWithoutStudents();
    }
  }

  checkGroupsExisting() {
    this.checkGroupsListWithNewNameAndYear();
    this.groupList.forEach( item => {
      this.groupsExistArray.forEach( (item2, i) => {
        if (
          item.className === item2.className &&
          item.classYear === item2.classYear
        ) {
          this.disableButtonCreateTransition = true;
          this.allGroupsList[i].icon = 'pi pi-minus-circle';
          this.giveOnlyOneMessage();
        }
      });
    });
  }

  giveOnlyOneMessage() {
    this.messageCounter++;
    if (this.messageCounter === 1) {
      this.notificationToasts.notify(
        'error',
        'Відхилено',
        'В даному переліку класів є такі, ' +
          'які перейшли на новий навчальний рік раніше.',
        true
      );
    }
  }

  checkStudingYearAndCreateMessage() {
    this.allGroupsList.forEach(item =>
      this.isCurrentStudingYear.push(
        item.classYear === this.allGroupsList[0].classYear
      )
    );
    if (this.isCurrentStudingYear.includes(false)) {
      this.notificationToasts.notify(
        'warn',
        'Попередження',
        'В даному переліку класів є такі, ' +
          'які відносяться до різних навчальних років',
        true
      );
    }

    this.attachIconForDifferentYears();
  }

  setSubordinatedCheckbox(arrayLength: number) {
    this.checkboxStateArray = [];
    this.allGroupsList.forEach( item =>
      this.checkboxStateArray.push(item.checkbox)
    );
    this.setMainCheckboxBehavior();
    this.attachAndHideIcons(arrayLength);
    this.setButtonTransition();
  }

  setMainCheckboxBehavior() {
    function allAreTrue(value: boolean) {
      return value === true;
    }

    function allAreFalse(value: boolean) {
      return value === false;
    }

    if (this.checkboxStateArray.every(allAreTrue)) {
      this.val = true;
    } else if (this.checkboxStateArray.every(allAreFalse)) {
      this.val = false;
    }
  }

  transitAllExistingGroups() {
    this.createGroupsListWithNewNameAndYear();
  }

  createGroupsListWithNewNameAndYear() {
    this.groupsExistArray = [];
    this.allGroupsList.forEach((item, i) => {
      if (this.groupDigitsArray[i] < this.studingCircle) {
        this.imageGroupsListWithNewNameAndYear(item);
      }
    });
  }

  checkGroupsListWithNewNameAndYear() {
    this.groupsExistArray = [];
    this.allGroupsList.forEach( item => {
      this.imageGroupsListWithNewNameAndYear(item);
    });
  }

  imageGroupsListWithNewNameAndYear( item: Transition ) {
    if ( item.checkbox === true ) {
      if ( item.className.includes('(')) {
        this.groupsExistArray.push({
          className: [
            ( parseInt( item.className, 10 ) + 1).toString().concat( '(' )
            .concat( parseInt( item.className, 10) + 5 + ')' ),
            item.className.split('-')[1]
          ].join('-'),
            classYear: item.classYear + 1
        });
      } else {
        this.groupsExistArray.push({
          className: [
            parseInt(item.className, 10) + 1,
            item.className.split('-')[1]
          ].join('-'),
          classYear: item.classYear + 1
        });
      }
    }
    this.takeDashAway();
  }

  takeDashAway() {
    this.groupsExistArray.forEach( item2 => {
      if (item2.className.slice(-1) === '-') {
        item2.className = item2.className.replace('-', '');
      }
    });
  }

  attachIconForDifferentYears() {
    this.currentYear = new Date().getFullYear();
    this.allGroupsList.forEach( item => {
      if (item.classYear !== this.currentYear - 1) {
        item.icon = 'pi pi-exclamation-triangle';
      }
    });
  }

  attachIconForGroupsWithoutStudents() {
    this.allGroupsList.forEach( item => {
      if (item.numOfStudents === 0) {
        item.icon = 'pi pi-times-circle';
      }
    });
  }

  attachSuccesIcon() {
    this.allGroupsList.forEach( item => {
      if (item.checkbox === true) {
        item.icon = 'pi pi-check-circle';
      }
    });
  }

  attachAndHideIcons(arrayLength: number) {
    if (this.allGroupsList[arrayLength].checkbox === false) {
      this.allGroupsList[arrayLength].icon = null;
    } else {
      if (this.allGroupsList[arrayLength].classYear !== this.currentYear - 1) {
        this.allGroupsList[arrayLength].icon = 'pi pi-exclamation-triangle';
      }
      if (this.allGroupsList[arrayLength].numOfStudents === 0) {
        this.allGroupsList[arrayLength].icon = 'pi pi-times-circle';
      }
      this.groupList.forEach( item => {
        if (
          this.groupsExistArray[arrayLength].className === item.className &&
          this.groupsExistArray[arrayLength].classYear === item.classYear
        ) {
          this.allGroupsList[arrayLength].icon = 'pi pi-minus-circle';
        }
      });
    }
  }

  returnBooleanAfterCheckingGroupsExisting(): boolean {
    this.booleanAfterChecking = false;
    this.checkedGroupsExistArray = [];
    this.createTrueMarkedGroups();
    this.checkTrueMarkedGroups();
    return this.booleanAfterChecking;
  }

  createTrueMarkedGroups() {
    this.groupsExistArray.forEach( (item, i) => {
      if (this.allGroupsList[i].checkbox === true) {
        this.checkedGroupsExistArray.push({
          className: item.className,
          classYear: item.classYear
        });
      }
    });
  }

  checkTrueMarkedGroups() {
    this.groupList.forEach( item => {
      this.checkedGroupsExistArray.forEach( item2 => {
        if (
          item.className === item2.className &&
          item.classYear === item2.classYear
        ) {
          this.booleanAfterChecking = true;
        }
      });
    });
  }

  returnBooleanAfterCheckingNumOfStudents(): boolean {
    this.booleanAfterChecking = false;
    this.checkedNumOfStudentsArray = [];
    this.numOfStudentsArray.forEach( (item, i) => {
      if (this.allGroupsList[i].checkbox === true) {
        this.checkedNumOfStudentsArray.push(item);
      }
    });
    if (this.checkedNumOfStudentsArray.includes(0)) {
      this.booleanAfterChecking = true;
    }
    return this.booleanAfterChecking;
  }

  setButtonTransition() {
    if (this.returnBooleanAfterCheckingGroupsExisting() ||
      this.returnBooleanAfterCheckingNumOfStudents() ) {
      this.disableButtonCreateTransition = true;
    } else {
      this.disableButtonCreateTransition = false;
    }
  }

}
