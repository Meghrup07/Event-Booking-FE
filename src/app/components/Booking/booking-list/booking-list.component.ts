import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../../shared/services/login.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../services/booking.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking-list',
  imports: [CommonModule, NgbModule],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent implements OnInit, OnDestroy {

  private modalService = inject(NgbModal);
  private bookingService = inject(BookingService);
  private authService = inject(LoginService);
  private route = inject(Router);
  private toast = inject(ToastrService);

  private unsubscribe: Subscription[] = [];

  selectedEventId: any;

  bookingList: any[] | null = null;
  userId: any = null;

  ngOnInit(): void {
    this.userId = this.authService.currentUser()?._id
    this.getBookingList();
  }

  getBookingList() {
    try {
      const saveSubscribe = this.bookingService.bookingList(this.userId).subscribe((res: any) => {
        this.bookingList = res.data;
      });
      this.unsubscribe.push(saveSubscribe);
    } catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred');
    }
  }

  openModal(content: any, eventId: string) {
    this.selectedEventId = eventId;
    this.modalService.open(content);
  }

  deleteBooking() {
    try {
      if (this.selectedEventId) {
        const saveSubscribe = this.bookingService.cancelBooking(this.selectedEventId).subscribe({
          next: () => {
            this.toast.success("Booking cancelled successfully");
            this.modalService.dismissAll();
            this.getBookingList();
          },
          error: (err) => {
            this.toast.error(err?.error?.message || "Something went wrong. Please try again later.");
            this.modalService.dismissAll();
          }
        });
        this.unsubscribe.push(saveSubscribe);
      }
    } catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred')
    }
  }

  addBookingPage() {
    this.route.navigateByUrl("booking/add");
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sub) => sub.unsubscribe());
  }

}
