import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, ModalController } from '@ionic/angular';

import { Order } from 'app-models';
import { OrderService } from 'app-services';


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

  prepareOverviewData() {
    this.overViewData = [
      {
        orderStatus: 'Completed',
        orderCount: this.ordersList.filter((o: Order) => o.status === 'Completed').length,
      },
      {
        orderStatus: 'Work in progress',
        orderCount: this.ordersList.filter((o: Order) => o.status === 'Work in progress').length,
      },
      {
        orderStatus: 'Delivered',
        orderCount: this.ordersList.filter((o: Order) => o.status === 'Delivered').length,
      },
      {
        orderStatus: 'Cancelled',
        orderCount: this.ordersList.filter((o: Order) => o.status === 'Cancelled').length,
      },
      {
        orderStatus: 'Delayed',
        orderCount: this.ordersList.filter((o: Order) => o.status === 'Delayed').length,
      },
      {
        orderStatus: 'Not yet started',
        orderCount: this.ordersList.filter((o: Order) => o.status === 'Not yet started').length,
      },
    ];
  }

  onClickStatus() {

  }

  goToOrderDetails(orderId: number | string) {
    this.router.navigate(['/orders', orderId]);
  }

  onFilterOrders() {}

  addOrder() {}

}
