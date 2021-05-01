import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { StudentBookRoutingModule } from './student-book-routing.module';
import { StudentBookComponent } from './student-book/student-book.component';
import { StudentBookService } from '../services/student-book-services/student-book.service';

@NgModule({
  imports: [
    CommonModule,
    StudentBookRoutingModule,
    TableModule,
    ButtonModule,
    FontAwesomeModule,
    SelectButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule
  ],
  providers: [StudentBookService],
  declarations: [StudentBookComponent]
})
export class StudentBookModule {}
