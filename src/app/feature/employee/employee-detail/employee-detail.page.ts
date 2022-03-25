import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoadingController, ModalController, Platform } from '@ionic/angular';

import { EmployeeService, UserService } from 'app-services';
import { UserProfileComponent } from 'app-components';


@Component({
    selector: 'app-employee-detail',
    templateUrl: './employee-detail.page.html',
    styleUrls: ['./employee-detail.page.scss'],
})
export class EmployeeDetailPage implements OnInit {

    getEmployeeDataSub: Subscription;

    employeeId: number;
    employeeList: any;
    employeeData: any;
    employeeProfile: any;

    tabIndex: number;
    platforms: string[];
    isDesktop: boolean;

    constructor(
        private activateRoute: ActivatedRoute,
        private employeeService: EmployeeService,
        private userService: UserService,
        private loadingCtrl: LoadingController,
        private platform: Platform,
        private modalCtrl: ModalController,
    ) {
        this.tabIndex = 1;
        this.platforms = this.platform.platforms();
        this.isDesktop = this.platforms.includes('desktop');
    }

    ngOnInit() {
        this.employeeId = +this.activateRoute.snapshot.paramMap.get('employeeId');
        this.employeeService.employeeList.subscribe((list: any[]) => {
            this.employeeList = list;
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
                    this.employeeData = response;
                    this.employeeProfile = this.employeeData ? this.employeeData.profile : null;
                    loadingEl.dismiss();
                },
                errorRes => {
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

    onEditEmployee() {
        this.modalCtrl.create({
            component: UserProfileComponent,
            componentProps: {
                userList: this.employeeList ? this.employeeList : [],
                operationType: 'update',
                loadedUser: this.employeeData,
            },
            id: 'user-profile-modal'
        }).then((modalEl: HTMLIonModalElement) => {
            modalEl.present();
            return modalEl.onDidDismiss() ;
        }).then((resultData: any) => {
            if (resultData.role === "confirm" && resultData.data) {
                this.employeeData = resultData.data.userData;
                this.employeeProfile = resultData.data.profileData;
            }
        });
    }

}
