import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { UserService } from 'app-services';


@Component({
    selector: 'app-requests',
    templateUrl: './requests.page.html',
    styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {

    pendingRequests: any[];
    declinedRequests: any[];
    expiredRequests: any[];

    constructor(
        private userService: UserService,
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.getRelationRequestData();
    }

    getRelationRequestData() {
        this.userService.getRelationRequests().pipe(take(1)).subscribe(
            (response: any) => {
                console.log(response);
                if (!response) return;
                this.pendingRequests = response.pending;
                this.declinedRequests = response.declined;
                this.expiredRequests = response.expired;
            },
            error => {
                console.log(error);
            }
        )
    }

}
