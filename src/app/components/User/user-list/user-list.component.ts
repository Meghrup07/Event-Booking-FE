import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  private userService = inject(UserService);
  private toast = inject(ToastrService);
  private modalService = inject(NgbModal);

  userList: any[] = [];

  selectedUserId: string | null = null;

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.userService.getAllUser().subscribe((res: any) => {
      this.userList = res?.data;
    })
  }

  openModal(content: any, eventId: string) {
    this.selectedUserId = eventId;
    this.modalService.open(content);
  }

  deleteUser() {
    if (this.selectedUserId) {
      this.userService.deleteUser(this.selectedUserId).subscribe({
        next: () => {
          this.toast.success("User deleted successfully");
          this.modalService.dismissAll();
          this.getUserList();
        },
        error: (err: any) => {
          this.toast.error(err?.error?.message);
        }
      });
    }
  }

}
