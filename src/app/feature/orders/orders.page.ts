import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, ModalController } from '@ionic/angular';

import { Order } from 'app-models';
import { OrderService } from 'app-services';
import { AddOrderItemComponent } from './add-order-item/add-order-item.component';


@Component({
	selector: 'app-orders',
	templateUrl: './orders.page.html',
	styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

	ordersList: Order[];
	platforms: string[];
	isDesktop: boolean;

	orderTableCols: any[];
	overViewData: {orderStatus: string; orderCount: number}[];

	constructor(
		private router: Router,
		private orderService: OrderService,
		private platform: Platform,
		private modalController: ModalController
	) {
		this.platforms = this.platform.platforms();
		this.isDesktop = this.platforms.includes('desktop');
	}

	ngOnInit() {
		this.orderService.orderList.subscribe((list: Order[]) => {
			this.ordersList = list;
			this.prepareOverviewData();
		});
		this.orderTableCols = [
			{ field: 'customerName', header: 'Customer Name' },
			{ field: 'status', header: 'Status' },
			{ field: 'delivaryDate', header: 'Delivery Date' },
			{ field: 'totalAmount', header: 'Total Amount' },
			{ field: 'items', header: 'Items' }
		];
	}

	ionViewWillEnter() {
		this.orderService.getOrders().subscribe();
	}

	prepareOverviewData() {
		const orderStatuses = [...new Set(this.ordersList.map((order: Order) => order.status))] as string[];
		this.overViewData = [];
		for (const status of orderStatuses) {
			this.overViewData.push({
				orderStatus: status,
				orderCount: this.ordersList.filter((o: Order) => o.status === status).length
			});
		}
	}

	onClickStatus() {}

	goToOrderDetails(orderId: number | string) {
		this.router.navigate(['/orders', orderId]);
	}

  	onFilterOrders() {}

	addOrderItem() {
		this.modalController.create({
			component: AddOrderItemComponent,
			id: 'order-item-add-modal'
		}).then((modalEl: HTMLIonModalElement) => {
			modalEl.present();
			return modalEl.onDidDismiss();
		}).then((resultData: any) => {
			console.log(resultData);
			if (resultData && resultData.role === 'confirm') {
				this.ordersList.push(resultData.data);
				this.orderService.updateOrdersList(this.ordersList);
			}
		});
	}


}
