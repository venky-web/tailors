import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { UserProfileComponent } from 'app-components';

import { User } from 'app-models';
import { AuthService, UserService } from 'app-services';


@Component({
    selector: 'app-account',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

	userDetails: any;
	profileData: any;
	businessData: any;

	constructor(
		private authService: AuthService,
		private userService: UserService,
		private alertController: AlertController,
		private loadingController: LoadingController,
		private modalCtrl: ModalController,
	) {
		this.userDetails = {};
		this.profileData = {};
	}

	ngOnInit() {}
	
	ionViewWillEnter() {
		this.userDetails = this.userService.user;
		if (this.userDetails) {
			this.profileData = this.userDetails.profile;
			this.businessData = this.userDetails.business;
		}
	}

	onLogout() {
		this.alertController.create({
			header: "Are you sure ?",
			message: "You will be logged out of the application",
			buttons: [
				{
					text: "Cancel",
					role: "cancel"
				},
				{
					text: "Logout",
					role: "destructive",
					handler: () => {
						this.loadingController.create({
							message: "Logging out"
						}).then((loadingEl: HTMLIonLoadingElement) => {
							loadingEl.present();
							this.authService.logout().then(() => {
								loadingEl.dismiss();
							});
						});
					}
				}
			]
		}).then((alertEl: HTMLIonAlertElement) => {
			alertEl.present();
		})
	}

	onEditUserData() {
        this.modalCtrl.create({
            component: UserProfileComponent,
            componentProps: {
                userList: [],
                operationType: 'update',
                loadedUser: this.userDetails,
            },
            id: 'user-profile-modal'
        }).then((modalEl: HTMLIonModalElement) => {
            modalEl.present();
            return modalEl.onDidDismiss() ;
        }).then((resultData: any) => {
            if (resultData.role === "confirm" && resultData.data) {
                this.userDetails = resultData.data.userData;
                this.profileData = resultData.data.profileData;
				this.userService.setUser(this.userDetails);
            }
        });
    }

}
