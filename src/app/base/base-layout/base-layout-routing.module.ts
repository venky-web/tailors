import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseLayoutPage } from './base-layout.page';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseLayoutPageRoutingModule {}
