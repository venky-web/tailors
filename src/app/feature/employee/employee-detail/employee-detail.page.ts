import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoadingController } from '@ionic/angular';

import { EmployeeService, UserService } from 'app-services';


@Component({
    selector: 'app-employee-detail',
    templateUrl: './employee-detail.page.html',
    styleUrls: ['./employee-detail.page.scss'],
})
export class EmployeeDetailPage implements OnInit {

    getEmployeeDataSub: Subscription;

    employeeId: number;
    employeeData: any;
    employeeProfile: any;

    tabIndex: number;

    constructor(
        private activateRoute: ActivatedRoute,
        private employeeService: EmployeeService,
        private userService: UserService,
        private loadingCtrl: LoadingController,
    ) {
        this.tabIndex = 1;
    }

    ngOnInit() {
        this.employeeId = +this.activateRoute.snapshot.paramMap.get('employeeId');
        this.employeeService.employeeList.subscribe((list: any[]) => {
            if (list && list.length > 0) {
                this.employeeData = list.find((e: any) => e.id === this.employeeId);
                this.employeeProfile = this.employeeData ? this.employeeData.profile : null;
            } else {
                if (!this.getEmployeeDataSub) {
                    this.getEmployeeData();
                }
            }
        });
    }

    getEmployeeData() {
        this.loadingCtrl.create({
            message: "Loading employee data"
        }).then(loadingEl => {
            loadingEl.present();
            this.getEmployeeDataSub = this.userService.getUserDetails(this.employeeId).subscribe(
                (response: any) => {
                    console.log(response);
                    this.employeeData = response;
                    this.employeeProfile = this.employeeData ? this.employeeData.profile : null;
                    loadingEl.dismiss();
                },
                errorRes => {
                    console.log(errorRes);
                    loadingEl.dismiss();
                }
            );
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
