import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment.prod';
import { CustomerModel } from '../models';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  envKeys: any;
  customers: CustomerModel[];

  constructor(
    private http: HttpClient,
  ) {
    this.envKeys = environment;
  }

  getCustomers() {
    return [...this.customers];
  }

  getCustomerDetails(id: string) {
    return this.customers.find((c: CustomerModel) => c.id === id);
  }

  addCustomer(customer: CustomerModel) {
    return this.http.post(`${this.envKeys.fireBaseAPI}customers.json`, customer).pipe();
  }

}
