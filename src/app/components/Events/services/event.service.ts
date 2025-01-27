import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  
  apiUrl = environment.apiUrl;

  getEventList(page:number, limit:number, search:string){
    const url = this.apiUrl + 'event/event-list';
    const params = new HttpParams()
    .set('page', page)
    .set('limit', limit)
    .set('search', search);
    return this.http.get(url, {params});
  }

  getEvent(id:string){
    const url = this.apiUrl + `event/${id}`;
    return this.http.get(url);
  }

  addEvent(data:any){
    const url = this.apiUrl + 'event/create-event';
    return this.http.post<any>(url, data);
  }

  updateEvent(id:string, data:any){
    const url = this.apiUrl + `event/update-event/${id}`;
    return this.http.put<any>(url, data);
  }

  deleteEvent(id:string){
    const url = this.apiUrl + `event/delete-event/${id}`;
    return this.http.delete(url);
  }

}
