import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { BusyServiceService } from './busy-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private route = inject(Router);
  private http = inject(HttpClient);
  private toast = inject(ToastrService);
  private busyService = inject(BusyServiceService);

  apiUrl = environment.apiUrl;

  currentUser = signal<any | null>(null);

  private tokenCheckInterval: any;

  login(user: any) {
    const url = this.apiUrl + 'auth/login';
    return this.http.post<any>(url, user).pipe(
      map((response) => {
        if (response?.data) {
          this.setCurrentUser(response.data);
          this.startTokenExpirationCheck(response?.data?.token);
        }
      })
    );
  }

  setCurrentUser(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  register(data: any) {
    const url = this.apiUrl + 'auth/register';
    return this.http.post<any>(url, data);
  }

  logout() {
    clearInterval(this.tokenCheckInterval);
    sessionStorage.removeItem('user');
    this.currentUser.set(null);
    this.route.navigateByUrl('/auth');
  }


  startTokenExpirationCheck(token: string) {
    clearInterval(this.tokenCheckInterval);

    const decodedToken = this.decodeToken(token);
    const expirationTime = decodedToken?.exp ? decodedToken.exp * 1000 : 0;
    const checkInterval = 60 * 1000;

    this.tokenCheckInterval = setInterval(() => {
      const currentTime = Date.now();
      if (expirationTime <= currentTime) {
        this.toast.warning("Your session has expired. Please log in again.");
        this.logout();
      }
    }, checkInterval);
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      return null;
    }
  }

}
