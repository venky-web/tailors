import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { BaseLayoutPage } from './base';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./base/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: '',
    component: BaseLayoutPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./feature/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./feature/dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'customers',
        loadChildren: () => import('./feature/customers/customers.module').then( m => m.CustomersPageModule)
      },
      {
        path: 'emp',
        loadChildren: () => import('./feature/employee/employee.module').then( m => m.EmployeePageModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./feature/orders/orders.module').then( m => m.OrdersPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
