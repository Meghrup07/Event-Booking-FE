import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { HeaderComponent } from "./shared/comman/header/header.component";
import { SidebarComponent } from "./shared/comman/sidebar/sidebar.component";
import { LoginService } from './shared/services/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerComponent, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private authService = inject(LoginService);
  currentUser = this.authService.currentUser;
  ngOnInit(): void {
    this.setCurrentUser();
  }
  setCurrentUser() {
    const currentUser = localStorage.getItem("user");
    if (!currentUser) return;
    const user = JSON.parse(currentUser);
    this.authService.setCurrentUser(user);
  }
}
