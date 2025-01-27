import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit, OnDestroy {

  private authService = inject(LoginService);
  private userService = inject(UserService);
  private toast = inject(ToastrService);

  private unsubscribe: Subscription[] = [];

  userDetails: any;
  userForm!: FormGroup;
  userId: any;
  editDetails = false

  ngOnInit(): void {
    this.userId = this.authService.currentUser()._id;
    this.getUserForm();
    this.getUserDetails();
  }

  getUserForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    });
    if (!this.editDetails) {
      this.userForm.get('email')?.disable();
      this.userForm.get('firstName')?.disable();
      this.userForm.get('lastName')?.disable();
    }
  }

  getUserDetails() {
    try {
      const saveSubscribe = this.userService.getUserDetails(this.userId).subscribe((res: any) => {
        this.userDetails = res
        this.userForm.patchValue({
          firstName: this.userDetails.firstName,
          lastName: this.userDetails.lastName,
          email: this.userDetails.email
        })
      });
      this.unsubscribe.push(saveSubscribe);
    } catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred');
    }
  }

  editProfile() {
    this.editDetails = true;
    this.userForm.get('email')?.enable();
    this.userForm.get('firstName')?.enable();
    this.userForm.get('lastName')?.enable();
  }

  saveProfile() {
    try {
      const saveSubscribe = this.userService.updateUser(this.userId, this.userForm.value).subscribe({
        next: () => {
          this.toast.success('Profile updated successfully');
          this.editDetails = false;
          this.userForm.get('email')?.disable();
          this.userForm.get('firstName')?.disable();
          this.userForm.get('lastName')?.disable();
        },
        error: (err: any) => {
          this.toast.error(err?.error?.message || "Something went wrong. Please try again later.");
        }
      });
      this.unsubscribe.push(saveSubscribe);
    } catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred')
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sub) => sub.unsubscribe());
  }

}
