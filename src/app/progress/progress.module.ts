import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';

import { ProgressRoutingModule } from './progress-routing.module';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  imports: [
    CommonModule,
    ProgressRoutingModule,
    DropdownModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    ChartModule,
    MultiSelectModule,
    RadioButtonModule,
    CardModule
  ],
  declarations: [ProgressComponent]
})
export class ProgressModule {}
