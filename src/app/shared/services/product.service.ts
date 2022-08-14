/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { take } from "rxjs/operators";

import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})
export class ProductService {

    env: any;

    constructor(
        private http: HttpClient,
    ) {
        this.env = environment;
    }

    getProducts() {
		return this.http.get(`${this.env.fireBaseAPI}products.json`);
	}

    addProduct(newProduct: any) {
        return this.http.post(`${this.env.fireBaseAPI}products.json`, newProduct)
		.pipe(
			take(1)
		);
    }

	getProductDetails(id: string) {
		return this.http.get(`${this.env.fireBaseAPI}products/${id}.json`)
		.pipe(
			take(1)
		);
	}

    updateProduct(productData: any, id: string) {
        return this.http.put(`${this.env.fireBaseAPI}products/${id}.json`, productData)
		.pipe(
			take(1)
		);
    }

    deleteProduct(id: string) {
        return this.http.delete(`${this.env.fireBaseAPI}products/${id}.json`)
		.pipe(
			take(1)
		);
    }

}
