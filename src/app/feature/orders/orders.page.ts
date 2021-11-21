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
    });
  }

  onClickStatus() {

  }

  goToOrderDetails(orderId: number | string) {}

  addOrder() {}

}
