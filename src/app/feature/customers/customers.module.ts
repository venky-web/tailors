import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TableModule } from 'primeng/table';

import { CustomersPageRoutingModule } from './customers-routing.module';
import { CustomersPage } from './customers.page';
import { AddCustomerComponent } from './add-customer/add-customer.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CustomersPageRoutingModule,
    TableModule,
  ],
  declarations: [CustomersPage, AddCustomerComponent]
})
export class CustomersPageModule {}
