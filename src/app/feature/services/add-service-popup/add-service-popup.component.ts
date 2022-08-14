import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from "moment";

import { ProductService } from 'app-services';


@Component({
    selector: 'app-add-service-popup',
    templateUrl: './add-service-popup.component.html',
    styleUrls: ['./add-service-popup.component.scss'],
})
export class AddServicePopupComponent implements OnInit, OnDestroy {

    @Input() serviceItemList: any[];
    @Input() operationType: 'add' | 'update';
    @Input() serviceItemData: any;

    subscriptions: Subscription[];
    serviceForm: FormGroup;

    duplicateName: boolean;

    constructor(
        private modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private productService: ProductService,
    ) {
        this.subscriptions = [];
    }

    ngOnInit() {
        this.createServiceForm();
        if (this.serviceItemData) {
            this.serviceForm.patchValue({
                name: this.serviceItemData.name,
                description: this.serviceItemData.description,
                price: this.serviceItemData.price,
                discount: this.serviceItemData.discount,
            });
        }
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        }
    }

    createServiceForm() {
        this.serviceForm = new FormGroup({
            name: new FormControl(null, {
                updateOn: "change",
                validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
            }),
            description: new FormControl(null, {
                updateOn: "blur",
                validators: [Validators.maxLength(200)]
            }),
            price: new FormControl(0, {updateOn: 'blur', validators: [Validators.required, Validators.min(0)]}),
            discount: new FormControl(0, {updateOn: 'blur', validators: [Validators.min(0)]}),
        });
    }

    get formCtrls() { return this.serviceForm.controls; }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel', 'service-add-popup-modal');
    }

    saveServiceItemData() {
        this.serviceForm.markAllAsTouched();
        this.serviceForm.markAsDirty();
        if (!this.serviceForm.valid) return;
        const formData = this.serviceForm.value;
        if (this.serviceItemList && this.serviceItemList.length > 0) {
            let duplicateServiceWithName: any;
            if (this.operationType === "update" && this.serviceItemData) {
                duplicateServiceWithName = this.serviceItemList.find((x: any) =>
                    x.name &&
                    x.name.toLowerCase() === formData.name.toLowerCase() &&
                    x._id !== this.serviceItemData._id
                );
            } else {
                duplicateServiceWithName = this.serviceItemList.find((x: any) =>
                    x.name &&
                    x.name.toLowerCase() === formData.name.toLowerCase()
                );
            }
            this.duplicateName = !!duplicateServiceWithName;
            if (duplicateServiceWithName) return;
        }
        if (this.operationType === "add") {
            this.addServiceItem(formData);
        } else {
            this.updateServiceItem(formData);
        }
    }

    addServiceItem(formData: any) {
        const serviceItemData: any = {
            "service_id": this.getServiceId(),
            "name": formData.name,
            "description": formData.description,
            "price": formData.price,
            "discount": formData.discount,
            "created_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ"),
            "updated_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ")
        };
        this.loadingCtrl.create({
            message: "Saving service data",
        }).then(loadingEl => {
            loadingEl.present();
            const saveServiceItemSub = this.productService.addServiceItem(serviceItemData).subscribe(
                (response: any) => {
                    serviceItemData._id = response.name;
                    loadingEl.dismiss();
                    this.showToast("Data saved successfully!");
                    const modelData = {
                        name: "service",
                        data: serviceItemData,
                        serviceId: response,
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'service-add-popup-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(saveServiceItemSub);
        });
    }

    updateServiceItem(formData: any) {
        const serviceItemData: any = {
            "service_id": this.serviceItemData.service_id,
            "name": formData.name,
            "description": formData.description,
            "price": formData.price,
            "discount": formData.discount,
            "created_date": this.serviceItemData.created_date,
            "updated_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ")
        };
        this.loadingCtrl.create({
            message: "Updating service data",
        }).then(loadingEl => {
            loadingEl.present();
            const updateServiceItemSub = this.productService.updateServiceItem(serviceItemData, this.serviceItemData._id).subscribe(
                (response: any) => {
                    serviceItemData._id = response.name;
                    loadingEl.dismiss();
                    this.showToast("Data updated successfully!");
                    const modelData = {
                        name: "service",
                        data: serviceItemData,
                        serviceId: response,
                        type: "update"
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'service-add-popup-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(updateServiceItemSub);
        });
    }

    getServiceId() {
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
