import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Storage } from '@capacitor/storage';

import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';
import { UserService } from './user.service';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    envKeys: any;
    redirectUrl: string;
    
    constructor(
        private http: HttpClient,
        private router: Router,
        private commonService: CommonService,
        private userService: UserService,
    ) {
        this.envKeys = environment;
    }

    signUp(payload: any, isBusiness: boolean) {
        let url = this.commonService.accountServiceUrl + "create/";
        if (isBusiness) {
            url = this.commonService.accountServiceUrl + "business/create/";
        }
        return this.http.post(url, payload);
    }

    login(username: string, password: string) {
        return this.http.post(
            this.commonService.coreServiceUrl + "login/",
            {username, password}
        );
    }

    getAccessToken() {
        return this.http.post(
            this.commonService.coreServiceUrl + "token/",
            {refresh_token: this.userService.refreshToken}
        );
    }

    activateUser(data: any) {
        return this.http.post(
            this.commonService.coreServiceUrl + "activate-user/",
            data
        );
    }

    activateStaffUser(data: any) {
        return this.http.post(
            this.commonService.coreServiceUrl + "activate-staff/",
            data
        );
    }

    async logout() {
        await Storage.clear();
        this.router.navigateByUrl('/auth');
    }

}
