/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as moment from 'moment';

import { environment } from 'src/environments/environment';
import { AuthResponse, User } from 'app-models';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    _user = new BehaviorSubject<User>(null);

    envKeys: any;
    redirectUrl: string;

    constructor(
        private http: HttpClient,
    ) {
        this.envKeys = environment;
    }

    get user() {
        return this._user.asObservable();
    }

    setUser(resData: any) {
        const expirationTime = moment().add(+resData.expiresIn, 's').format();
        const user = new User(
            resData.email,
            resData.localId,
            resData.displayName,
            resData.photoUrl,
            resData.passwordHash,
            resData.idToken,
            resData.refreshToken,
            expirationTime
        );
        localStorage.setItem('userDetails', JSON.stringify(user));
        this._user.next(user);
    }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.envKeys.webApiKey,
            {email, password, returnSecureToken: true}
        ).pipe(
            tap(resData => {
                this.setUser(resData);
            })
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.envKeys.webApiKey,
            {email, password, returnSecureToken: true}
        ).pipe(
            tap(resData => {
                this.setUser(resData);
            })
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

    getNewToken(refreshToken: string) {
        return this.http.post(
            'https://securetoken.googleapis.com/v1/token?key=' + this.envKeys.webApiKey,
            {grant_type: 'refresh_token', refresh_token: refreshToken}
        );
    }

}
