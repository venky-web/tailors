import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { User } from 'app-models';
import { AuthService } from 'app-services';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const userDetails: User = localStorage.getItem('userDetails')
            ? JSON.parse(localStorage.getItem('userDetails'))
            : null;
        if (userDetails) {
            if(!userDetails.expiresIn || moment(userDetails.expiresIn).unix() <= moment().unix()) {
                this.router.navigate(['/auth']);
                this.authService.redirectUrl = state.url;
                return false;
            }
        } else {
            this.router.navigate(['/auth']);
            this.authService.redirectUrl = state.url;
            return false;
        }
        return true;
    }

}
