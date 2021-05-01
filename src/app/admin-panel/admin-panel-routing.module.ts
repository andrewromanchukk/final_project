import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { StudentsComponent } from './admin-panel/students/students.component';
import { GroupsComponent } from './admin-panel/groups/groups.component';
import { SubjectsComponent } from './admin-panel/subjects/subjects.component';
import { TeachersComponent } from './admin-panel/teachers/teachers.component';
import { ClassScheduleComponent } from './admin-panel/class-schedule/class-schedule.component';
import { AttachTeacherComponent } from './admin-panel/attach-teacher/attach-teacher.component';
import { NewStudyingYearComponent } from '../admin-panel/admin-panel/new-studying-year/new-studying-year.component';
import { AdminGuard } from './admin.guard';
import { DashboardComponent } from './admin-panel/dashboard/dashboard.component';
import { CorrectScheduleComponent } from './admin-panel/correct-schedule/correct-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    canLoad: [AdminGuard],
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'students',
        component: StudentsComponent
      },
      {
        path: 'groups',
        component: GroupsComponent
      },
      {
        path: 'subjects',
        component: SubjectsComponent
      },
      {
        path: 'teachers',
        component: TeachersComponent
      },
      {
        path: 'new-studying-year',
        component: NewStudyingYearComponent
      },
      {
        path: 'class-schedule',
        component: ClassScheduleComponent
			},
			{
        path: 'correct-schedule',
        component: CorrectScheduleComponent
      },
      {
        path: 'attach-teacher',
        component: AttachTeacherComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
