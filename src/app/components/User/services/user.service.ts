import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  
  apiUrl = environment.apiUrl;


  getAllUser(){
    const url = this.apiUrl + "user";
    return this.http.get(url);
  }

  getUserDetails(id:string){
    const url = this.apiUrl + `user/${id}`;
    return this.http.get(url);
  }

  updateUser(id:string, data:any){
    const url = this.apiUrl + `user/update-user/${id}`;
    return this.http.put(url, data);
  }

  deleteUser(id:string){
    const url = this.apiUrl + `user/${id}`;
    return this.http.delete(url)
  }
  
}
