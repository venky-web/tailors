import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { BaseLayoutPage } from './base';
import { AuthGuard } from 'app-services';

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
        loadChildren: () => import('./feature/home/home.module').then( m => m.HomePageModule),
        // canLoad: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./feature/dashboard/dashboard.module').then( m => m.DashboardPageModule),
        // canLoad: [AuthGuard]
      },
      {
        path: 'customers',
        loadChildren: () => import('./feature/customers/customers.module').then( m => m.CustomersPageModule),
        // canLoad: [AuthGuard]
      },
      {
        path: 'emp',
        loadChildren: () => import('./feature/employee/employee.module').then( m => m.EmployeePageModule),
        // canLoad: [AuthGuard]
      },
      {
        path: 'orders',
        loadChildren: () => import('./feature/orders/orders.module').then( m => m.OrdersPageModule),
        // canLoad: [AuthGuard]
      },
      {
        path: 'account',
        loadChildren: () => import('./feature/account/account.module').then( m => m.AccountPageModule),
        // canLoad: [AuthGuard]
      },
      {
        path: 'requests',
        loadChildren: () => import('./feature/requests/requests.module').then( m => m.RequestsPageModule),
        // canLoad: [AuthGuard]
      },
      {
        path: 'products',
        loadChildren: () => import('./feature/products/products.module').then( m => m.ProductsPageModule),
        // canLoad: [AuthGuard]
      },
      {
        path: 'services',
        loadChildren: () => import('./feature/services/services.module').then( m => m.ServicesPageModule),
        // canLoad: [AuthGuard]
      },
      {
        path: 'vendors',
        loadChildren: () => import('./feature/vendors/vendors.module').then( m => m.VendorsPageModule),
        // canLoad: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
