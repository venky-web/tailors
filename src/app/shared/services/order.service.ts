/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

import { environment } from "src/environments/environment";
import { Order } from "app-models";


@Injectable({
    providedIn: 'root'
})
export class OrderService {

    orders: Order[] = [
        {
            orderId: "1",
            customerId: "c1",
            delivaryDate: "20-11-2021",
            customerName: "abc",
            totalAmount: 500,
            items: [
                {
                    type: "blouse",
                    itemPrice: 150,
                    quantity: 2,
                    status: "completed"
                },
                {
                    type: "gown",
                    itemPrice: 550,
                    quantity: 1,
                    status: "Work in progress"
                },
            ],
            status: "active",
        },
        {
            orderId: "2",
            customerId: "c2",
            delivaryDate: "23-11-2021 05:30:00 PM",
            customerName: "def",
            totalAmount: 1200,
            items: [
                {
                    type: "blouse",
                    itemPrice: 150,
                    quantity: 2,
                    status: "completed"
                },
            ],
            status: "active",
        },
    ];
    envKeys: any;

    private orderListSubject: BehaviorSubject<Order[]> = new BehaviorSubject([]);

    get orderList() {
        return this.orderListSubject.asObservable();
    }

    constructor(
        private http: HttpClient,
    ) {
        this.updateOrdersList(this.orders);
        this.envKeys = environment;
    }

    updateOrdersList(orders: Order[]) {
        this.orderListSubject.next(orders);
    }

    getOrdersList() {}

    getOrderDetails(orderId: string) {
        return this.orders.find((o: Order) => o.orderId === orderId);
    }

    addOrder(newOrder: Order) {
        return this.http.post(`${this.envKeys.fireBaseAPI}orders.json`, newOrder);
    }

    updateOrderDetails() {}

    deleteOrder() {}

}
