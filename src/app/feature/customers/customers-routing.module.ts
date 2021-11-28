import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersPage } from './customers.page';

const routes: Routes = [
  {
    path: '',
    component: CustomersPage
  },
  {
    path: ':customerId',
    loadChildren: () => import('./customer-detail/customer-detail.module').then( m => m.CustomerDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersPageRoutingModule {}
