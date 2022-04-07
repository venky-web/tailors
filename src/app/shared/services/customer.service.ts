/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment.prod';
import { Customer } from '../models';
import { CommonService } from './common.service';


@Injectable({
  	providedIn: 'root'
})
export class CustomerService {

	_customers: BehaviorSubject<Customer[]> = new BehaviorSubject([]);

	private customersList: Customer[];
	private envKeys: any;

	constructor(
		private http: HttpClient,
		private commonService: CommonService,
	) {
		this.envKeys = environment;
	}

	get customers() {
		return this._customers.asObservable();
	}

	updateCustomers(customers: Customer[]) {
		this.customersList = customers;
		this._customers.next(customers);
	}

	getCustomers() {
		return this.http.get(
            `${this.commonService.accountServiceUrl}business/customers/`
        );
	}

	getCustomerDetails(id: string) {
		return this.http.get<{[key: string]: Customer}>(`${this.envKeys.fireBaseAPI}customers/${id}.json`)
		.pipe(
			tap(resData => {
				console.log(resData);
			})
			// switchMap(resData => {
			// 	const customer = resData[id];
			// })
		);
	}

	addCustomer(customer: Customer) {
		return this.http.post<{name: string}>(`${this.envKeys.fireBaseAPI}customers.json`, customer)
		.pipe(
			take(1)
		);
	}

	updateCustomer(customer: Customer, id: string) {
		return this.http.put<Customer>(`${this.envKeys.fireBaseAPI}customers/${id}.json`, customer)
		.pipe(
			map(resData => {
				const customersData = [...this.customersList];
				const customerIndex = customersData.findIndex((c: Customer) =>
					c.id === id
				);
				customersData[customerIndex] = resData;
				customersData[customerIndex].id = id;
				this.updateCustomers(customersData);
				return customersData as Customer[];
			}),
			tap(resData => {
				this.updateCustomers(resData);
			})
		);
	}

}
