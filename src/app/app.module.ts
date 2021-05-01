import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { TokenInterceptorService } from './services/token-interceptor.service';
import { AdmingroupsService } from './services/admingroups.service';
import { AdminSubjectsService } from './services/admin-subjects.service';
import { ClassScheduleService } from './services/class-schedule.service';
import { StudentsService } from './services/admin-students.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginGuard } from './login/login/login.guard';
import { AdminGuard } from './admin-panel/admin.guard';
import { RefreshTokenInterceptorService } from './services/refresh-token-interceptor.service';
import { ShellGuard } from './shell/shell.guard';
import { TeachersService } from './services/teachers.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    AdmingroupsService,
    AdminSubjectsService,
    StudentsService,
    LoginGuard,
    ClassScheduleService,
    AdminGuard,
    ShellGuard,
    TeachersService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
