import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class CommonService {

    isProduction: boolean;
    protocol: string;
    host: string;
    port: string;
    parsedUrl: string;

    coreServiceUrl: string;
    accountServiceUrl: string;
    productServiceUrl: string;
    orderServiceUrl: string;

    constructor() {
        this.isProduction = false;
        this.protocol = window.location.protocol;
        this.host = window.location.hostname;
        this.port = window.location.port;
 
        const devEnvURL =  "http://127.0.0.1:8000";
        this.coreServiceUrl = devEnvURL + '/api/core/';
        this.accountServiceUrl = devEnvURL + '/api/accounts/';
        this.productServiceUrl = devEnvURL + '/api/products/';
        this.orderServiceUrl = devEnvURL + '/api/orders/';

        if (this.isProduction) {
            const prodEnvURL = this.protocol + '//' + this.host + ':' + this.port;
            this.coreServiceUrl = prodEnvURL + '/api/core/';
            this.accountServiceUrl = prodEnvURL + '/api/accounts/';
            this.productServiceUrl = prodEnvURL + '/api/products/';
            this.orderServiceUrl = prodEnvURL + '/api/orders/';
        }

    }


}
