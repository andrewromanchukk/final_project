import { Component, OnInit } from '@angular/core';
import { AdmingroupsService } from 'src/app/services/admingroups.service';
import { MarksService } from 'src/app/services/marks.service';
import { AdminSubjectsService } from 'src/app/services/admin-subjects.service';
import { StudentsService } from 'src/app/services/admin-students.service';
import { SelectItem } from 'primeng/api';
import { Group } from '../../../app/models/group.model';
import { Subject } from 'src/app/models/subjects.model';
import { DatePipe, formatDate } from '@angular/common';
import { TeachersService } from 'src/app/services/teachers.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { ChartColor } from 'src/app/models/chartColors';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { PageTitleService } from '../../services/pageTitle.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  providers: [PageTitleService]
})
export class ProgressComponent implements OnInit {
  years: SelectItem[];
  groups: Group[];
  subjects: Subject[];
  classID: number;
  selectedGroups: Group[];
  selectedGroup: Group;
  selectedYear: any;
  selectedDate: Date;
  selectedStudents: any[];
  selectedSubjects: any;
  visibleStudents: SelectItem[];
  visibleSubjects: SelectItem[];
  visibleGroups: Group[];
  start: Date;
  end: Date;
  marks: any;
  disabled = true;
  average: number;
  ua: any;
  avgMark: number[];
  avgMarkAllSubjects: number;
  isButtonDisabled: boolean;
  selectedChartsType = 'student';
  chartMarks: any;

  chartOptions: any;
  defaultDate = new Date();
  color = new ChartColor();
  collectedStudents: any;
  collectedAvgMarks: any;

  constructor(
    private groupService: AdmingroupsService,
    private notificationToasts: DataSharingService,
    private _subjectsService: AdminSubjectsService,
    private studentService: StudentsService,
    private marksService: MarksService,
    private _teacherServices: TeachersService,
    private pageTitle: PageTitleService
  ) {
    this.isButtonDisabled = true;
    this.visibleGroups = new Array<Group>();
    this.visibleStudents = new Array<SelectItem>();
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0
      },
      hover: {
        animationDuration: 0
      },
      responsiveAnimationDuration: 0,
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: true,
              stepValue: 1,
              max: 12
            },
            scaleLabel: {
              display: true,
              labelString: 'Оцінка'
            }
          }
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Період'
            }
          }
        ]
      }
    };
  }

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Статистика');
    this.calendar();

    this.groupService.getClasses().subscribe(data => {
      this.groups = data;
      this.visibleGroups = this.groups.filter(g => g.isActive);
      const allYears = data.map(group => group.classYear);
      const uniqueYears = allYears
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
      this.years = uniqueYears.map(year => ({
        label: year.toString(),
        value: year
      }));
    });
  }

  // writing everage marks to the chartMarks object for each selected student
  setMarksByStudentBySubject(
    servData,
    firstname,
    lastname,
    startDate,
    endDate
  ) {
    const marksData = [];
    let sum = 0;
    let averageMark = 0;
    // count the average mark
    if (servData.length !== 0) {
      servData.forEach((value: any) => {
        sum += value.y;
      });
      averageMark = sum / servData.length;
    }
    marksData.push(averageMark.toFixed(2));

    // saving already loaded datasets into a local variable to update full chartMarks later
    const datasetsLocal = this.chartMarks.datasets;
    datasetsLocal.push({
      label: firstname + ' ' + lastname,
      data: marksData,
      backgroundColor: this.color.getColor(),
      borderColor: 'white'
    });

    // format start and end of period
    const pipe = new DatePipe('en-US');
    startDate = pipe.transform(startDate, 'dd.MM.yyyy');
    endDate = pipe.transform(endDate, 'dd.MM.yyyy');

    // sort average marks to show from the the biggest to the lowest
    const newDatasetsLocal = datasetsLocal.sort(this.sortAverageMarks);

    // fully update chartMarks
    this.chartMarks = {
      labels: [`${startDate} - ${endDate}`],
      datasets: newDatasetsLocal
    };
  }

  sortAverageMarks(b, a) {
    return a.data - b.data;
  }

  // showing toast-message for students who do not have marks
  showToasts(servData, firstname, lastname) {
    if (servData.length === 0) {
      this.notificationToasts.notify(
        'warn',
        '',
        ` Для учня ${firstname} ${lastname} за даний період оцінки відсутні`
      );
    }
  }

  getAverageStudentMark(servData) {
    // find average student mark by subject
    return (
      servData.find(item => item.subjectId === this.selectedSubjects.subjectId)
        .avgMark || 0
    );
  }

  countAverageStudentMark(servData) {
    let sumOfStudentMarks = 0;
    let avrStudentMark = 0;

    // count student average mark
    if (servData.length !== 0) {
      servData.forEach((value: any) => {
        sumOfStudentMarks += value.avgMark;
      });
      avrStudentMark = sumOfStudentMarks / servData.length;
    }
    return avrStudentMark;
  }

  collectStudentMark(avrStudMark, className, startDate, endDate) {
    // push the average student mark to this.collectedAvgMarks object as array element
    if (this.collectedAvgMarks[className] === undefined) {
      this.collectedAvgMarks[className] = [];
    }
    if (avrStudMark !== 0) {
      this.collectedAvgMarks[className].push(avrStudMark.toFixed(2));
    }

    // update chart data after receiving each student data
    this.updateChartWithCollectedData(startDate, endDate);
  }

  countAverageClassMark(marks, className) {
    let avrSum = 0;

    // count average class mark and write it to the object as array
    marks[className].forEach((avgStudMark: any) => {
      avrSum += Number(avgStudMark);
    });
    if (avrSum !== 0) {
      avrSum = avrSum / marks[className].length;
    }
    return [avrSum.toFixed(2)];
  }

  updateChartWithCollectedData(startDate, endDate) {
    const chartData = {};
    Object.keys(this.collectedAvgMarks).forEach((group: any) => {
      chartData[group] = this.countAverageClassMark(
        this.collectedAvgMarks,
        group
      );
    }),
      this.showChart(chartData, startDate, endDate);
  }

  showChart(averageClassMarks, startDate, endDate) {
    const datasetsLocal = [];

    Object.keys(averageClassMarks).forEach((className: any) => {
      datasetsLocal.push({
        label: className,
        data: averageClassMarks[className],
        backgroundColor: this.color.getColor(),
        borderColor: 'white'
      });
    });

    // format start and end of period
    const pipe = new DatePipe('en-US');
    startDate = pipe.transform(startDate, 'dd.MM.yyyy');
    endDate = pipe.transform(endDate, 'dd.MM.yyyy');

    // sort average marks to show from the biggest to the lowest
    const newDatasetsLocal = datasetsLocal.sort(this.sortAverageMarks);

    // fully update chartMarks
    this.chartMarks = {
      labels: [`${startDate} - ${endDate}`],
      datasets: newDatasetsLocal
    };
  }

  onClickShow() {
    const pipe = new DatePipe('en-US');
    const startStr = pipe.transform(this.start, 'yyyy-MM-dd');
    const endStr = pipe.transform(this.end, 'yyyy-MM-dd');

    this.chartMarks = {
      labels: [],
      datasets: []
    };

    // get average marks by selected class and all subjects
    if (this.selectedGroups && !this.selectedSubjects) {
      this.collectedAvgMarks = {};

      // this.collectedStudents an object of studens of selected classes
      Object.keys(this.collectedStudents).forEach((className: any) => {
        this.collectedStudents[className][0].forEach((student: any) => {
          this.marksService
            .getAvgMarks(student.id, startStr, endStr)
            .subscribe(avgStudentMarks => {
              this.collectStudentMark(
                this.countAverageStudentMark(avgStudentMarks),
                className,
                startStr,
                endStr
              );
            });
        });
      });
    }

    // get average marks by selected class and selected subject
    if (this.selectedGroups && this.selectedSubjects) {
      this.collectedAvgMarks = {};

      // this.collectedStudents an object of studens of selected classes
      Object.keys(this.collectedStudents).forEach((className: any) => {
        this.collectedStudents[className][0].forEach((student: any) => {
          this.marksService
            .getAvgMarks(student.id, startStr, endStr)
            .subscribe(avgStudentMarks => {
              this.collectStudentMark(
                this.getAverageStudentMark(avgStudentMarks),
                className,
                startStr,
                endStr
              );
            });
        });
      });
    }

    // getting data for each selected student
    if (this.selectedGroup && this.selectedStudents) {
      this.selectedStudents.forEach((item: any) => {
        this.marksService
          .getMarks(
            startStr,
            endStr,
            this.selectedSubjects.subjectId,
            this.selectedGroup.id,
            item.id
          )
          .subscribe(data => {
            this.setMarksByStudentBySubject(
              data,
              item.firstname,
              item.lastname,
              startStr,
              endStr
            );
            this.showToasts(data, item.firstname, item.lastname);
          });
      });
    }

    if (this.selectedGroup && this.selectedStudents.length === 1) {
      this.marksService
        .getAvgMarks(this.selectedStudents[0].id, startStr, endStr)
        .subscribe(data => {
          this.avgMark = data;
          this.avgMarkAllSubjects = this.StudentAverageMark(
            data.map(mark => mark.avgMark)
          );
          const subject = data.find(
            i => i.subjectId === this.selectedSubjects.subjectId
          );
          this.average = subject ? subject.avgMark : null;
        });
    }
    // reset average marks when selected more than one student
    this.average = null;
    this.avgMarkAllSubjects = null;
  }

  onSubjectChange() {
    this.updateIsButtonDisabled();
  }

  onYearChange() {
    if (this.selectedYear) {
      this.start = new Date(this.selectedYear, 0);
      this.end =
        new Date().getFullYear() === this.selectedYear
          ? new Date()
          : new Date(this.selectedYear, 1);
      this.visibleGroups = this.visibleGroups.filter(
        g => g.classYear === this.selectedYear
      );
    } else {
      this.visibleGroups = new Array<Group>();
      this.start = null;
      this.end = null;
      this.average = null;
      this.avgMarkAllSubjects = null;
    }
    this.selectedGroup = null;
    this.onClassChange();
    this.updateIsButtonDisabled();
  }

  onStudentChange() {
    this.updateIsButtonDisabled();
  }

  // write all subjects into this.visibleSubjects by selected classes
  getSubjects(servData, subjectArr) {
    servData.forEach((value: any) => {
      subjectArr.push(value);
    });

    const subjects = subjectArr.map(function(subject) {
      return {
        label: `${subject.subjectName}`,
        value: subject
      };
    });
    this.visibleSubjects = this.findUniqueSubjects(subjects);
    this.updateIsButtonDisabled();
  }

  getStudents(servData, collectedStudents, className) {
    if (collectedStudents[className] === undefined) {
      collectedStudents[className] = [];
    }
    collectedStudents[className].push(servData);
  }

  // filter array of subjects
  findUniqueSubjects(arr) {
    const result = [];

    nextInput: for (let i = 0; i < arr.length; i++) {
      const obj = arr[i].label;
      for (let j = 0; j < result.length; j++) {
        if (result[j].label === obj) {
          continue nextInput;
        }
      }
      result.push(arr[i]);
    }
    return result;
  }

  onClassChange() {
    if (this.selectedGroup) {
      this._subjectsService
        .getSubjectsListForClass(this.selectedGroup.id)
        .subscribe(data => {
          this.visibleSubjects = data.map(function(subject) {
            return {
              label: `${subject.subjectName}`,
              value: subject
            };
          });
        });
      this.visibleStudents = new Array<SelectItem>();
      this.studentService.getStudents(this.selectedGroup.id).subscribe(data => {
        this.visibleStudents = data.map(function(student) {
          return {
            label: `${student.firstname} ${student.lastname}`,
            value: student
          };
        });
      });
    } else {
      this.visibleStudents = new Array<SelectItem>();
      this.visibleSubjects = null;
    }
    this.selectedStudents = null;
    this.updateIsButtonDisabled();

    if (this.selectedGroups) {
      this.collectedStudents = {};
      const subjects = [];
      // get subjects for each selected group
      this.selectedGroups.forEach((item: any) => {
        this._subjectsService
          .getSubjectsListForClass(item.id)
          .subscribe(data => {
            this.getSubjects(data, subjects);
          });

        // get students of selected classes
        this.studentService.getStudents(item.id).subscribe(data => {
          this.getStudents(data, this.collectedStudents, item.className);
        });
      });
    } else {
      this.visibleStudents = new Array<SelectItem>();
      this.visibleSubjects = null;
    }
    this.selectedStudents = null;
    this.updateIsButtonDisabled();
  }

  onDataReset() {
    this.selectedGroups = null;
    this.selectedGroup = null;
    this.visibleStudents = new Array<SelectItem>();
    this.selectedSubjects = null;
    this.chartMarks = {
      labels: [],
      datasets: []
    };
    this.updateIsButtonDisabled();
  }

  StudentAverageMark(marks): number {
    let summ = 0;
    for (let i = 0; i < marks.length; i++) {
      summ += marks[i];
    }
    return summ / marks.length;
  }

  calendar(): void {
    this._teacherServices.currentCalendar.subscribe(data => (this.ua = data));
  }

  updateIsButtonDisabled() {
    this.isButtonDisabled =
      !(
        this.selectedChartsType === 'class' &&
        this.selectedGroups != null &&
        this.selectedYear != null
      ) &&
      !(
        this.selectedChartsType === 'student' &&
        this.selectedSubjects != null &&
        this.selectedYear != null &&
        this.selectedGroup != null &&
        this.selectedStudents != null
      ) &&
      !(
        this.selectedChartsType === 'class-subject' &&
        this.selectedSubjects != null &&
        this.selectedYear != null &&
        this.selectedGroups != null
      );
  }
}
