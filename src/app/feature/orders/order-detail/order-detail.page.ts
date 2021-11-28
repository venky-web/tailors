import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { cloneDeep } from 'lodash';

import { Customer, Order, OrderItem } from 'app-models';
import { OrderService } from 'app-services';
import { AddOrderItemComponent } from '../add-order-item/add-order-item.component';


@Component({
	selector: 'app-order-detail',
	templateUrl: './order-detail.page.html',
	styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

	subscriptions: Subscription[];
	orderDetails: Order;
	customerDetails: Customer;
	orderId: any;
	platforms: string[];
	isDesktop: boolean;

	orderItemsCols: any[];
	orderItemsList: any[];

	constructor(
		private route: ActivatedRoute,
		private platform: Platform,
		private orderService: OrderService,
		private modalController: ModalController,
		private actionSheetController: ActionSheetController,
		private alertController: AlertController,
	) {
		this.platforms = this.platform.platforms();
		this.isDesktop = this.platforms.includes('desktop') || this.platforms.includes('tablet');
		this.subscriptions = [];
	}

	ngOnInit() {
		this.route.paramMap.subscribe((params: any) => {
			if (params && params.get('orderId')) {
				this.orderId = params.get('orderId');
				this.getOrderDetails();
			}
		});
		this.orderItemsCols = [
			{ field: 'type', header: 'Type' },
			{ field: 'comments', header: 'Comments' },
			{ field: 'deliveryDate', header: 'Delivery Date' },
			{ field: 'itemPrice', header: 'Amount' },
			{ field: 'quantity', header: 'Qty' },
			{ header: 'Actions' },
		];
	}

	getOrderDetails() {
		const getOrderDetailsSub = this.orderService.getOrderDetails(this.orderId).subscribe(
			(response: any) => {
				this.orderDetails = response;
				this.orderDetails.orderId = this.orderId;
				this.orderItemsList = this.orderDetails.items;
			}
		);
		this.subscriptions.push(getOrderDetailsSub);
	}

	addItem() {
		this.modalController.create({
			component: AddOrderItemComponent,
			componentProps: {
				loadedOrder: cloneDeep(this.orderDetails),
			},
			id: 'order-item-add-modal'
		}).then((modalEl: HTMLIonModalElement) => {
			modalEl.present();
			return modalEl.onDidDismiss();
		}).then((resultData: any) => {
			if (resultData && resultData.role === 'confirm') {
				this.orderDetails = resultData.data;
				this.orderItemsList = this.orderDetails.items;
			}
		});
	}

	onEditOrderItem(orderItem: OrderItem) {
		if (!orderItem) { return; }
		this.modalController.create({
			component: AddOrderItemComponent,
			componentProps: {
				loadedOrder: cloneDeep(this.orderDetails),
				loadedOrderItem: cloneDeep(orderItem)
			},
			id: 'order-item-add-modal'
		}).then((modalEl: HTMLIonModalElement) => {
			modalEl.present();
			return modalEl.onDidDismiss();
		}).then((resultData: any) => {
			if (resultData && resultData.role === 'confirm') {
				this.orderDetails = resultData.data;
				this.orderItemsList = this.orderDetails.items;
			}
		});
	}

	onDeleteOrderItem(orderItemId: number) {
		if (!orderItemId) { return; }
		const order = cloneDeep(this.orderDetails);
		const orderId = order.orderId;
		order.items = this.orderItemsList.filter((o: OrderItem) =>
			o.itemId === orderItemId
		);
		delete order.orderId;
		const updateOrderItemSub = this.orderService.updateOrder(order, orderId).subscribe(
			(response: Order) => {
				response.orderId = orderId;
				this.orderDetails = response;
				this.orderItemsList = response.items;
			}
		);
		this.subscriptions.push(updateOrderItemSub);
	}

	async presentActionSheet(orderItem: OrderItem) {
		this.actionSheetController.create({
			header: 'Albums',
			cssClass: 'my-custom-class',
			buttons: [
			{
				text: 'Delete',
				role: 'destructive',
				icon: 'trash',
				handler: () => {
					this.presentAlertConfirm(orderItem.itemId);
				}
			},
			{
				text: 'Edit',
				icon: 'create',
				handler: () => {
					this.onEditOrderItem(orderItem);
				}
			},
			{
				text: 'Cancel',
				icon: 'close',
				role: 'cancel',
			}]
		}).then((actionSheetEl: HTMLIonActionSheetElement) => {
			actionSheetEl.present();
		});
	}

	presentAlertConfirm(orderItemId: number) {
		this.alertController.create({
			header: 'Confirm!',
			message: 'This order item will be deleted permanently',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
				},
				{
					text: 'Delete',
					role: 'destructive',
					handler: () => {
						this.onDeleteOrderItem(orderItemId);
					}
				}
			]
		}).then((alertEl: HTMLIonAlertElement) => {
			alertEl.present();
		});
	}

}
