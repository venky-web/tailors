import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { cloneDeep } from 'lodash';
import * as moment from 'moment';

import { Order, OrderItem, User } from 'app-models';
import { AuthService, OrderService } from 'app-services';
import { AppUtils } from 'app-shared';
import { take } from 'rxjs/operators';


@Component({
	selector: 'app-add-order-item',
	templateUrl: './add-order-item.component.html',
	styleUrls: ['./add-order-item.component.scss'],
})
export class AddOrderItemComponent implements OnInit, OnDestroy {

	@Input() loadedOrder: Order;
	@Input() loadedOrderItem: OrderItem;

	subscriptions: Subscription[];
	orderItemForm: FormGroup;
	appUtils: any;
	userDetails: User;

	itemTypes: any[];
	itemPrices: any[];
	statusList: string[];
	minDeliveryDate: any;
	maxDeliveryDate: any;

	constructor(
		private modalCtrl: ModalController,
		private orderService: OrderService,
		private authService: AuthService,
	) {
		this.subscriptions = [];
		this.appUtils = AppUtils;
		this.setConfigurations();
	}

	ngOnInit() {
		this.orderItemForm = this.createForm();
		if (this.loadedOrderItem) {
			this.patchForm(this.loadedOrderItem);
		}
		// this.authService.user.pipe(take(1)).subscribe(
		// 	(user: any) => {
		// 		if (user) {
		// 			this.userDetails = user;
		// 		}
		// 	}
		// );
	}

	ngOnDestroy() {
		if (this.subscriptions) {
			this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
		}
	}

	setConfigurations() {
		this.statusList = this.appUtils.statuses;
		this.itemTypes = this.appUtils.itemTypes;
		this.minDeliveryDate = moment().format();
		this.maxDeliveryDate = moment().add(60, 'days').format();
	}

	createForm() {
		return new FormGroup({
			type: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
			quantity: new FormControl(1, {updateOn: 'change', validators: [Validators.required, Validators.min(1), Validators.max(500)]}),
			itemPrice: new FormControl(1, {updateOn: 'change', validators: [Validators.required, Validators.min(0)]}),
			status: new FormControl('not yet started', {updateOn: 'blur', validators: [Validators.required]}),
			deliveryDate: new FormControl(new Date().toISOString(), {updateOn: 'blur', validators: [Validators.required]}),
			comments: new FormControl(null, {updateOn: 'blur', validators: [Validators.maxLength(500)]}),
		});
	}

	get formCtrls() { return this.orderItemForm.controls; }

	patchForm(orderItem: OrderItem) {
		if (!orderItem) { return; }
		this.orderItemForm.patchValue({
			type: orderItem.type,
			quantity: orderItem.quantity,
			itemPrice: orderItem.itemPrice,
			status: orderItem.status,
			deliveryDate: orderItem.deliveryDate,
			comments: orderItem.comments,
		});
	}

	onCancel() {
		this.modalCtrl.dismiss(null, 'cancel', 'order-item-add-modal');
	}

	onSubmit() {
		this.orderItemForm.markAllAsTouched();
		this.orderItemForm.markAsDirty();
		if (!this.orderItemForm.valid) {
			return;
		}
		const formData = this.appUtils.getTrimmedObj(this.orderItemForm.value);
		const orderItem: OrderItem = this.constructOrderItem(formData);
		if (this.loadedOrder) {
			orderItem.updatedBy = this.userDetails ? this.userDetails.userId : null;
			if (this.loadedOrderItem) {
				const orderItemIndex = this.loadedOrder.items.findIndex((o: OrderItem) =>
					o.itemId === this.loadedOrderItem.itemId
				);
				this.loadedOrder.items[orderItemIndex] = cloneDeep(orderItem);
			} else {
				orderItem.createdBy = this.userDetails ? this.userDetails.userId : null;
				this.loadedOrder.items.push(orderItem);
			}
			this.loadedOrder.updatedDate = moment().format();
			this.loadedOrder.updatedBy = this.userDetails ? this.userDetails.userId : null;
			this.loadedOrder.totalAmount = this.getTotalAmount(this.loadedOrder.items);
			this.loadedOrder.deliveryDate = this.getDeliveryDate(this.loadedOrder.items);
			this.updateOrderItem(this.loadedOrder);
		} else {
			const newOrder: Order= {
				createdDate: moment().format(),
				updatedDate: moment().format(),
				createdBy: this.userDetails ? this.userDetails.userId : null,
				updatedBy: this.userDetails ? this.userDetails.userId : null,
				deliveryDate: formData.deliveryDate,
				items: [],
				status: formData.status,
				comments: formData.comments,
			};
			newOrder.items.push(orderItem);
			newOrder.totalAmount = this.getTotalAmount(newOrder.items);
			newOrder.deliveryDate = this.getDeliveryDate(newOrder.items);
			this.addOrderItem(newOrder);
		}
	}

	addOrderItem(order: Order) {
		const addOrderItemSub = this.orderService.addOrder(order).subscribe((response: any) => {
			order.orderId = response.name;
			this.modalCtrl.dismiss(order, 'confirm', 'order-item-add-modal');
		});
		this.subscriptions.push(addOrderItemSub);
	}

	updateOrderItem(order: Order) {
		const orderId = order.orderId;
		delete order.orderId;
		const updateOrderItemSub = this.orderService.updateOrder(order, orderId).subscribe(
			(response: Order) => {
				response.orderId = orderId;
				this.modalCtrl.dismiss(response, 'confirm', 'order-item-add-modal');
			}
		);
		this.subscriptions.push(updateOrderItemSub);
	}

	constructOrderItem(formData: any) {
		const orderItem: OrderItem = {
			itemId: this.loadedOrderItem ? this.loadedOrderItem.itemId : moment().unix(),
			type: formData.type,
			quantity: formData.quantity,
			itemPrice: formData.itemPrice,
			status: formData.status,
			deliveryDate: formData.deliveryDate,
			comments: formData.comments,
		};
		return orderItem;
	}

	getTotalAmount(items: OrderItem[]) {
		let totalAmount = 0;
		for (const item of items) {
			totalAmount += +item.quantity * +item.itemPrice;
		}
		return +totalAmount.toFixed(2);
	}

	getDeliveryDate(items: OrderItem[]) {
		const deliveryDates = [...new Set(items.map((item: OrderItem) => item.deliveryDate))] as string[];
		const moments = deliveryDates.map(d => moment(d));
   		const minDate = moment.min(moments).format();
		return minDate;
	}

}
