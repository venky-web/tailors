import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { cloneDeep } from 'lodash';
import * as moment from 'moment';

import { Customer } from 'app-models';
import { CustomerService } from 'app-services';
import { AppUtils } from 'app-shared';


@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit, OnDestroy {

  	@Input() loadedCustomer: Customer;

	subscriptions: Subscription[];
	customerForm: FormGroup;
	appUtils: any;

	customAlertOptions: any = {
		subHeader: 'Select Item Type',
		translucent: true
	};

	constructor(
		private modalCtrl: ModalController,
		private customerService: CustomerService,
	) {
		this.subscriptions = [];
		this.appUtils = AppUtils;
	}

	ngOnInit() {
		this.customerForm = this.createForm();
		if (this.loadedCustomer) {
			this.patchForm(this.loadedCustomer);
		}
	}

	ngOnDestroy() {
		if (this.subscriptions) {
			this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
		}
	}

	createForm() {
		return new FormGroup({
			name: new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.minLength(3)]}),
			mobileNumber: new FormControl(null),
			gender: new FormControl('female', {updateOn: 'blur', validators: [Validators.required]}),
			status: new FormControl('active', {updateOn: 'blur', validators: [Validators.required]}),
		});
	}

	get formCtrls() { return this.customerForm.controls; }

	patchForm(customerData: Customer) {
		this.customerForm.patchValue({
			name: customerData.name,
			mobileNumber: customerData.mobileNumber,
			gender: customerData.gender,
			status: customerData.status,
		});
	}

	onCancel() {
		this.modalCtrl.dismiss(null, 'cancel', 'customer-add-modal');
	}

	onSubmit() {
		this.customerForm.markAllAsTouched();
		this.customerForm.markAsDirty();
		if (!this.customerForm.valid) {
			return;
		}
		const formData = this.appUtils.getTrimmedObj(this.customerForm.value);
		if (this.loadedCustomer) {
			const customerObj: Customer = cloneDeep(this.loadedCustomer);
			customerObj.name = formData.name;
			customerObj.mobileNumber = formData.mobileNumber;
			customerObj.gender = formData.gender;
			customerObj.status = formData.status;
			customerObj.updatedDate = moment().format();
			this.updateCustomer(customerObj);
		} else {
			const newCustomer: Customer = {
				name: formData.name,
				mobileNumber: formData.mobileNumber,
				gender: formData.gender,
				status: formData.status,
				createdDate: moment().format(),
				updatedDate: moment().format(),
			};
			this.addCustomer(newCustomer);
		}
	}

	addCustomer(newCustomer: Customer) {
		const addCustomerSub = this.customerService.addCustomer(newCustomer).subscribe(
			(response: {name: string}) => {
				newCustomer.id = response.name;
				this.modalCtrl.dismiss(newCustomer, 'confirm', 'customer-add-modal');
			}
		);
		this.subscriptions.push(addCustomerSub);
	}

	updateCustomer(customer: Customer) {
		const customerId = customer.id;
		delete customer.id;
		const updateCustomerSub = this.customerService.updateCustomer(customer, customerId).subscribe(
			(response: any) => {
				this.modalCtrl.dismiss(response, 'confirm', 'customer-add-modal');
			}
		);
		this.subscriptions.push(updateCustomerSub);
	}


}
