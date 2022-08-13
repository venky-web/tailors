import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingController, ModalController, Platform } from '@ionic/angular';

import { UserProfileComponent } from 'app-components';
import { CustomerService, UserService } from 'app-services';


@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.page.html',
    styleUrls: ['./customer-detail.page.scss'],
})
export class CustomerDetailPage implements OnInit {

    getCustomerDataSub: Subscription;

    customerId: number;
    customerList: any;
    customerData: any;
    customerProfile: any;

    tabIndex: number;
    platforms: string[];
    isDesktop: boolean;

    constructor(
        private activateRoute: ActivatedRoute,
        private customerService: CustomerService,
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
        this.customerId = +this.activateRoute.snapshot.paramMap.get('customerId');
    }

    ionViewWillEnter() {
        // this.customerService.customers.subscribe((list: any[]) => {
        //     this.customerList = list;
        //     if (list && list.length > 0) {
        //         this.customerData = list.find((e: any) => e.id === this.customerId);
        //         this.customerProfile = this.customerData ? this.customerData.profile : null;
        //     } else if (!this.getCustomerDataSub) {
        //         this.getCustomerDetails();
        //     }
        // });
    }

    getCustomerDetails() {
        this.loadingCtrl.create({
            message: "Loading user data"
        }).then(loadingEl => {
            loadingEl.present();
            this.getCustomerDataSub = this.userService.getUserDetails(this.customerId).subscribe(
                (response: any) => {
                    this.customerData = response;
                    this.customerProfile = this.customerData ? this.customerData.profile : null;
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

    onEditCustomer() {
        this.modalCtrl.create({
            component: UserProfileComponent,
            componentProps: {
                userList: this.customerList ? this.customerList : [],
                operationType: 'update',
                loadedUser: this.customerData,
            },
            id: 'user-profile-modal'
        }).then((modalEl: HTMLIonModalElement) => {
            modalEl.present();
            return modalEl.onDidDismiss() ;
        }).then((resultData: any) => {
            if (resultData.role === "confirm" && resultData.data) {
                this.customerData = resultData.data.userData;
                this.customerProfile = resultData.data.profileData;
            }
        });
    }

}
