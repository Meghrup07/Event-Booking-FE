import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

   private route = inject(Router);

  private http = inject(HttpClient)
  apiUrl = "http://localhost:3000/api/";

  currentUser = signal<any | null>(null);

  login(user: any) {
    const url = this.apiUrl + 'auth/login';
    return this.http.post<any>(url, user).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user?.data);
        }
      })
    )
  }

  setCurrentUser(user: any) {
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUser.set(user);
  }

  register(data: any) {
    const url = this.apiUrl + 'auth/register';
    return this.http.post<any>(url, data);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.route.navigateByUrl("/login");
    window.location.reload();
  }

}
