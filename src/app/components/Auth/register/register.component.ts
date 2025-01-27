import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private route = inject(Router)
  private authService = inject(LoginService)
  private toast = inject(ToastrService)
  registerForm!: FormGroup;

  private unsubscribe: Subscription[] = [];

  passwordFieldType: string = 'password';

  ngOnInit(): void {
    this.getRegisterForm();
  }

  getRegisterForm() {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      userName: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      role: new FormControl(null, [Validators.required]),
    })
  }


  registerHandler() {
    try {
      if (this.registerForm.valid) {
        const saveSubscribe = this.authService.register(this.registerForm.value).subscribe({
          next: () => {
            this.toast.success("Register successfully");
            this.route.navigateByUrl("");
            this.registerForm.reset();
          },
          error: (err) => {
            this.toast.error(err?.error?.message || "Something went wrong. Please try again later.");
          }
        });
        this.unsubscribe.push(saveSubscribe);
      }
      else {
        this.toast.error('Please fill in all required fields');
      }
    }
    catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred')
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login() {
    this.route.navigateByUrl("");
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sub) => sub.unsubscribe());
  }

}
