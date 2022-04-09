import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoadingController, ModalController, Platform } from '@ionic/angular';

import { EmployeeService, UserService } from 'app-services';
import { EmployeeAddComponent } from './employee-add/employee-add.component';


@Component({
    selector: 'app-employee',
    templateUrl: './employee.page.html',
    styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

    subscriptions: Subscription[];

    platforms: string[];
    employeeList: any[];
    isServiceCalled: boolean;
    isDesktop: boolean;

    constructor(
        private employeeService: EmployeeService,
        private router: Router,
        private platform: Platform,
        private modalController: ModalController,
        private userService: UserService,
        private loadingCtrl: LoadingController,
    ) {
        this.isServiceCalled = false;
        this.platforms = this.platform.platforms();
        this.isDesktop = this.platforms.includes('desktop');
        this.subscriptions = [];
    }

    ngOnInit() {}
    
    ionViewWillEnter() {
        this.getEmployees();
    }

    getEmployees() {
        this.loadingCtrl.create({
            message: "Loading employees list"
        }).then(loadingEl => {
            const getEmployeesSub = this.userService.getBusinessStaffList().subscribe((response: any) => {
                this.employeeList = response;
                this.employeeService.updateEmployeeList(this.employeeList);
                loadingEl.dismiss();
            },
            error => {
                loadingEl.dismiss();
            });
            this.subscriptions.push(getEmployeesSub);
        });
    }

    goToEmployeeDetails(id: any) {
        this.router.navigate(['/emp', id]);
    }

    addEmployee() {
        this.modalController.create({
            component: EmployeeAddComponent,
            componentProps: {
                employeeList: this.employeeList ? this.employeeList : [],
                operationType: 'add',
            },
            id: 'emp-add-modal'
        }).then((modalEl: HTMLIonModalElement) => {
            modalEl.present();
            return modalEl.onDidDismiss() ;
        }).then((resultData: any) => {
            this.getEmployees();
        });
    }

}
