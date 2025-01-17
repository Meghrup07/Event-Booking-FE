import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private route = inject(Router)
  private authService = inject(LoginService)
  private toast = inject(ToastrService)

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.getRegisterForm();
  }

  getRegisterForm(){
    this.registerForm = new FormGroup({
    email:new FormControl(null, [Validators.required, Validators.email]),
    password:new FormControl(null, [Validators.required]),
    userName:new FormControl(null, [Validators.required]),
    firstName:new FormControl(null, [Validators.required]),
    lastName:new FormControl(null, [Validators.required]),
    role:new FormControl(null, [Validators.required]),
    })
  }


  registerHandler(){
    this.authService.register(this.registerForm.value).subscribe({
      next: ()=>{
        this.toast.success("Register successfully");
        this.route.navigateByUrl("");
        this.registerForm.reset();
      },
      error:(err)=>{
        this.toast.error(err?.error.message);
      }
    })
  }


  login() {
    this.route.navigateByUrl("");
  }

}
