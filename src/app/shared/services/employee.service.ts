/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

import { IEmployee } from "../models";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    employees: IEmployee[] = [
        {
            name: "Adinolfi, Wilson  K",
            employeeId: 10026,
            gender: "male",
            maritalStatus: "single",
            mobileNumber: "1234512345",
        },
        {
            name: "Alagbe,Trina",
            employeeId: 10088,
            gender: "female",
            maritalStatus: "married",
            mobileNumber: "5555444000",
        },
        {
            name: "Anderson, Linda",
            employeeId: 10002,
            gender: "female",
            maritalStatus: "single",
            mobileNumber: "1110005050",
        },
    ];
    envKeys: any;

    private eList: BehaviorSubject<IEmployee[]> = new BehaviorSubject([]);

    get employeeList() {
        return this.eList.asObservable();
    }

    constructor(
        private http: HttpClient,
    ) {
        this.changeEmployeeList(this.employees);
        this.envKeys = environment;
    }

    changeEmployeeList(employeeList: IEmployee[]) {
        this.eList.next(employeeList);
    }

    getEmployeeList() {}

    getEmployee() {}

    addEmployee(newEmployee: IEmployee) {
        return this.http.post(`${this.envKeys.fireBaseAPI}employees.json`, newEmployee);
    }

    updateEmployeeDetails() {}

    deleteEmployee() {}

}
