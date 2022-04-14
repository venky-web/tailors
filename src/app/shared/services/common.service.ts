import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


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

    private envKeys: any;

    constructor() {
        this.envKeys = environment;
        this.isProduction = false;
        this.protocol = window.location.protocol;
        this.host = window.location.hostname;
        this.port = window.location.port;
 
        const devEnvURL =  this.envKeys.api_host;
        this.coreServiceUrl = devEnvURL + '/api/core/';
        this.accountServiceUrl = devEnvURL + '/api/accounts/';
        this.productServiceUrl = devEnvURL + '/api/products/';
        this.orderServiceUrl = devEnvURL + '/api/orders/';

        if (this.isProduction) {
            const prodEnvURL = this.envKeys.api_host;
            this.coreServiceUrl = prodEnvURL + '/api/core/';
            this.accountServiceUrl = prodEnvURL + '/api/accounts/';
            this.productServiceUrl = prodEnvURL + '/api/products/';
            this.orderServiceUrl = prodEnvURL + '/api/orders/';
        }

    }


}
