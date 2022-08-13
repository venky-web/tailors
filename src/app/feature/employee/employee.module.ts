import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TableModule } from 'primeng/table';

import { EmployeePageRoutingModule } from './employee-routing.module';
import { EmployeePage } from './employee.page';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { AddEmployeePopupComponent } from './add-employee-popup/add-employee-popup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TableModule,
    EmployeePageRoutingModule
  ],
  declarations: [EmployeePage, EmployeeAddComponent, AddEmployeePopupComponent],
})
export class EmployeePageModule {}
