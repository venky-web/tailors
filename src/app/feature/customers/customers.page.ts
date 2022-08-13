import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Platform, ModalController, IonItemSliding, ToastController, AlertController, LoadingController } from '@ionic/angular';

import { CustomerService } from 'app-services';
import { AddCustomerPopupComponent } from './add-customer-popup/add-customer-popup.component';


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
		private platform: Platform,
		private modalCtrl: ModalController,
		private customerService: CustomerService,
		private toastCtrl: ToastController,
		private alertCtrl: AlertController,
		private loadingCtrl: LoadingController,
	) {
		this.platforms = this.platform.platforms();
		this.isDesktop = this.platforms.includes('desktop');
        this.subscriptions = [];
	}

	ngOnInit() {
		this.customerTableCols = [
			{ header: 'Image' },
			{ field: 'full_name', header: 'Full Name' },
			{ field: 'display_name', header: 'Display Name' },
			{ field: 'phone', header: 'Mobile' },
			{ field: 'joined_date', header: 'Joined on' },
			{ field: 'updated_date', header: 'Updated on' },
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
		this.loadingCtrl.create({
			message: "Loading data",
		}).then((loadingEl: HTMLIonLoadingElement) => {
			loadingEl.present();
			const getCustomersSub = this.customerService.getCustomers().subscribe(
				(response: any) => {
					this.customers = this.reArrangeCustomerList(response);
					loadingEl.dismiss();
				},
				error => {
					loadingEl.dismiss();
				}
			);
			this.subscriptions.push(getCustomersSub);
		})
	}

	reArrangeCustomerList(data: any) {
		const customers = [];
		for (const key in data) {
			customers.push({...data[key], _id: key});
		}
		return customers;
	}

	onFilterCustomers() {}

	goToCustomerDetails(customerId: any, slidingItem?: IonItemSliding) {
		if (slidingItem) slidingItem.close();
		this.router.navigate(['/customers', customerId]);
	}

	addCustomer() {
		this.openCustomerPopup("add");
    }

    onEditCustomer(customerData: any, slidingItem?: IonItemSliding) {
        if (!customerData) { return; }
		if (slidingItem) slidingItem.close();
		this.openCustomerPopup("update", customerData);
    }

	openCustomerPopup(type: string, customerData?: any) {
        this.modalCtrl.create({
            component:  AddCustomerPopupComponent,
            componentProps: {
                customerList: this.customers ? this.customers : [],
                operationType: type,
                customerData: customerData,
            },
            id: 'customer-add-popup-modal',
        }).then((modalEl: HTMLIonModalElement) => {
            modalEl.present();
            return modalEl.onDidDismiss();
        }).then((resultData: any) => {
            if (resultData.role === "confirm" && resultData.data) {
                this.getCustomers();
            }
        });
    }

	onDeleteCustomer(id: string, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
        this.alertCtrl.create({
            header: 'Are you sure?',
            message: 'Customer data will be deleted permanently.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Delete',
                    role: "confirm",
                },
            ],
        }).then((alertEl: HTMLIonAlertElement) => {
            alertEl.present();
            return alertEl.onDidDismiss();
        }).then((alertResult: any) => {
            if (alertResult && alertResult.role === "confirm") {
                this.loadingCtrl.create({
                    message: "Deleting customer data",
                }).then(loadingEl => {
                    loadingEl.present();
                    const deleteEmpSub = this.customerService.deleteCustomer(id).subscribe(
                        (response: any) => {
                            loadingEl.dismiss();
                            this.showToast("Customer data is deleted successfully!");
                            this.getCustomers();
                        },
                        errorRes => {
                            loadingEl.dismiss();
                        }
                    );
                    this.subscriptions.push(deleteEmpSub);
                });
            }
        });
    }

	async showToast(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: "top"
        });
        toast.present();
    }

}
