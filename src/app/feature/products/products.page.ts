import { Component, OnInit } from '@angular/core';
import { AlertController, IonItemSliding, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductService } from 'app-services';
import { AddProductPopupComponent } from './add-product-popup/add-product-popup.component';


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

    subscriptions: Subscription[];
    isDesktop: boolean;
    platforms: string[];

    productList: any[];
    productTableCols: any[];

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
        this.productTableCols = [
			{ field: 'name', header: 'Name' },
			{ field: 'description', header: 'Description' },
			{ field: 'purchase_date', header: 'Purchased On' },
			// { field: 'cost', header: 'Cost per Item' },
			{ field: 'price', header: 'Price per Item' },
			{ field: 'discount', header: 'Discount' },
			{ header: 'Actions' }
		];
    }

    ionViewWillEnter() {
        this.getProducts();
    }

    getProducts() {
        this.loadingCtrl.create({
            message: "Loading product"
        }).then(loadingEl => {
            const getProductSub = this.productService.getProducts().subscribe((response: any) => {
                this.productList = [];
                for (const key in response) {
                    this.productList.push({...response[key], _id: key});
                }
                loadingEl.dismiss();
            },
            error => {
                loadingEl.dismiss();
            });
            this.subscriptions.push(getProductSub);
        });
    }
    
    onFilterProducts() {}
    
    goToProductDetails(productId: string, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
		this.router.navigate(['/products', productId]);
    }

    addProduct() {
        this.openProductPopup("add");
    }

    onEditProduct(product: any, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
        this.openProductPopup("update", product);
    }

    openProductPopup(type: string, productData?: any) {
        this.modalCtrl.create({
            component: AddProductPopupComponent,
            componentProps: {
                productList: this.productList ? this.productList : [],
                operationType: type,
                productData: productData,
            },
            id: 'product-add-popup-modal'
        }).then((modalEl: HTMLIonModalElement) => {
            modalEl.present();
            return modalEl.onDidDismiss();
        }).then((resultData: any) => {
            if (resultData.role === "confirm" && resultData.data) {
                this.getProducts();
            }
        });
    }

    onDeleteProduct(productId: string, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
        this.alertCtrl.create({
            header: 'Are you sure?',
            message: 'Product data will be deleted permanently.',
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
                    message: "Deleting product data",
                }).then(loadingEl => {
                    loadingEl.present();
                    const deleteProductSub = this.productService.deleteProduct(productId).subscribe(
                        (response: any) => {
                            loadingEl.dismiss();
                            this.showToast("Product data is deleted successfully!");
                            this.getProducts();
                        },
                        errorRes => {
                            loadingEl.dismiss();
                        }
                    );
                    this.subscriptions.push(deleteProductSub);
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
