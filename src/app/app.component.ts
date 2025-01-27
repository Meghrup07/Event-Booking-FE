import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { LoginService } from './shared/services/login.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
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
    const currentUser = sessionStorage.getItem("user");
    if (!currentUser) return;
    const user = JSON.parse(currentUser);
    this.authService.setCurrentUser(user);
  }
}
