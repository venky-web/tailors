import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from "moment";

import { ProductService } from 'app-services';


@Component({
    selector: 'app-add-product-popup',
    templateUrl: './add-product-popup.component.html',
    styleUrls: ['./add-product-popup.component.scss'],
})
export class AddProductPopupComponent implements OnInit, OnDestroy {

    @Input() productList: any[];
    @Input() operationType: 'add' | 'update';
    @Input() productData: any;

    subscriptions: Subscription[];
    productForm: FormGroup;

    vendorList: any[];
    duplicateName: boolean;
    maxPurchaseDate: any;

    constructor(
        private modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private productService: ProductService,
    ) {
        this.subscriptions = [];
    }

    ngOnInit() {
        this.maxPurchaseDate = moment(new Date()).format("YYYY-MM-DD");
        this.createProductForm();
        if (this.productData) {
            this.productForm.patchValue({
                name: this.productData.name,
                description: this.productData.description,
                purchaseDate: this.productData.purchase_date,
                cost: this.productData.cost,
                price: this.productData.price,
                discount: this.productData.discount,
                vendor: this.productData.vendor,
            });
        }
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        }
    }

    createProductForm() {
        this.productForm = new FormGroup({
            name: new FormControl(null, {
                updateOn: "change",
                validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
            }),
            description: new FormControl(null, {
                updateOn: "blur",
                validators: [Validators.maxLength(200)]
            }),
            purchaseDate: new FormControl(this.maxPurchaseDate, {updateOn: 'blur', validators: [Validators.required]}),
            cost: new FormControl(0, {updateOn: 'blur', validators: [Validators.required, Validators.min(0)]}),
            price: new FormControl(0, {updateOn: 'blur', validators: [Validators.required, Validators.min(0)]}),
            discount: new FormControl(0, {updateOn: 'blur', validators: [Validators.min(0)]}),
            vendor: new FormControl(null),
        });
    }

    get formCtrls() { return this.productForm.controls; }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel', 'product-add-popup-modal');
    }

    saveProductData() {
        this.productForm.markAllAsTouched();
        this.productForm.markAsDirty();
        if (!this.productForm.valid) return;
        const formData = this.productForm.value;
        if (this.productList && this.productList.length > 0) {
            let duplicateProductWithName: any;
            if (this.operationType === "update" && this.productData) {
                duplicateProductWithName = this.productList.find((x: any) =>
                    x.name &&
                    x.name.toLowerCase() === formData.name.toLowerCase() &&
                    x._id !== this.productData._id
                );
            } else {
                duplicateProductWithName = this.productList.find((x: any) =>
                    x.name &&
                    x.name.toLowerCase() === formData.name.toLowerCase()
                );
            }
            this.duplicateName = !!duplicateProductWithName;
            if (duplicateProductWithName) return;
        }
        if (this.operationType === "add") {
            this.addProduct(formData);
        } else {
            this.updateProduct(formData);
        }
    }

    addProduct(formData: any) {
        const productData: any = {
            "product_id": this.getProductId(),
            "name": formData.name,
            "description": formData.description,
            "purchase_date": moment(formData.purchaseDate).format("YYYY-MM-DD"),
            "cost": formData.cost,
            "price": formData.price,
            "discount": formData.discount,
            "vendor_id": formData.vendor,
            "created_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ"),
            "updated_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ")
        };
        this.loadingCtrl.create({
            message: "Saving product data",
        }).then(loadingEl => {
            loadingEl.present();
            const saveProductSub = this.productService.addProduct(productData).subscribe(
                (response: any) => {
                    productData._id = response.name;
                    loadingEl.dismiss();
                    this.showToast("Data saved successfully!");
                    const modelData = {
                        name: "product",
                        data: productData,
                        productId: response,
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'product-add-popup-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(saveProductSub);
        });
    }

    updateProduct(formData: any) {
        const productData: any = {
            "product_id": this.productData.product_id,
            "name": formData.name,
            "description": formData.description,
            "purchase_date": moment(formData.purchaseDate).format("YYYY-MM-DD"),
            "cost": formData.cost,
            "price": formData.price,
            "discount": formData.discount,
            "vendor_id": formData.vendor,
            "created_date": this.productData.created_date,
            "updated_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ")
        };
        this.loadingCtrl.create({
            message: "Updating product data",
        }).then(loadingEl => {
            loadingEl.present();
            const updateProductSub = this.productService.updateProduct(productData, this.productData._id).subscribe(
                (response: any) => {
                    productData._id = response.name;
                    loadingEl.dismiss();
                    this.showToast("Data updated successfully!");
                    const modelData = {
                        name: "product",
                        data: productData,
                        productId: response,
                        type: "update"
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'product-add-popup-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(updateProductSub);
        });
    }

    getProductId() {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const date = new Date().getDate();
        const hours = new Date().getHours();
        const mins = new Date().getMinutes();
        const seconds = new Date().getSeconds();
        return `${year}${month}${date}${hours}${mins}${seconds}`;
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
