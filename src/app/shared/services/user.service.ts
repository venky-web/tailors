/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Storage } from '@capacitor/storage';

import { CommonService } from './common.service';


@Injectable({
  	providedIn: 'root'
})
export class UserService {

    private _user: any;
    private _business: any;
    private _token: string;
    private _refreshToken: string;
	
	constructor(
		private http: HttpClient,
        private commonService: CommonService,
	) {}

	get user() {
		return this._user;
	}

    get business() {
        return this._business;
    }

    get accessToken() {
        return this._token;
    }

    get refreshToken() {
        return this._refreshToken;
    }

	setUser(user: any, updateStorage: boolean = true) {
        if (!user) { return; }
		this._user = user;
        if (updateStorage) {
            Storage.set({key: 'userDetails', value: JSON.stringify(user)});
        }
	}

    setBusiness(business: any, updateStorage: boolean = true) {
        if (!business) { return; }
        this._business = business;
        if (updateStorage) {
            Storage.set({key: 'bDetails', value: JSON.stringify(business)});
        }
    }

    setAccessToken(token: string, updateStorage: boolean = true) {
        if (!token) { return; }
        this._token = token;
        if (updateStorage) {
            Storage.set({key: 'token', value: token});
        }
    }

    setRefreshToken(token: string, updateStorage: boolean = true) {
        if (!token) { return; }
        this._refreshToken = token;
        if (updateStorage) {
            Storage.set({key: 'refreshToken', value: token});
        }
    }

	createUser(userData: any) {
		return this.http.post(
            `${this.commonService.accountServiceUrl}create/`,
            userData
        );
	}

	createBusinessUser(userData: any) {
		return this.http.post(
            `${this.commonService.accountServiceUrl}business/create/`,
            userData
        );
	}

	createBusinessStaff(userData: any) {
		return this.http.post(
            `${this.commonService.accountServiceUrl}`,
            userData
        );
	}

    getUsers() {
        return this.http.get(
            `${this.commonService.accountServiceUrl}`
        );
    }

    getUserDetails(userId: any) {
        return this.http.get(
            `${this.commonService.accountServiceUrl}${userId}/`
        );
    }

    updateUserDetails(userData: any, userId: any) {
        return this.http.put(
            `${this.commonService.accountServiceUrl}${userId}/`,
            userData
        );
    }

    disableUser(userId: any) {
        return this.http.delete(
            `${this.commonService.accountServiceUrl}${userId}/`
        );
    }

    getBusinessDetails(businessId: any) {
        return this.http.get(
            `${this.commonService.accountServiceUrl}business/${businessId}/`
        );
    }

    updateBusinessDetails(businessData: any, businessId: any) {
        return this.http.put(
            `${this.commonService.accountServiceUrl}business/${businessId}/`,
            businessData
        );
    }

    deleteBusiness(businessId: any) {
        return this.http.delete(
            `${this.commonService.accountServiceUrl}business/${businessId}/`
        );
    }

    saveProfileData(userId: any, profileData: any) {
        return this.http.put(
            `${this.commonService.accountServiceUrl}profile/${userId}/`,
            profileData
        );
    }

}
