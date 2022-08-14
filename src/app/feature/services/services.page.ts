import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Platform, LoadingController, ModalController, ToastController, AlertController, IonItemSliding } from '@ionic/angular';

import { ProductService } from 'app-services';
import { AddServicePopupComponent } from './add-service-popup/add-service-popup.component';


@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

    subscriptions: Subscription[];
    isDesktop: boolean;
    platforms: string[];

    serviceList: any[];
    serviceTableCols: any[];

    constructor(
        private platform: Platform,
        private router: Router,
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        private productService: ProductService,
    ) {
        this.platforms = this.platform.platforms();
        this.isDesktop = this.platforms.includes('desktop');
        this.subscriptions = [];
    }

    ngOnInit() {
        this.serviceTableCols = [
			{ field: 'name', header: 'Name' },
			{ field: 'description', header: 'Description' },
			{ field: 'price', header: 'Price per Item' },
			{ field: 'discount', header: 'Discount' },
			{ header: 'Actions' }
		];
    }

    ionViewWillEnter() {
        this.getServiceItems();
    }

    getServiceItems() {
        this.loadingCtrl.create({
            message: "Loading data"
        }).then(loadingEl => {
            const getServiceItemSub = this.productService.getServiceItems().subscribe((response: any) => {
                this.serviceList = [];
                for (const key in response) {
                    this.serviceList.push({...response[key], _id: key});
                }
                loadingEl.dismiss();
            },
            error => {
                loadingEl.dismiss();
            });
            this.subscriptions.push(getServiceItemSub);
        });
    }

    onFilterServiceItems() {}

    goToServiceDetails(serviceId: string, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
        this.router.navigate(['/services', serviceId]);
    }

    addServiceItem() {
        this.openProductPopup("add");
    }

    onEditServiceItem(serviceData: any, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
        this.openProductPopup("update", serviceData);
    }

    openProductPopup(type: string, serviceData?: any) {
        this.modalCtrl.create({
            component: AddServicePopupComponent,
            componentProps: {
                serviceItemList: this.serviceList ? this.serviceList : [],
                operationType: type,
                serviceItemData: serviceData,
            },
            id: 'service-add-popup-modal'
        }).then((modalEl: HTMLIonModalElement) => {
            modalEl.present();
            return modalEl.onDidDismiss();
        }).then((resultData: any) => {
            if (resultData.role === "confirm" && resultData.data) {
                this.getServiceItems();
            }
        });
    }

    onDeleteServiceItem(serviceId: string, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
        this.alertCtrl.create({
            header: 'Are you sure?',
            message: 'Service item data will be deleted permanently.',
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
                    message: "Deleting service data",
                }).then(loadingEl => {
                    loadingEl.present();
                    const deleteServiceItemSub = this.productService.deleteServiceItem(serviceId).subscribe(
                        (response: any) => {
                            loadingEl.dismiss();
                            this.showToast("Service data is deleted successfully!");
                            this.getServiceItems();
                        },
                        errorRes => {
                            loadingEl.dismiss();
                        }
                    );
                    this.subscriptions.push(deleteServiceItemSub);
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
