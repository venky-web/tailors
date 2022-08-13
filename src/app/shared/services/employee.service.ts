/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { take } from "rxjs/operators";

import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    env: any;

    private eList: BehaviorSubject<any[]> = new BehaviorSubject([]);

    get employeeList() {
        return this.eList.asObservable();
    }

    constructor(
        private http: HttpClient,
    ) {
        this.env = environment;
    }

    updateEmployeeList(employeeList: any[]) {
        this.eList.next(employeeList);
    }

    getEmployees() {
		return this.http.get(`${this.env.fireBaseAPI}employees.json`);
	}

    addEmployee(newEmployee: any) {
        // return this.http.post(`${this.commonService.accountServiceUrl}`, newEmployee);
        return this.http.post(`${this.env.fireBaseAPI}employees.json`, newEmployee)
		.pipe(
			take(1)
		);
    }

	getEmployeeDetails(id: string) {
		return this.http.get(`${this.env.fireBaseAPI}employees/${id}.json`)
		.pipe(
			take(1)
		);
	}

    updateEmployeeDetails(employeeData: any, id: string) {
        return this.http.put(`${this.env.fireBaseAPI}employees/${id}.json`, employeeData)
		.pipe(
			take(1)
		);
    }

    deleteEmployee(id: string) {
        return this.http.delete(`${this.env.fireBaseAPI}employees/${id}.json`)
		.pipe(
			take(1)
		);
    }

}
