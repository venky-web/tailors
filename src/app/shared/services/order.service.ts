/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { map, take, tap } from 'rxjs/operators';

import { environment } from "src/environments/environment";
import { Order } from "app-models";


@Injectable({
    providedIn: 'root'
})
export class OrderService {

    envKeys: any;
    orders: Order[] = [];

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
        this.orders = orders;
        this.orderListSubject.next(orders);
    }

    getOrders() {
        return this.http.get<{[key: string]: Order}>(`${this.envKeys.fireBaseAPI}orders.json`).pipe(
            map(resData => {
                console.log(resData);
                const orders = [] as Order[];
                for (const key in resData) {
                    if (resData.hasOwnProperty(key)) {
                        const order: Order = {
                            orderId: key,
                            createdDate: resData[key].createdDate,
                            updatedDate: resData[key].updatedDate,
                            deliveryDate: resData[key].deliveryDate,
                            isOneTimeDelivery: resData[key].isOneTimeDelivery,
                            customerId: resData[key].customerId,
                            customerName: resData[key].customerName,
                            totalAmount: resData[key].totalAmount,
                            items: resData[key].items,
                            status: resData[key].status,
                            comments: resData[key].comments,
                        };
                        orders.push(order);
                    }
                }
                return orders;
            }),
            tap(orders => {
                this.updateOrdersList(orders);
            })
        );
    }

    getOrderDetails(orderId: string) {
        return this.http.get(`${this.envKeys.fireBaseAPI}orders/${orderId}.json`)
		.pipe(
			take(1)
		);
    }

    addOrder(newOrder: Order) {
        return this.http.post<{name: string}>(`${this.envKeys.fireBaseAPI}orders.json`, newOrder)
        .pipe(
            take(1),
        );
    }

    updateOrder(order: Order, orderId: string) {
        return this.http.put(`${this.envKeys.fireBaseAPI}orders/${orderId}.json`, order)
        .pipe(
            take(1),
        );
    }

    deleteOrder() {}

}
