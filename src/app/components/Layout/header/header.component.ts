import { Component, OnInit, inject } from '@angular/core';
import { LoginService } from '../../../shared/services/login.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  private authService = inject(LoginService);

  userName: any

  ngOnInit(): void {
    this.userName = this.authService.currentUser().firstName + ' ' + this.authService.currentUser().lastName;
  }
}
