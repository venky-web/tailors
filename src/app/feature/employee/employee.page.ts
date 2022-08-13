import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AlertController, IonItemSliding, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';

import { EmployeeService } from 'app-services';
import { AddEmployeePopupComponent } from './add-employee-popup/add-employee-popup.component';


@Component({
    selector: 'app-employee',
    templateUrl: './employee.page.html',
    styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

    subscriptions: Subscription[];

    platforms: string[];
    employeeList: any[];
    isServiceCalled: boolean;
    isDesktop: boolean;

    employeeTableCols: any[];

    constructor(
        private employeeService: EmployeeService,
        private router: Router,
        private platform: Platform,
        private modalController: ModalController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
    ) {
        this.isServiceCalled = false;
        this.platforms = this.platform.platforms();
        this.isDesktop = this.platforms.includes('desktop');
        this.subscriptions = [];
    }

    ngOnInit() {
        this.employeeTableCols = [
			{ header: 'Image' },
			{ field: 'full_name', header: 'Full Name' },
			{ field: 'display_name', header: 'Display Name' },
			{ field: 'phone', header: 'Mobile' },
			{ field: 'joined_date', header: 'Joined on' },
			{ field: 'updated_date', header: 'Updated on' },
			{ header: 'Actions' }
		];
    }
    
    ionViewWillEnter() {
        this.getEmployees();
    }

    getEmployees() {
        this.loadingCtrl.create({
            message: "Loading employees list"
        }).then(loadingEl => {
            const getEmployeesSub = this.employeeService.getEmployees().subscribe((response: any) => {
                this.employeeList = this.reArrangeEmployeesList(response);
                loadingEl.dismiss();
            },
            error => {
                loadingEl.dismiss();
            });
            this.subscriptions.push(getEmployeesSub);
        });
    }

    reArrangeEmployeesList(data: any) {
		const employees = [];
		for (const key in data) {
			employees.push({...data[key], _id: key});
		}
		return employees;
	}

    onFilterEmployees() {}

	goToEmployeeDetails(empId: any, slidingItem?: IonItemSliding) {
		if (slidingItem) slidingItem.close();
		this.router.navigate(['/emp', empId]);
	}

    addEmployee() {
        this.openEmployeePopup("add");
    }

    onEditEmployee(empData: any, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
        this.openEmployeePopup("update", empData);
    }

    openEmployeePopup(type: string, empData?: any) {
        this.modalController.create({
            component:  AddEmployeePopupComponent,
            componentProps: {
                employeeList: this.employeeList ? this.employeeList : [],
                operationType: type,
                employeeData: empData,
            },
            id: 'employee-add-popup-modal'
        }).then((modalEl: HTMLIonModalElement) => {
            modalEl.present();
            return modalEl.onDidDismiss();
        }).then((resultData: any) => {
            this.getEmployees();
        });
    }

    onDeleteEmployee(id: string, slidingItem?: IonItemSliding) {
        if (slidingItem) slidingItem.close();
        this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Are you sure?',
            message: 'Employee data will be deleted permanently.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Delete',
                    role: "confirm",
                },
            ],
        }).then((alertEl: HTMLIonAlertElement) => {
            alertEl.present();
            return alertEl.onDidDismiss();
        }).then((alertResult: any) => {
            if (alertResult && alertResult.role === "confirm") {
                this.loadingCtrl.create({
                    message: "Deleting employee data",
                }).then(loadingEl => {
                    loadingEl.present();
                    const deleteEmpSub = this.employeeService.deleteEmployee(id).subscribe(
                        (response: any) => {
                            loadingEl.dismiss();
                            this.showToast("Data saved successfully!");
                            this.getEmployees();
                        },
                        errorRes => {
                            loadingEl.dismiss();
                        }
                    );
                    this.subscriptions.push(deleteEmpSub);
                });
            }
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
