import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from "moment";

import { ProductService } from 'app-services';


@Component({
    selector: 'app-add-vendor-popup',
    templateUrl: './add-vendor-popup.component.html',
    styleUrls: ['./add-vendor-popup.component.scss'],
})
export class AddVendorPopupComponent implements OnInit, OnDestroy {

    @Input() vendorList: any[];
    @Input() operationType: 'add' | 'update';
    @Input() vendorData: any;

    subscriptions: Subscription[];
    vendorForm: FormGroup;

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
        this.createVendorForm();
        if (this.vendorData) {
            this.vendorForm.patchValue({
                name: this.vendorData.name,
                description: this.vendorData.description,
                address: this.vendorData.address,
                phone: this.vendorData.phone,
            });
        }
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        }
    }

    createVendorForm() {
        this.vendorForm = new FormGroup({
            name: new FormControl(null, {
                updateOn: "change",
                validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
            }),
            description: new FormControl(null, {
                updateOn: "blur",
                validators: [Validators.maxLength(200)]
            }),
            address: new FormControl(null, {
                updateOn: "blur",
                validators: [Validators.maxLength(200)]
            }),
            phone: new FormControl(null, {
                updateOn: 'blur',
                validators: [
                    Validators.pattern("^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$"),
                    Validators.minLength(10),
                    Validators.maxLength(10)
                ]}
            ),
        });
    }

    get formCtrls() { return this.vendorForm.controls; }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel', 'vendor-add-popup-modal');
    }

    saveVendorData() {
        this.vendorForm.markAllAsTouched();
        this.vendorForm.markAsDirty();
        if (!this.vendorForm.valid) return;
        const formData = this.vendorForm.value;
        if (this.vendorList && this.vendorList.length > 0) {
            let duplicateVendorWithName: any;
            if (this.operationType === "update" && this.vendorData) {
                duplicateVendorWithName = this.vendorList.find((x: any) =>
                    x.name &&
                    x.name.toLowerCase() === formData.name.toLowerCase() &&
                    x._id !== this.vendorData._id
                );
            } else {
                duplicateVendorWithName = this.vendorList.find((x: any) =>
                    x.name &&
                    x.name.toLowerCase() === formData.name.toLowerCase()
                );
            }
            this.duplicateName = !!duplicateVendorWithName;
            if (duplicateVendorWithName) return;
        }
        if (this.operationType === "add") {
            this.addVendor(formData);
        } else {
            this.updateVendor(formData);
        }
    }

    addVendor(formData: any) {
        const vendorData: any = {
            "vendor_id": "V" + this.getVendorId(),
            "name": formData.name,
            "description": formData.description,
            "address": formData.address,
            "phone": formData.phone ? `${formData.phone}` : "",
            "created_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ"),
            "updated_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ")
        };
        this.loadingCtrl.create({
            message: "Saving vendor data",
        }).then(loadingEl => {
            loadingEl.present();
            const saveVendorSub = this.productService.addVendor(vendorData).subscribe(
                (response: any) => {
                    vendorData._id = response.name;
                    loadingEl.dismiss();
                    this.showToast("Data saved successfully!");
                    const modelData = {
                        name: "vendor",
                        data: vendorData,
                        serviceId: response,
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'vendor-add-popup-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(saveVendorSub);
        });
    }

    updateVendor(formData: any) {
        const vendorData: any = {
            "vendor_id": this.vendorData.vendor_id,
            "name": formData.name,
            "description": formData.description,
            "address": formData.address,
            "phone": formData.phone ? `${formData.phone}` : "",
            "created_date": this.vendorData.created_date,
            "updated_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ")
        };
        this.loadingCtrl.create({
            message: "Updating vendor data",
        }).then(loadingEl => {
            loadingEl.present();
            const updateVendorSub = this.productService.updateVendor(vendorData, this.vendorData._id).subscribe(
                (response: any) => {
                    vendorData._id = response.name;
                    loadingEl.dismiss();
                    this.showToast("Data updated successfully!");
                    const modelData = {
                        name: "vendor",
                        data: vendorData,
                        serviceId: response,
                        type: "update"
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'vendor-add-popup-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(updateVendorSub);
        });
    }

    getVendorId() {
        let vendorIds = [];
        for (const vendor of this.vendorList) {
            if (vendor.vendor_id) vendorIds.push(vendor.vendor_id.substring(2, vendor.vendor_id.length));
        }
        vendorIds = vendorIds.map((x: any) => +x);
        vendorIds.sort((a: number, b: number) => a - b);
        return vendorIds.length > 0 ? vendorIds[vendorIds.length - 1] + 1 : 1000;
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
