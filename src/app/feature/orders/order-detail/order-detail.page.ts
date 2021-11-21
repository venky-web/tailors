import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

import { CustomerModel, Order } from 'app-models';
import { OrderService } from 'app-services';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  orderDetails: Order;
  customerDetails: CustomerModel;
  orderId: any;
  platforms: string[];
  isDesktop: boolean;

  constructor(
    private route: ActivatedRoute,
    private platform: Platform,
    private orderService: OrderService,
  ) {
    this.platforms = this.platform.platforms();
    this.isDesktop = this.platforms.includes('desktop') || this.platforms.includes('tablet');
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      console.log(params);
      if (params && params.get('orderId')) {
        this.orderId = params.get('orderId');
        this.getOrderDetails();
      }
    });
  }

  getOrderDetails() {
    this.orderDetails = this.orderService.getOrderDetails(this.orderId);
  }

}
