import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeePage } from './employee.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeePage
  },
  {
    path: ':employeeId',
    loadChildren: () => import('./employee-detail/employee-detail.module').then( m => m.EmployeeDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeePageRoutingModule {}
