import { Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { Storage } from '@capacitor/storage';

import { User } from 'app-models';
import { AuthService } from './auth.service';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanLoad {

    constructor(
        private router: Router,
        private authService: AuthService,
    ) { }

    async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
        const userDetails = await Storage.get({key: 'userDetails'});
        if (userDetails && userDetails.value) {
            // const user: User = JSON.parse(userDetails.value);
            // if(!user.expiresIn || moment(user.expiresIn).unix() <= moment().unix()) {
            //     this.router.navigate(['/auth']);
            //     this.authService.redirectUrl = route.path;
            //     return false;
            // }
            return true;
        } else {
            this.router.navigate(['/auth']);
            this.authService.redirectUrl = route.path;
            return false;
        }
        // return true;
    };

}
