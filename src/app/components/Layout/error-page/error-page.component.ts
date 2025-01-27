import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../shared/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent implements OnInit {

  private authService = inject(LoginService);
  private route = inject(Router)

  adminRole: any;

  ngOnInit(): void {
    this.adminRole = this.authService.currentUser().role == 'admin';
  }

  backButton() {
    if (this.authService.currentUser().role == 'admin') {
      this.route.navigateByUrl("event/list");
    } else {
      this.route.navigateByUrl("booking/list");
    }
  }


}
