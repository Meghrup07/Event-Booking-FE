import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, NgbModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {

  private userService = inject(UserService);
  private modalService = inject(NgbModal);
  private toast = inject(ToastrService);

  private unsubscribe: Subscription[] = [];

  userList: any[] = []

  selectedUserId: string | null = null;

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    try {
      const saveSubscribe = this.userService.getAllUser().subscribe((res: any) => {
        if (res.status == true) {
          this.userList = res?.data;
        }
      });
      this.unsubscribe.push(saveSubscribe);
    } catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred');
    }
  }

  openModal(content: any, userId: string) {
    this.selectedUserId = userId;
    this.modalService.open(content);
  }

  deleteUser() {
    try {
      if (this.selectedUserId) {
        const saveSubscribe = this.userService.deleteUser(this.selectedUserId).subscribe({
          next: () => {
            this.toast.success("User deleted successfully");
            this.modalService.dismissAll();
            this.getUserList();
          },
          error: (err: any) => {
            this.toast.error(err?.error?.message || 'Something went wrong. Please try again later.');
          }
        });
        this.unsubscribe.push(saveSubscribe);
      }
    }
    catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred')
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sub) => sub.unsubscribe());
  }

}
