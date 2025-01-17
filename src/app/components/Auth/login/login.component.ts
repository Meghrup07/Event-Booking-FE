import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../shared/services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  private loginService = inject(LoginService);
  private route = inject(Router);
  private toastr = inject(ToastrService);
  loginForm!: FormGroup

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
    this.loginService.login(this.loginForm.value).subscribe({
      next: () => {
        this.toastr.success("Login successfully");
        this.route.navigateByUrl("event");
        this.loginForm.reset();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message);
      }
    })
  }

  register() {
    this.route.navigateByUrl("register");
  }

}
