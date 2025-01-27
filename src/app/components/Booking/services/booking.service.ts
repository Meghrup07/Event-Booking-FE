import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);
  
  apiUrl = environment.apiUrl;

  bookeSeats(data: any) {
    const url = this.apiUrl + 'booking/book-ticket';
    return this.http.post<any>(url, data);
  }

  bookingList(id:string){
    const url = this.apiUrl + `booking/booking-list/${id}`;
    return this.http.get(url);
  }

  cancelBooking(id: string){
    const url = this.apiUrl + `booking/cancel-booking/${id}`;
    return this.http.delete(url);
  }

  eventList(){
    const url = this.apiUrl + 'event/event-list';
    return this.http.get(url);
  }


}
