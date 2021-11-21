import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'app-services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  authForm: FormGroup;

  isLogin: boolean;

  constructor(
    private authService: AuthService,
  ) {
    this.isLogin = true;
  }

  ngOnInit() {
    this.authForm = new FormGroup({
      email: new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.email]}),
      password: new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.minLength(6)]})
    });
  }

  get formCtrls() { return this.authForm.controls; }

  onSubmit() {
    this.authForm.markAllAsTouched();
    this.authForm.markAsDirty();
    console.log(this.authForm);
    if (!this.isLogin) {
      const passwordsMatch = this.authForm.value.password === this.authForm.value.password2;
      if (!passwordsMatch) {
        this.authForm.controls.password.setErrors({misMatch: true});
        this.authForm.controls.password2.setErrors({misMatch: true});
      }
    }
    if (!this.authForm.valid) { return; }
  }

  signUp() {
    if (this.isLogin) {
      this.authForm.addControl('password2', new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}));
    } else {
      this.authForm.removeControl('password2');
    }
    this.authForm.reset();
    this.isLogin = !this.isLogin;
  }

}
