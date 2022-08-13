import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from "moment";

import { CustomerService } from 'app-services';


@Component({
    selector: 'app-add-customer-popup',
    templateUrl: './add-customer-popup.component.html',
    styleUrls: ['./add-customer-popup.component.scss'],
})
export class AddCustomerPopupComponent implements OnInit, OnDestroy {

    @Input() customerList: any[];
    @Input() operationType: 'add' | 'update';
    @Input() customerData: any;

    subscriptions: Subscription[];
    customerForm: FormGroup;

    duplicateNumber: boolean;
    duplicateName: boolean;

    constructor(
        private modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private customerService: CustomerService,
    ) {
        this.subscriptions = [];
    }

    ngOnInit() {
        this.createCustomerForm();
        if (this.customerData) {
            this.customerForm.patchValue({
                fullName: this.customerData.full_name,
                displayName: this.customerData.display_name,
                gender: this.customerData.gender,
                mobileNumber: this.customerData.phone
            });
        }
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        }
    }

    createCustomerForm() {
        this.customerForm = new FormGroup({
            fullName: new FormControl(null, {
                updateOn: "blur",
                validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200)]
            }),
            displayName: new FormControl(null, {
                updateOn: "blur",
                validators: [Validators.minLength(3), Validators.maxLength(120)]
            }),
            gender: new FormControl('female', {updateOn: 'blur', validators: [Validators.required]}),
            mobileNumber: new FormControl(null, {
                updateOn: 'blur',
                validators: [
                    Validators.required,
                    Validators.pattern("^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$"),
                    Validators.minLength(10),
                    Validators.maxLength(10)
                ]}
            ),
        });
    }

    get formCtrls() { return this.customerForm.controls; }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel', 'customer-add-popup-modal');
    }

    saveCustomerData() {
        this.customerForm.markAllAsTouched();
        this.customerForm.markAsDirty();
        if (!this.customerForm.valid) return;
        const formData = this.customerForm.value;
        if (this.customerList && this.customerList.length > 0) {
            let duplicateCustomerWithName: any;
            let duplicateCustomerWithPhone: any;
            if (this.operationType === "update" && this.customerData) {
                duplicateCustomerWithName = this.customerList.find((x: any) =>
                    x.full_name &&
                    x.full_name.toLowerCase() === formData.fullName.toLowerCase() &&
                    x._id !== this.customerData._id
                );
                duplicateCustomerWithPhone = this.customerList.find((x: any) =>
                    x.phone === `${formData.mobileNumber}` &&
                    x._id !== this.customerData._id
                );
            } else {
                duplicateCustomerWithName = this.customerList.find((x: any) =>
                    x.full_name &&
                    x.full_name.toLowerCase() === formData.fullName.toLowerCase()
                );
                duplicateCustomerWithPhone = this.customerList.find((x: any) => x.phone === `${formData.mobileNumber}`);
            }
            this.duplicateName = !!duplicateCustomerWithName;
            this.duplicateNumber = !!duplicateCustomerWithPhone;
            if (duplicateCustomerWithName || duplicateCustomerWithPhone) return;
        }
        if (this.operationType === "add") {
            this.addCustomer(formData);
        } else {
            this.updateCustomer(formData);
        }
    }

    addCustomer(formData: any) {
        const customerData: any = {
            "customer_id": "CU" + this.getCustomerId(),
            "full_name": formData.fullName,
            "display_name": formData.displayName,
            "phone": `${formData.mobileNumber}`,
            "joined_date": moment(new Date()).format("YYYY-MM-DD"),
            "gender": formData.gender,
            "created_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ"),
            "updated_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ")
        };
        this.loadingCtrl.create({
            message: "Saving customer data",
        }).then(loadingEl => {
            loadingEl.present();
            const addCustomerSub = this.customerService.addCustomer(customerData).subscribe(
                (response: any) => {
                    customerData._id = response.name;
                    loadingEl.dismiss();
                    this.showToast("Data saved successfully!");
                    const modelData = {
                        name: "customer",
                        data: customerData,
                        customerId: response,
                        type: "add"
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'customer-add-popup-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(addCustomerSub);
        });
    }

    updateCustomer(formData: any) {
        const customerData: any = {
            "customer_id": this.customerData.customer_id,
            "full_name": formData.fullName,
            "display_name": formData.displayName,
            "phone": `${formData.mobileNumber}`,
            "joined_date": this.customerData.joined_date,
            "gender": formData.gender,
            "created_date": this.customerData.created_date,
            "updated_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ")
        };
        this.loadingCtrl.create({
            message: "Updating customer data",
        }).then(loadingEl => {
            loadingEl.present();
            const updateCustomerSub = this.customerService.updateCustomer(customerData, this.customerData._id).subscribe(
                (response: any) => {
                    loadingEl.dismiss();
                    this.showToast("Data updated successfully!");
                    const modelData = {
                        name: "customer",
                        data: customerData,
                        customerId: response,
                        type: "update"
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'customer-add-popup-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(updateCustomerSub);
        });
    }

    getCustomerId() {
        let customerIds = [];
        for (const cust of this.customerList) {
            if (cust.customer_id) customerIds.push(cust.customer_id.substring(2, cust.customer_id.length));
        }
        customerIds = customerIds.map((x: any) => +x);
        customerIds.sort((a: number, b: number) => a - b);
        return customerIds.length > 0 ? customerIds[customerIds.length - 1] + 1 : 1000;
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
