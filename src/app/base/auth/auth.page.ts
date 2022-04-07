import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthService, UserService } from 'app-services';
import { AppUtils } from 'app-shared';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.page.html',
	styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {

	authForm: FormGroup;
	subscriptions: Subscription[];
	appUtils: any;

	isLogin: boolean;
	platforms: string[];
	isDesktop: boolean;

	constructor(
		private authService: AuthService,
		private userService: UserService,
		private router: Router,
		private platform: Platform,
		private loadingController: LoadingController,
		private alertController: AlertController,
	) {
		this.isLogin = true;
		this.platforms = this.platform.platforms();
		this.isDesktop = this.platforms.includes('desktop');
        this.subscriptions = [];
		this.appUtils = AppUtils;
	}

	ngOnInit() {
		this.createForm();
		// this.authForm = new FormGroup({
		// 	email: new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.email]}),
		// 	password: new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.minLength(6)]})
		// });
	}

	ngOnDestroy() {
		if (this.subscriptions) {
			this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
		}
	}

	ionViewDidLeave() {
		this.authForm.reset();
		this.isLogin = true;
		this.ngOnDestroy();
	}

	createForm() {
		this.authForm = new FormGroup({
			userName: new FormControl(null, {
				updateOn: "blur",
				validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
			}),
			password: new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.minLength(6)]})
		});
	}

	get formCtrls() { return this.authForm.controls; }

	changeForm() {
		this.authForm.reset();
		if (this.isLogin) {
			this.authForm.addControl(
				"email",
				new FormControl(null, {updateOn: 'blur', validators: [Validators.email]})
			);
			this.authForm.addControl(
				'password2',
				new FormControl(null, {updateOn: 'blur', validators: [Validators.required]})
			);
			this.authForm.addControl(
				'accountType',
				new FormControl("normal", {updateOn: 'change', validators: [Validators.required]})
			);
		} else {
			this.authForm.removeControl('password2');
			this.authForm.removeControl('email');
			this.authForm.removeControl('accountType');
		}
		this.isLogin = !this.isLogin;
	}

	onSubmit() {
		this.authForm.setErrors(null);
		this.authForm.markAllAsTouched();
		this.authForm.markAsDirty();
		if (!this.authForm.valid) { return; }
		const formData = this.appUtils.getTrimmedObj(this.authForm.value);
		if (!this.isLogin) {
			const passwordsMatch = formData.password === formData.password2;
			if (!passwordsMatch) {
				this.authForm.setErrors({misMatch: true});
				return;
			}
		}
		if (this.isLogin) {
			this.onLogin(formData);
		} else {
			this.signUp(formData);
		}
	}

	signUp(formData: any) {
		this.loadingController.create({
			message: 'Signing up...',
			showBackdrop: true,
			animated: true,
			backdropDismiss: false,
			keyboardClose: false,
			id: 'sign-up-spinner'
		}).then((loadingEl: HTMLIonLoadingElement) => {
			loadingEl.present();
			const signUpPayload: any = {
				username: formData.userName,
				email: formData.email,
				password: formData.password,
			};
			if (formData.businessName) {
				signUpPayload.business = {
					name: formData.businessName
				};
			}
			const signUpSub = this.authService.signUp(signUpPayload, this.authForm.controls.hasOwnProperty("businessName"))
				.subscribe((response: any) => {
					this.updateUserService(response);
					this.navigateToHomePage();
					loadingEl.dismiss();
				},
				errorRes => {
					loadingEl.dismiss();
					this.showErrorAlert(errorRes);
				});
			this.subscriptions.push(signUpSub);
		});
	}

	onLogin(formData: any) {
		this.loadingController.create({
			message: 'Logging in...',
			showBackdrop: true,
			animated: true,
			backdropDismiss: false,
			keyboardClose: false,
			id: 'login-spinner'
		}).then((loadingEl: HTMLIonLoadingElement) => {
			loadingEl.present();
			const loginSub = this.authService.login(formData.userName, formData.password).subscribe(
				(response: any) => {
					// this.getUserData(response.idToken, response.refreshToken, response.expiresIn);
					this.updateUserService(response);
					this.navigateToHomePage();
					loadingEl.dismiss();
				},
				errorRes => {
					loadingEl.dismiss();
					this.showErrorAlert(errorRes);
				}
			);
			this.subscriptions.push(loginSub);
		});
	}

	updateUserService(response: any) {
		this.userService.setUser(response.user);
		this.userService.setBusiness(response.user.business);
		this.userService.setAccessToken(response.access_token);
		this.userService.setRefreshToken(response.refresh_token);
	}

	getUserData(idToken: string, refreshToken?: string, expiresIn?: string) {
		const getUserDataSub = this.authService.getUserProfile(idToken).subscribe(
			(response: any) => {
				const userData = response.users[0];
				this.authService.setUser({
					...userData,
					idToken,
					photoUrl: null,
					refreshToken,
					expiresIn,
				});
				this.loadingController.dismiss(null, null, 'login-spinner');
				this.navigateToHomePage();
			},
			errorRes => {
				this.loadingController.dismiss(null, null, 'login-spinner');
				this.showErrorAlert(errorRes);
			}
		);
		this.subscriptions.push(getUserDataSub);
	}

	updateUserProfile(data: any, refreshToken?: string, expiresIn?: string) {
		const updateUserProfileSub = this.authService.updateProfile(data).subscribe(
			(response: any) => {
				this.authService.setUser({
					...response,
					idToken: data.idToken,
					photoUrl: null,
					refreshToken,
					expiresIn,
				});
				this.loadingController.dismiss(null, null, 'sign-up-spinner');
				this.navigateToHomePage();
			},
			errorRes => {
				this.loadingController.dismiss(null, null, 'sign-up-spinner');
				this.showErrorAlert(errorRes);
			}
		);
		this.subscriptions.push(updateUserProfileSub);
	}

	showErrorAlert(errorRes: any) {
		console.log(errorRes);
		let errorMsg = 'Could not complete the operation';
		switch(errorRes.error.error.message) {
			case 'EMAIL_EXISTS':
				errorMsg = 'Email already exists. Please try different email';
				break;
			case 'TOO_MANY_ATTEMPTS_TRY_LATER':
				errorMsg = 'Too many attempts. Try after some time.';
				break;
			case 'EMAIL_NOT_FOUND':
				errorMsg = 'Could not find the email. Please check';
				break;
			case 'INVALID_PASSWORD':
				errorMsg = 'Email/Password is incorrect. Please check';
				break;
		};
		this.alertController.create({
			header: 'Alert',
			message: errorMsg,
			buttons: ['Okay']
		}).then((alertEl: HTMLIonAlertElement) => {
			alertEl.present();
		});
	}

	navigateToHomePage() {
		if (this.authService.redirectUrl) {
			this.router.navigateByUrl(this.authService.redirectUrl);
		} else {
			this.router.navigateByUrl('/home');
		}
	}

	onSelectAccountType(event: any) {
		if (event && event.detail && event.detail.value) {
			if (event.detail.value === 'business') {
				const nameCtrl = new FormControl(null, {
					updateOn: "blur", validators: [Validators.required, Validators.minLength(5), Validators.maxLength(250)]
				});
				this.authForm.addControl("businessName", nameCtrl);
			} else {
				if (this.authForm.controls.businessName) {
					this.authForm.removeControl("businessName");
				}
			}
		}
	}

}
