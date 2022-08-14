import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TableModule } from 'primeng/table';

import { VendorsPageRoutingModule } from './vendors-routing.module';

import { VendorsPage } from './vendors.page';
import { AddVendorPopupComponent } from './add-vendor-popup/add-vendor-popup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TableModule,
    VendorsPageRoutingModule
  ],
  declarations: [VendorsPage, AddVendorPopupComponent]
})
export class VendorsPageModule {}
