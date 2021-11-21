import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { IEmployee } from 'app-models';
import { EmployeeService } from 'app-services';



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
  loadedEmployee: IEmployee;

  constructor(
    private modalCtrl: ModalController,
    private employeeService: EmployeeService,
  ) {
    this.subscriptions = [];
  }

  ngOnInit() {
    this.employeeForm = this.createForm();
  }

  ngOnDestroy() {
    if (this.subscriptions) { this.subscriptions.forEach((s: Subscription) => s.unsubscribe()); }
  }

  createForm() {
    return new FormGroup({
      name: new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]}),
      maritalStatus: new FormControl('single', {updateOn: 'blur', validators: [Validators.required]}),
      gender: new FormControl('female', {updateOn: 'blur', validators: [Validators.required]}),
      status: new FormControl('active', {updateOn: 'blur', validators: [Validators.required]}),
      joinedDate: new FormControl(new Date().toISOString(), {updateOn: 'blur', validators: [Validators.required]}),
      mobileNumber: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10)]}
      ),
      employeeId: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
    });
  }

  get formCtrls() { return this.employeeForm.controls; }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel', 'emp-add-modal');
  }

  onSubmit() {
    this.employeeForm.markAllAsTouched();
    this.employeeForm.markAsDirty();
    if (!this.employeeForm.valid) {
      return;
    }
    const formData = this.employeeForm.value;
    if (this.operationType === 'add') {
      this.addEmployee(formData);
    } else if(this.operationType === 'update') {
      this.updateEmployee(formData);
    }
  }

  addEmployee(formData: any) {
    const isDuplicate = this.employeeList.find((e: IEmployee) => e.name === formData.name);
    if (isDuplicate) {
      this.employeeForm.controls.name.setErrors({duplicate: true});
      return;
    }
    const newEmployee: IEmployee = {
      employeeId: null,
      name: formData.name,
      maritalStatus: formData.maritalStatus,
      gender: formData.gender,
      status: formData.status,
      joinedDate: formData.joinedDate,
      mobileNumber: formData.mobileNumber,
    };
    console.log(newEmployee);
    // const addEmpSub = this.employeeService.addEmployee(newEmployee).subscribe((response: any) => {
    //   console.log(response);
    //   this.modalCtrl.dismiss({name: 'emp', response}, 'confirm', 'emp-add-modal');
    // });
    // this.subscriptions.push(addEmpSub);
  }

  updateEmployee(formData: any) {
    const isDuplicate = this.employeeList.find((e: IEmployee) =>
      e.name === formData.name &&
      e.employeeId !== this.loadedEmployee.employeeId
    );
    if (isDuplicate) {
      this.employeeForm.controls.name.setErrors({duplicate: true});
      return;
    }
    const newEmployee: IEmployee = {
      employeeId: null,
      name: formData.name,
      maritalStatus: formData.maritalStatus,
      gender: formData.gender,
      status: formData.status,
      joinedDate: formData.joinedDate,
      mobileNumber: formData.mobileNumber,
    };
    const addEmpSub = this.employeeService.addEmployee(newEmployee).subscribe((response: any) => {
      console.log(response);
      this.modalCtrl.dismiss({name: 'emp'}, 'confirm', 'emp-add-modal');
    });
    this.subscriptions.push(addEmpSub);
  }

}
