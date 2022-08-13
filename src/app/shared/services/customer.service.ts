/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';


@Injectable({
  	providedIn: 'root'
})
export class CustomerService {

	private env: any;

	constructor(
		private http: HttpClient,
	) {
		this.env = environment;
	}

	getCustomers() {
		return this.http.get(`${this.env.fireBaseAPI}customers.json`);
	}

	getCustomerDetails(id: string) {
		return this.http.get(`${this.env.fireBaseAPI}customers/${id}.json`)
		.pipe(
			take(1)
		);
	}

	addCustomer(customer: any) {
		return this.http.post(`${this.env.fireBaseAPI}customers.json`, customer)
		.pipe(
			take(1)
		);
	}

	updateCustomer(customer: any, id: string) {
		return this.http.put(`${this.env.fireBaseAPI}customers/${id}.json`, customer)
		.pipe(
			take(1)
		);
	}

    deleteCustomer(id: string) {
        return this.http.delete(`${this.env.fireBaseAPI}customers/${id}.json`)
		.pipe(
			take(1)
		);
    }

}
