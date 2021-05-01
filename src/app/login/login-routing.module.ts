import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login/login.guard';
import { ShellGuard } from '../shell/shell.guard';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { PasswordComponent } from './password/password.component';

const routes: Routes = [
  {
    path: '',
    canLoad: [LoginGuard],
    canActivate: [LoginGuard],
    component: LoginComponent
  },
  {
    path: 'shell',
    canLoad: [ShellGuard],
    loadChildren: '../shell/shell.module#ShellModule'
  },
  {
    path: 'request-password',
    component: RequestPasswordComponent
  },
  {
    path: 'password',
    component: PasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
