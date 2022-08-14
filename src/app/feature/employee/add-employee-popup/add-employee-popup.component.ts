import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from "moment";

import { EmployeeService } from 'app-services';


@Component({
    selector: 'app-add-employee-popup',
    templateUrl: './add-employee-popup.component.html',
    styleUrls: ['./add-employee-popup.component.scss'],
})
export class AddEmployeePopupComponent implements OnInit, OnDestroy {

    @Input() employeeList: any[];
    @Input() operationType: 'add' | 'update';
    @Input() employeeData: any;

    subscriptions: Subscription[];
    employeeForm: FormGroup;

    duplicateNumber: boolean;
    duplicateName: boolean;

    constructor(
        private modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private employeeService: EmployeeService,
    ) {
        this.subscriptions = [];
    }

    ngOnInit() {
        this.createEmployeeForm();
        if (this.employeeData) {
            this.employeeForm.patchValue({
                fullName: this.employeeData.full_name,
                displayName: this.employeeData.display_name,
                gender: this.employeeData.gender,
                phone: this.employeeData.phone
            });
        }
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        }
    }

    createEmployeeForm() {
        this.employeeForm = new FormGroup({
            fullName: new FormControl(null, {
                updateOn: "blur",
                validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200)]
            }),
            displayName: new FormControl(null, {
                updateOn: "blur",
                validators: [Validators.minLength(3), Validators.maxLength(120)]
            }),
            gender: new FormControl('female', {updateOn: 'blur', validators: [Validators.required]}),
            phone: new FormControl(null, {
                updateOn: 'blur',
                validators: [
                    Validators.required,
                    Validators.pattern("^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$"),
                    Validators.minLength(10),
                    Validators.maxLength(10)
                ]}
            ),
        });
    }

    get formCtrls() { return this.employeeForm.controls; }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel', 'employee-add-popup-modal');
    }

    saveEmployeeData() {
        this.employeeForm.markAllAsTouched();
        this.employeeForm.markAsDirty();
        if (!this.employeeForm.valid) return;
        const formData = this.employeeForm.value;
        if (this.employeeList && this.employeeList.length > 0) {
            let duplicateEmployeeWithName: any;
            let duplicateEmployeeWithPhone: any;
            if (this.operationType === "update" && this.employeeData) {
                duplicateEmployeeWithName = this.employeeList.find((x: any) =>
                    x.full_name &&
                    x.full_name.toLowerCase() === formData.fullName.toLowerCase() &&
                    x._id !== this.employeeData._id
                );
                duplicateEmployeeWithPhone = this.employeeList.find((x: any) =>
                    x.phone === `${formData.phone}` &&
                    x._id !== this.employeeData._id
                );
            } else {
                duplicateEmployeeWithName = this.employeeList.find((x: any) =>
                    x.full_name &&
                    x.full_name.toLowerCase() === formData.fullName.toLowerCase()
                );
                duplicateEmployeeWithPhone = this.employeeList.find((x: any) => x.phone === `${formData.phone}`);
            }
            this.duplicateName = !!duplicateEmployeeWithName;
            this.duplicateNumber = !!duplicateEmployeeWithPhone;
            if (duplicateEmployeeWithName || duplicateEmployeeWithPhone) return;
        }
        if (this.operationType === "add") {
            this.addEmployee(formData);
        } else {
            this.updateEmployee(formData);
        }
    }

    addEmployee(formData: any) {
        const employeeData: any = {
            "employee_id": "EM" + this.getEmployeeId(),
            "full_name": formData.fullName,
            "display_name": formData.displayName,
            "phone": formData.phone ? `${formData.phone}` : "",
            "joined_date": moment(new Date()).format("YYYY-MM-DD"),
            "gender": formData.gender,
            "created_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ"),
            "updated_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ")
        };
        this.loadingCtrl.create({
            message: "Saving employee data",
        }).then(loadingEl => {
            loadingEl.present();
            const saveEmployeeSub = this.employeeService.addEmployee(employeeData).subscribe(
                (response: any) => {
                    employeeData._id = response.name;
                    loadingEl.dismiss();
                    this.showToast("Data saved successfully!");
                    const modelData = {
                        name: "employee",
                        data: employeeData,
                        employeeId: response,
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'employee-add-popup-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(saveEmployeeSub);
        });
    }

    updateEmployee(formData: any) {
        const employeeData: any = {
            "employee_id": this.employeeData.employee_id,
            "full_name": formData.fullName,
            "display_name": formData.displayName,
            "phone": formData.phone ? `${formData.phone}` : "",
            "joined_date": this.employeeData.joined_date,
            "gender": formData.gender,
            "created_date": this.employeeData.created_date,
            "updated_date": moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ")
        };
        this.loadingCtrl.create({
            message: "Updating employee data",
        }).then(loadingEl => {
            loadingEl.present();
            const saveEmployeeSub = this.employeeService.updateEmployeeDetails(employeeData, this.employeeData._id).subscribe(
                (response: any) => {
                    employeeData._id = response.name;
                    loadingEl.dismiss();
                    this.showToast("Data updated successfully!");
                    const modelData = {
                        name: "employee",
                        data: employeeData,
                        employeeId: response,
                        type: "update"
                    }
                    this.modalCtrl.dismiss(modelData, 'confirm', 'employee-add-popup-modal');
                },
                errorRes => {
                    loadingEl.dismiss();
                }
            );
            this.subscriptions.push(saveEmployeeSub);
        });
    }

    getEmployeeId() {
        let employeeIds = [];
        for (const emp of this.employeeList) {
            if (emp.employee_id) employeeIds.push(emp.employee_id.substring(2, emp.employee_id.length));
        }
        employeeIds = employeeIds.map((x: any) => +x);
        employeeIds.sort((a: number, b: number) => a - b);
        return employeeIds.length > 0 ? employeeIds[employeeIds.length - 1] + 1 : 1000;
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
