import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { Storage } from '@capacitor/storage';

import { environment } from 'src/environments/environment';
import { AuthResponse, User } from 'app-models';
import { CommonService } from './common.service';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    _userDetails = new BehaviorSubject<User>(null);
    
    envKeys: any;
    redirectUrl: string;
    
    private _user: User;

    constructor(
        private http: HttpClient,
        private router: Router,
        private commonService: CommonService,
    ) {
        this.envKeys = environment;
        this.loadData();
    }

    loadData() {
        Storage.get({key: 'userDetails'}).then((storageVal: any) => {
            if (storageVal && storageVal.value) {
                const user: User = JSON.parse(storageVal.value);
                this.updateStorage(user);
            }  
        });
    }

    get user() {
        return this._userDetails.asObservable();
    }

    get userDetails(): User {
        return this._user;
    }

    setUserId(userId: string, updateStorage: boolean = true) {
        this._user.userId = userId;
        if (updateStorage) {
            this.updateStorage(this._user);
        }
    }

    setUserName(userName: string, updateStorage: boolean = true) {
        this._user.displayName = userName;
        if (updateStorage) {
            this.updateStorage(this._user);
        }
    }

    setToken(token: string, updateStorage: boolean = true) {
        this._user.token = token;
        if (updateStorage) {
            this.updateStorage(this._user);
        }
    }

    setRefreshToken(refreshToken: string, updateStorage: boolean = true) {
        this._user.refreshToken = refreshToken;
        if (updateStorage) {
            this.updateStorage(this._user);
        }
    }

    setExpireTime(expiresIn: string, updateStorage: boolean = true) {
        const expirationTime = moment().add(+expiresIn, 's').format();
        this._user.expiresIn = expirationTime;
        if (updateStorage) {
            this.updateStorage(this._user);
        }
    }

    setUser(resData: any) {
        const expirationTime = moment().add(+resData.expiresIn, 's').format();
        const user: User = {
            email: resData.email,
            userId: resData.localId,
            displayName: resData.displayName,
            photoUrl: resData.photoUrl,
            passwordHash: resData.passwordHash,
            token: resData.idToken,
            refreshToken: resData.refreshToken,
            expiresIn: expirationTime
        };
        this.updateStorage(user);
    }

    signUp(payload: any, isBusiness: boolean) {
        let url = this.commonService.accountServiceUrl + "create/";
        if (isBusiness) {
            url = this.commonService.accountServiceUrl + "business/create/";
        }
        return this.http.post(url, payload).pipe(
            tap(resData => {
                this.setUser(resData);
            })
        );
    }

    login(username: string, password: string) {
        return this.http.post(
            this.commonService.coreServiceUrl + "login/",
            {username, password}
        );
    }

    getAccessToken() {
        return this.http.get(
            this.commonService.coreServiceUrl + "token/",
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

    getUserProfile(idToken: string) {
        return this.http.post(
            'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + this.envKeys.webApiKey,
            {idToken}
        );
    }

    updateProfile(payload: any) {
        return this.http.post(
            'https://identitytoolkit.googleapis.com/v1/accounts:update?key=' + this.envKeys.webApiKey,
            payload
        );
    }

    async logout() {
        await Storage.clear();
        this.router.navigateByUrl('/auth');
    }

    private updateStorage(user: User) {
        Storage.set({key: 'userDetails', value: JSON.stringify(user)});
        this._user = user;
        this._userDetails.next(user);
    }

}
