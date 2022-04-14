import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from "moment";
import { cloneDeep } from 'lodash';

import { UserService } from 'app-services';


@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {

    @Input() userList: any[];
    @Input() operationType: 'add' | 'update';
    @Input() loadedUser: any;
    @Input() featureName: string;

    subscriptions: Subscription[];
    profileForm: FormGroup;

    invalidPassword: boolean;

    constructor(
        private modalCtrl: ModalController,
        private userService: UserService,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
    ) {
        this.subscriptions = [];
    }

    ngOnInit() {
        this.createProfileForm();
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        }
    }

    ionViewWillEnter() {
        this.patchForm();
    }

    createProfileForm() {
        this.profileForm = new FormGroup({
            fullName: new FormControl(null, {
                updateOn: "blur",
                validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200)]
            }),
            displayName: new FormControl(null, {
                updateOn: "blur",
                validators: [Validators.minLength(3), Validators.maxLength(120)]
            }),
            maritalStatus: new FormControl('single', {updateOn: 'blur', validators: [Validators.required]}),
            gender: new FormControl('female', {updateOn: 'blur', validators: [Validators.required]}),
            joinedDate: new FormControl(new Date().toISOString(), {
                updateOn: 'blur',
                validators: [Validators.required]
            }),
            dateOfBirth: new FormControl(new Date().toISOString(), {
                updateOn: 'blur',
                validators: [Validators.required]
            }),
            mobileNumber: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.pattern("^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$")]}
            ),
        });
    }

    get formCtrls() { return this.profileForm.controls; }

    patchForm() {
        if (!this.loadedUser || !this.loadedUser.profile) { return; }
        this.profileForm.patchValue({
            fullName: this.loadedUser.profile.full_name,
            displayName: this.loadedUser.profile.display_name,
            maritalStatus: this.loadedUser.profile.marital_status,
            gender: this.loadedUser.profile.gender,
            joinedDate: this.loadedUser.profile.joined_date,
            dateOfBirth: this.loadedUser.profile.date_of_birth,
            mobileNumber: this.loadedUser.profile.phone,
        });
    }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel', 'user-profile-modal');
    }

    saveProfileData() {
        this.profileForm.markAllAsTouched();
        this.profileForm.markAsDirty();
        if (!this.profileForm.valid) {
            return;
        }
        const formData = this.profileForm.value;
        const dob = formData.dateOfBirth ? moment(formData.dateOfBirth).format("YYYY-MM-DD") : null;
        const joinedDate = formData.joinedDate ? moment(formData.joinedDate).format("YYYY-MM-DD") : null;
        const userProfile: any = {
            "full_name": formData.fullName,
            "display_name": formData.displayName,
            "phone": formData.mobileNumber,
            "date_of_birth": dob,
            "joined_date": joinedDate,
            "gender": formData.gender,
            "marital_status": formData.maritalStatus
        };
        if (this.featureName === "emp") {
            this.saveStaffProfile(userProfile);
        } else {
            this.saveUserProfile(userProfile);
        }
    }

    saveUserProfile(userProfile: any) {
        this.loadingCtrl.create({
            message: "Saving profile data",
        }).then(loadingEl => {
            loadingEl.present();
            const saveProfileSub = this.userService.saveProfileData(this.loadedUser.id, userProfile).subscribe(
                (response: any) => {
                    loadingEl.dismiss();
                    this.showToast("Profile data saved successfully!");
                    const userData = cloneDeep(this.loadedUser);
                    userData.profile = response;
                    const modelData = {
                        name: "user-profile",
                        userData: userData,
                        profileData: response,
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'user-profile-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(saveProfileSub);
        });
    }

    saveStaffProfile(userProfile: any) {
        this.loadingCtrl.create({
            message: "Saving profile data",
        }).then(loadingEl => {
            loadingEl.present();
            const saveProfileSub = this.userService.saveStaffProfileData(this.loadedUser.id, userProfile).subscribe(
                (response: any) => {
                    loadingEl.dismiss();
                    this.showToast("Profile data saved successfully!");
                    const userData = cloneDeep(this.loadedUser);
                    userData.profile = response;
                    const modelData = {
                        name: "user-profile",
                        userData: userData,
                        profileData: response,
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'user-profile-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(saveProfileSub);
        });
    }

    async showToast(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: "top"
        });
        toast.present();
    }

}
