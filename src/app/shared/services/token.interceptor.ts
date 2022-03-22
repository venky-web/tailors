/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Storage } from '@capacitor/storage';

import { AuthService } from './auth.service';
import { User } from '../models/auth.model';
import { AlertController } from '@ionic/angular';
import { UserService } from './user.service';
import { CommonService } from './common.service';

export interface RefreshTokenResponse {
	expires_in: string;
	token_type: string;
	refresh_token: string;
	id_token: string;
	user_id: string;
	project_id: string;
}

@Injectable({providedIn: 'root'})
export class TokenInterceptor implements HttpInterceptor {

	public envKeys: any;

	private userDetails: User;

	constructor(
		private authService: AuthService,
		private http: HttpClient,
		private router: Router,
		private alertController: AlertController,
		private userService: UserService,
		private commonService: CommonService,
	) {
		// this.authService.user.subscribe((value: any) => {
		// 	this.userDetails = value;
		// });
		// this.envKeys = environment;
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (request.url.includes('signUp') || 
			request.url.includes('signInWithPassword') ||
			request.url.includes('accounts/create') ||
			request.url.includes('business/create')
		) {
			return next.handle(request);
		}
		if (!request.headers.has('Content-Type')) {
			request = request.clone({
				headers: request.headers.set('Content-Type', 'application/json')
			});
		}

		request = this.addAuthenticationToken(request);

		return next.handle(request)
			.pipe(catchError((errRes: HttpErrorResponse) => {
				if (errRes && errRes.status === 401) {
					// 401 errors are most likely going to be because we have an expired token that we need to refresh.
					if (errRes.error.code && errRes.error.code === 'TOKEN_EXPIRED') {
						// If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
						// which means the new token is ready and we can retry the request again
						return this.authService.getAccessToken().pipe(
							switchMap((success: boolean) => {
								return next.handle(this.addAuthenticationToken(request));
							}),
							catchError(this.handleError),
						);
					} else {
						this.router.navigateByUrl('/auth');
						this.showAlert(errRes.statusText);
						Storage.clear();
					}
				} else if (errRes && errRes.error.detail) {
					this.showAlert(errRes.error.detail);
				} else {
					return throwError(errRes);
				}
			})
		);
	}

	private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
		// if (!this.userDetails.token) {
		// 	return request;
		// }
		// const authUrl = request.url + '?auth=' + this.userDetails.token;
		// request = request.clone({url: authUrl});
		if (!this.userService.accessToken) {
			return request;
		}
		request = request.clone({
			setHeaders: {Authorization: `Bearer ${this.userService.accessToken}`}
		});
		return request;
	}

	public handleError(error: any) {
		return throwError(error);
    }

	showAlert(message: string) {
		this.alertController.create({
			header: 'Alert',
			message: message,
			buttons: ['Okay']
		}).then((alertEl: HTMLIonAlertElement) => {
			return alertEl.present();
		});
	}

}
