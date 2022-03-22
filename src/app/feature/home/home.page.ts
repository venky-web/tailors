import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';

import { FeatureCard, FEATURES_LIST } from './cards';
import { UserService } from 'app-services';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

    features: FeatureCard[];

    constructor(
        private router: Router,
        private userService: UserService,
    ) {
        this.features = FEATURES_LIST;
    }

    ngOnInit(): void {
        
    }

    ngAfterViewInit() {
        const userDetails = this.userService.user;
        if (userDetails) {
            this.features.forEach((x: FeatureCard) => {
                if (x.name === "Customers" || x.name === "Employees") {
                    x.hasAccess = userDetails.user_role === "business_admin" ||
                        userDetails.user_role === "business_staff";
                }
            });
        }
    }

    onClickTile(routeUrl: string) {
        console.log(routeUrl);
        this.router.navigateByUrl(routeUrl);
    }

}
