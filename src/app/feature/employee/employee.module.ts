import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeePageRoutingModule } from './employee-routing.module';

import { EmployeePage } from './employee.page';
import { EmployeeAddComponent } from './employee-add/employee-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EmployeePageRoutingModule
  ],
  declarations: [EmployeePage, EmployeeAddComponent],
})
export class EmployeePageModule {}
