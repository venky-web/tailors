import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployee } from 'app-models';
import { EmployeeService } from 'app-services';


@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.page.html',
  styleUrls: ['./employee-detail.page.scss'],
})
export class EmployeeDetailPage implements OnInit {

  employeeId: number;
  loadedEmployee: IEmployee;

  tabIndex: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private employeeService: EmployeeService,
  ) {
    this.tabIndex = 1;
  }

  ngOnInit() {
    this.employeeId = +this.activateRoute.snapshot.paramMap.get('employeeId');
    this.employeeService.employeeList.subscribe((list: IEmployee[]) => {
      if (list && list.length > 0) {
        this.loadedEmployee = list.find((e: IEmployee) => e.employeeId === this.employeeId);
      }
    });
  }

  onClickTab(type: string, index: number) {
    switch(type) {
      case 'earnings':
        break;
      case 'compensation':
        break;
      case 'other':
        break;
    }
    this.tabIndex = index;
  }

}
