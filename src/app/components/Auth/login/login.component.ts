import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../shared/services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  private loginService = inject(LoginService);
  private route = inject(Router);
  private toastr = inject(ToastrService);
  loginForm!: FormGroup

  private unsubscribe: Subscription[] = [];

  passwordFieldType: string = 'password';

  ngOnInit(): void {
    this.getloginForm();
  }

  getloginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    })
  }

  loginHandler() {
    try {
      if (this.loginForm.valid) {
        const saveSubscribe = this.loginService.login(this.loginForm.value).subscribe({
          next: () => {
            if (this.loginService.currentUser().role == 'admin') {
              this.route.navigateByUrl("event/list");
            } else {
              this.route.navigateByUrl("booking/list");
            }
            this.toastr.success("Login successfully");
            this.loginForm.reset();
          },
          error: (err) => {
            this.toastr.error(err?.error?.message || "Something went wrong. Please try again later.");
          }
        })
        this.unsubscribe.push(saveSubscribe);
      }
      else {
        this.toastr.error('Please fill in all required fields');
      }
    }
    catch (err: any) {
      this.toastr.error(err || 'An unexpected error occurred')
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  register() {
    this.route.navigateByUrl("auth/register");
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sub) => sub.unsubscribe());
  }

}
