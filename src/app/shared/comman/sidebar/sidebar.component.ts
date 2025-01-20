import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  private authService = inject(LoginService);
  private toast = inject(ToastrService)

  adminRole: any;

  ngOnInit(): void {
    this.adminRole = this.authService.currentUser().role == "admin";
  }

  logout() {
    this.authService.logout();
    this.toast.success("logout successfull");
  }

}
