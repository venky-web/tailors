import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Platform, ModalController, IonItemSliding } from '@ionic/angular';

import { CustomerService } from 'app-services';
import { Customer } from 'app-models';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { UserProfileComponent } from 'app-components';


@Component({
	selector: 'app-customers',
	templateUrl: './customers.page.html',
	styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit, OnDestroy {

    subscriptions: Subscription[];
  	customers: any[];
	platforms: string[];
	isDesktop: boolean;

	customerTableCols: any[];
	overViewData: {orderStatus: string; orderCount: number}[];

	constructor(
		private router: Router,
    	private customerService: CustomerService,
		private platform: Platform,
		private modalCtrl: ModalController
	) {
		this.platforms = this.platform.platforms();
		this.isDesktop = this.platforms.includes('desktop');
        this.subscriptions = [];
	}

	ngOnInit() {
		this.customerTableCols = [
			{ header: 'Image' },
			{ field: 'customerName', header: 'Name' },
			{ field: 'mobileNumber', header: 'Mobile Number' },
			{ field: 'address', header: 'Address' },
			{ field: 'isActive', header: 'Active' },
			{ header: 'Actions' }
		];
	}

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        }
    }

    ionViewWillEnter() {
        this.getCustomers();
    }

	getCustomers() {
		const getCustomersSub = this.customerService.getCustomers().subscribe(
            (response: any) => {
                this.customers = response;
            },
        );
        this.subscriptions.push(getCustomersSub);
	}

	onFilterCustomers() {}

	goToCustomerDetails(customerId: any, slidingItem?: IonItemSliding) {
		if (slidingItem) {
			slidingItem.close();
		}
		this.router.navigate(['/customers', customerId]);
	}

	addCustomer() {
		this.modalCtrl.create({
			component: AddCustomerComponent,
			id: 'customer-add-modal'
		}).then((modalEl: HTMLIonModalElement) => {
			modalEl.present();
			return modalEl.onDidDismiss();
		}).then((resultData: any) => {
			if (resultData && resultData.role === 'confirm') {
				this.getCustomers();
			}
		});
    }

    onEditCustomer(customerData: any, slidingItem?: IonItemSliding) {
        if (!customerData) { return; }
		if (slidingItem) {
			slidingItem.close();
		}
		this.modalCtrl.create({
            component: UserProfileComponent,
            componentProps: {
                userList: this.customers ? this.customers : [],
                operationType: 'update',
                loadedUser: customerData,
            },
            id: 'user-profile-modal'
        }).then((modalEl: HTMLIonModalElement) => {
            modalEl.present();
            return modalEl.onDidDismiss() ;
        }).then((resultData: any) => {
            if (resultData.role === "confirm" && resultData.data) {
                this.getCustomers();
            }
        });
    }

}
