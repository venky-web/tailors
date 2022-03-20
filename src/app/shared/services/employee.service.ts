/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

import { environment } from "src/environments/environment";
import { CommonService } from "./common.service";


@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    envKeys: any;

    private eList: BehaviorSubject<any[]> = new BehaviorSubject([]);

    get employeeList() {
        return this.eList.asObservable();
    }

    constructor(
        private http: HttpClient,
        private commonService: CommonService,
    ) {
        this.envKeys = environment;
    }

    updateEmployeeList(employeeList: any[]) {
        this.eList.next(employeeList);
    }

    getEmployeeList() {}

    getEmployee() {}

    addEmployee(newEmployee: any) {
        return this.http.post(`${this.commonService.accountServiceUrl}`, newEmployee);
    }

    updateEmployeeDetails() {}

    deleteEmployee() {}

}
