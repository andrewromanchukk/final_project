import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [{
      path: 'admin-panel',
      loadChildren: '../admin-panel/admin-panel.module#AdminPanelModule'
    },
    {
      path: 'journal',
      loadChildren: '../journal/journal.module#JournalModule'
    },
    {
      path: 'progress',
      loadChildren: '../progress/progress.module#ProgressModule'
    },
    {
      path: 'student-book',
      loadChildren: '../student-book/student-book.module#StudentBookModule'
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule { }
