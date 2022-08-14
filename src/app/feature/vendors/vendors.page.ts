import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Platform, LoadingController, ModalController, ToastController, AlertController, IonItemSliding } from '@ionic/angular';

import { ProductService } from 'app-services';
import { AddVendorPopupComponent } from './add-vendor-popup/add-vendor-popup.component';


@Component({
    selector: 'app-vendors',
    templateUrl: './vendors.page.html',
    styleUrls: ['./vendors.page.scss'],
})
export class VendorsPage implements OnInit {

    subscriptions: Subscription[];
    isDesktop: boolean;
    platforms: string[];

    vendorList: any[];
    vendorTableCols: any[];

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
        this.vendorTableCols = [
			{ field: 'name', header: 'Name' },
			{ field: 'description', header: 'Description' },
			{ field: 'address', header: 'Address' },
			{ field: 'phone', header: 'Contact Number' },
			{ header: 'Actions' }
		];
    }

    ionViewWillEnter() {
        this.getVendorList();
    }

    getVendorList() {
        this.loadingCtrl.create({
            message: "Loading data"
        }).then(loadingEl => {
            const getVendorListSub = this.productService.getVendors().subscribe((response: any) => {
                this.vendorList = [];
                for (const key in response) {
                    this.vendorList.push({...response[key], _id: key});
                }
                loadingEl.dismiss();
            },
            error => {
                loadingEl.dismiss();
            });
            this.subscriptions.push(getVendorListSub);
        });
    }

    onFilterVendors() {}

    goToVendorDetails(vendorId: string, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
        // this.router.navigate(['/vendors', vendorId]);
    }

    addVendor() {
        this.openVendorPopup("add");
    }

    onEditVendor(vendorData: any, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
        this.openVendorPopup("update", vendorData);
    }

    openVendorPopup(type: string, vendorData?: any) {
        this.modalCtrl.create({
            component: AddVendorPopupComponent,
            componentProps: {
                vendorList: this.vendorList ? this.vendorList : [],
                operationType: type,
                vendorData: vendorData,
            },
            id: 'vendor-add-popup-modal'
        }).then((modalEl: HTMLIonModalElement) => {
            modalEl.present();
            return modalEl.onDidDismiss();
        }).then((resultData: any) => {
            if (resultData.role === "confirm" && resultData.data) {
                this.getVendorList();
            }
        });
    }

    onDeleteVendor(vendorId: string, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
        this.alertCtrl.create({
            header: 'Are you sure?',
            message: 'Vendor data will be deleted permanently.',
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
                    message: "Deleting vendor data",
                }).then(loadingEl => {
                    loadingEl.present();
                    const deleteVendorSub = this.productService.deleteVendor(vendorId).subscribe(
                        (response: any) => {
                            loadingEl.dismiss();
                            this.showToast("Vendor data is deleted successfully!");
                            this.getVendorList();
                        },
                        errorRes => {
                            loadingEl.dismiss();
                        }
                    );
                    this.subscriptions.push(deleteVendorSub);
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
