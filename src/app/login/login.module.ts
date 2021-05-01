import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { PasswordComponent } from './password/password.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    TabMenuModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    ToolbarModule,
    FormsModule,
    ToastModule,
  ],
  declarations: [LoginComponent, RequestPasswordComponent, PasswordComponent],
  providers: [MessageService]
})
export class LoginModule { }
