import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalRoutingModule } from './journal-routing.module';
import { JournalComponent } from './journal/journal.component';
import { MenuComponent } from './journal/menu/menu.component';
import { HometaskComponent } from './journal/hometask/hometask.component';
import { FormsModule } from '@angular/forms';

import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/primeng';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { JournalDataComponent } from './journal/journal-data/journal-data.component';

@NgModule({
  imports: [
    CommonModule,
    JournalRoutingModule,
    ToolbarModule,
    DropdownModule,
    FormsModule,
    DataViewModule,
    TableModule,
    InputMaskModule,
    CheckboxModule,
    ContextMenuModule,
    InputTextareaModule,
    DialogModule,
    TooltipModule,
    ToastModule,
    ButtonModule
  ],
  declarations: [
    JournalComponent,
    MenuComponent,
    HometaskComponent,
    JournalDataComponent
  ]
})
export class JournalModule {}
