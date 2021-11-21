import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BaseLayoutPageRoutingModule } from './base-layout-routing.module';

import { BaseLayoutPage } from './base-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BaseLayoutPageRoutingModule
  ],
  declarations: [BaseLayoutPage]
})
export class BaseLayoutPageModule {}
