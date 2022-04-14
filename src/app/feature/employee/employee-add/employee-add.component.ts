import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from "moment";

import { IEmployee } from 'app-models';
import { UserService } from 'app-services';
import { cloneDeep } from 'lodash';


@Component({
    selector: 'app-employee-add',
    templateUrl: './employee-add.component.html',
    styleUrls: ['./employee-add.component.scss'],
})
export class EmployeeAddComponent implements OnInit, OnDestroy {

    @Input() employeeList: IEmployee[];
    @Input() operationType: 'add' | 'update';

    subscriptions: Subscription[];
    employeeForm: FormGroup;
    employeeProfileForm: FormGroup;
    loadedEmployee: IEmployee;

    step1: boolean;
    step2: boolean;
    invalidPassword: boolean;
    usersList: any;
    userData: any;
    userProfileData: any;

    constructor(
        private modalCtrl: ModalController,
        private userService: UserService,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
    ) {
        this.subscriptions = [];
        this.step1 = true;
    }

    ngOnInit() {
        this.createEmployeeForm();
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        }
    }

    createEmployeeForm() {
        this.employeeForm = new FormGroup({
            userName: new FormControl(null, {
                updateOn: 'blur',
                validators: [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(120),
                    Validators.pattern("^[a-zA-Z0-9_-]*$")
                ]
            }),
            email: new FormControl(null, {
                updateOn: "blur",
                validators: [Validators.email, Validators.minLength(10), Validators.maxLength(120)]
            }),
            password: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.minLength(6), Validators.maxLength(60)]
            }),
            password2: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.minLength(6), Validators.maxLength(60)]
            }),
        });
    }

    createProfileForm() {
        this.employeeProfileForm = new FormGroup({
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

    get formCtrls() { return this.employeeForm.controls; }

    get profileFormCtrls() { return this.employeeProfileForm.controls; }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel', 'emp-add-modal');
    }

    onClickNext() {
        this.invalidPassword = false;
        this.employeeForm.markAllAsTouched();
        this.employeeForm.markAsDirty();
        if (!this.employeeForm.valid) {
            return;
        }
        const formData = this.employeeForm.value;
        if (formData.password !== formData.password2) {
            this.invalidPassword = true;
            return;
        }
        const newEmployee: any = {
            username: formData.userName,
            password: formData.password,
        };
        if (formData.email && formData.email.length > 0) {
            newEmployee.email = formData.email;
        }
        this.loadingCtrl.create({
            message: "Creating user",
        }).then(loadingEl => {
            loadingEl.present();
            const addEmpSub = this.userService.createBusinessStaff(newEmployee).subscribe((response: any) => {
                this.userData = response;
                if (this.usersList && this.usersList.length > 0) {
                    this.usersList.push(this.userData);
                }
                this.createProfileForm();
                this.step1 = false;
                this.step2 = true;
                loadingEl.dismiss();
                this.showToast("Employee is created successfully!");
            },
            errorRes => {
                loadingEl.dismiss();
            });
            this.subscriptions.push(addEmpSub);
        });
    }

    saveProfileData() {
        this.employeeProfileForm.markAllAsTouched();
        this.employeeProfileForm.markAsDirty();
        if (!this.employeeProfileForm.valid) {
            return;
        }
        const formData = this.employeeProfileForm.value;
        const dob = formData.dateOfBirth ? moment(formData.dateOfBirth).format("YYYY-MM-DD") : null;
        const joinedDate = formData.joinedDate ? moment(formData.joinedDate).format("YYYY-MM-DD") : null;
        const employeeProfile: any = {
            "full_name": formData.fullName,
            "display_name": formData.displayName,
            "phone": formData.mobileNumber,
            "date_of_birth": dob,
            "joined_date": joinedDate,
            "gender": formData.gender,
            "marital_status": formData.maritalStatus
        };
        this.loadingCtrl.create({
            message: "Saving profile data",
        }).then(loadingEl => {
            loadingEl.present();
            const saveProfileSub = this.userService.saveStaffProfileData(this.userData.id, employeeProfile).subscribe(
                (response: any) => {
                    const userData = cloneDeep(this.userData);
                    userData.profile = response;
                    loadingEl.dismiss();
                    this.showToast("Profile data is saved successfully!");
                    const modelData = {
                        name: "emp",
                        userData: userData,
                        profileData: response,
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'emp-add-modal');
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
            position: "top",
            color: "success"
        });
        toast.present();
    }

}
