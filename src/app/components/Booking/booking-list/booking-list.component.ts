import { Component, inject, OnInit } from '@angular/core';
import { BookingService } from '../../../shared/services/booking.service';
import { LoginService } from '../../../shared/services/login.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent implements OnInit {

  private modalService = inject(NgbModal);
  private bookingService = inject(BookingService);
  private authService = inject(LoginService);
  private route = inject(Router);
  private toast = inject(ToastrService);

  selectedEventId: any;

  bookingList: any[] | null = null;
  userId: any = null;

  ngOnInit(): void {
    this.userId = this.authService.currentUser()?.id
    this.getBookingList();
  }

  getBookingList(){
    this.bookingService.bookingList(this.userId).subscribe((res: any)=>{
      console.log("res", res);
      this.bookingList = res.data;
    })
  }

  openModal(content: any, eventId: string) {
    this.selectedEventId = eventId;
    this.modalService.open(content);
  }

  deleteBooking(){
    if(this.selectedEventId){
      this.bookingService.cancelBooking(this.selectedEventId).subscribe({
        next: ()=>{
          this.toast.success("Booking cancelled successfully");
          this.modalService.dismissAll();
          this.getBookingList();
        },
        error:(err)=>{
          this.toast.error(err?.error?.message);
        }
      })
    }
  }

  addBookingPage(){
    this.route.navigateByUrl("booking/add");    
  }

}
