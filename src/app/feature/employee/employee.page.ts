import { Component, OnInit } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';

import { EmployeeService } from 'app-services';
import { IEmployee } from 'app-models';
import { Router } from '@angular/router';
import { EmployeeAddComponent } from './employee-add/employee-add.component';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

  platforms: string[];
  employeeList: IEmployee[];
  isServiceCalled: boolean;
  isDesktop: boolean;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private platform: Platform,
    private modalController: ModalController
  ) {
    this.isServiceCalled = false;
    this.platforms = this.platform.platforms();
    this.isDesktop = this.platforms.includes('desktop');
  }

  ngOnInit() {
    this.employeeService.employeeList.subscribe((list: IEmployee[]) => {
      if (this.isServiceCalled) { return; }
      this.employeeList = list;
    });
    console.log(this.platform.platforms());
  }

  goToEmployeeDetails(id: any) {
    this.router.navigate(['/emp', id]);
  }

  addEmployee() {
    console.log('Employee added');
    this.modalController.create({
      component: EmployeeAddComponent,
      componentProps: {
        employeeList: this.employeeList ? this.employeeList : [],
        operationType: 'add',
      },
      id: 'emp-add-modal'
    }).then((modalEl: HTMLIonModalElement) => {
      console.dir(modalEl);
      modalEl.present();
      return modalEl.onDidDismiss() ;
    }).then((resultData: any) => {
      console.log(resultData);
    });
  }

}
