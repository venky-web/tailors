import { Component, OnInit } from '@angular/core';

import { CustomerService } from 'app-services';
import { CustomerModel } from 'app-models';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {

  customers: CustomerModel[];

  constructor(
    private customerService: CustomerService,
  ) { }

  ngOnInit() {
    this.customers = [];
  }

}
