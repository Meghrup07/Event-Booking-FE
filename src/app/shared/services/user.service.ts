import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  
  apiUrl = 'http://localhost:3000/api/'

  getUserDetails(id:string){
    const url = this.apiUrl + `user/${id}`;
    return this.http.get(url);
  }

  updateUser(id:string, data:any){
    const url = this.apiUrl + `user/update-user/${id}`;
    return this.http.put(url, data);
  }
}
