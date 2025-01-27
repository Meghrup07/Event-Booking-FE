import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../shared/services/login.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  private authService = inject(LoginService);
  private toast = inject(ToastrService)

  adminRole: any;

  ngOnInit(): void {
    this.adminRole = this.authService.currentUser()?.role == "admin"
  }

  logout() {
    this.authService.logout();
    this.toast.success("Logout successfull");
  }

}
