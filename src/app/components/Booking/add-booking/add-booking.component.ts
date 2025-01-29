import { Component, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../../shared/services/login.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from '../services/booking.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-booking',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-booking.component.html',
  styleUrl: './add-booking.component.scss'
})
export class AddBookingComponent implements OnInit, OnDestroy {

  private bookingService = inject(BookingService);
  private authService = inject(LoginService);
  private toast = inject(ToastrService);
  private route = inject(Router);
  private routeParams = inject(ActivatedRoute);
  private modalService = inject(NgbModal);

  private unsubscribe: Subscription[] = [];

  eventList: any[] = [];
  selectedEvent: any;
  availableSeats: number[] = [];
  bookedSeats: number[] = [];
  userId: any = null
  eventDate: any;
  selectedSeats: number[] = [];
  numberOfSeats: any;
  booleanValue = false;

  bookingForm!: FormGroup;

  ngOnInit(): void {
    this.getBookingForm();
    this.getEventsList();
    this.userId = this.authService.currentUser()?._id;
    const queryParams = this.routeParams.snapshot.queryParams;

    const eventListSubscription = this.bookingService.eventList().subscribe({
      next: (res: any) => {
        this.eventList = res.data;

        if (queryParams['eventId']) {
          this.bookingForm.patchValue({
            eventId: queryParams['eventId']
          });
          this.onEventChange(queryParams['eventId']);
        }

        if (queryParams['seatNumber']) {
          this.bookingForm.patchValue({
            numberOfSeats: queryParams['seatNumber']
          });
          this.onSeatsNumberChange();

          this.bookingForm.patchValue({
            userId: this.userId
          });

          setTimeout(() => {
            if (this.bookingForm.valid &&
              this.bookingForm.get('seatNumber')?.value?.length > 0 &&
              this.bookingForm.get('eventId')?.value &&
              this.bookingForm.get('numberOfSeats')?.value) {
              this.bookingHandler();
            } else {
              this.toast.info('Please review and confirm your booking details');
            }
          }, 500);

        }
      },
      error: (err) => {
        this.toast.error(err || 'An unexpected error occurred');
      }
    });

    this.unsubscribe.push(eventListSubscription);
  }

  getBookingForm() {
    this.bookingForm = new FormGroup({
      userId: new FormControl(null, Validators.required),
      eventId: new FormControl(null, Validators.required),
      seatNumber: new FormControl([], Validators.required),
      numberOfSeats: new FormControl(null, Validators.required)
    });

    this.bookingForm.get('eventId')?.valueChanges.subscribe((eventId: string) => {
      this.onEventChange(eventId);
    });
  }

  getEventsList() {
    try {
      const saveSubscribe = this.bookingService.eventList().subscribe((res: any) => {
        this.eventList = res.data;
      });
      this.unsubscribe.push(saveSubscribe);
    } catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred');
    }
  }

  onEventChange(eventId: string) {
    this.selectedEvent = this.eventList.find(event => event._id === eventId);
    this.eventDate = this.selectedEvent.date.split('T')[0];
    if (this.selectedEvent) {
      this.bookedSeats = this.selectedEvent.bookedSeats || [];
      this.generateAvailableSeats();
    }
  }

  generateAvailableSeats() {
    const totalSeats = this.selectedEvent?.totalSeats || 0;
    this.availableSeats = [];
    for (let i = 1; i <= totalSeats; i++) {
      this.availableSeats.push(i);
    }
  }

  onSeatsNumberChange() {
    this.numberOfSeats = parseInt(this.bookingForm.get('numberOfSeats')?.value);
    if (this.numberOfSeats) {
      this.selectedSeats = [];
      let seatsFound = 0;
      for (let seat of this.availableSeats) {
        if (!this.isBooked(seat) && seatsFound < this.numberOfSeats) {
          this.selectedSeats.push(seat);
          seatsFound++;
        }
      }
      this.bookingForm.get('seatNumber')?.setValue(this.selectedSeats);
    }
  }

  selectSeat(seat: number, content: any) {
    const numberOfSeats = parseInt(this.bookingForm.get('numberOfSeats')?.value);
    const bookedSeatsAsStrings = this.bookedSeats.map((s: any) => s.toString());
    if (bookedSeatsAsStrings.includes(seat.toString())) {
      this.modalService.open(content);
      this.booleanValue = true;
      return;
    }
    const index = this.selectedSeats.indexOf(seat);
    if (index === -1) {
      if (this.selectedSeats.length < numberOfSeats) {
        this.selectedSeats.push(seat);
      }
    } else {
      this.selectedSeats.splice(index, 1);
    }
    this.bookingForm.get('seatNumber')?.setValue(this.selectedSeats);
  }

  isBooked(seat: number): boolean {
    return this.bookedSeats.map(s => s.toString()).includes(seat.toString());
  }

  isSelected(seat: number): boolean {
    return this.selectedSeats.includes(seat);
  }

  isSeatDisabled(seat: number): boolean {
    return this.isBooked(seat) || this.isSelected(seat);
  }

  bookingHandler() {
    try {
      const reqBody = {
        userId: this.userId,
        eventId: this.bookingForm.controls['eventId'].value,
        seatNumber: this.bookingForm.controls['seatNumber'].value,
        numberOfSeats: this.bookingForm.controls['numberOfSeats'].value
      }
      const saveSubscribe = this.bookingService.bookeSeats(reqBody).subscribe({
        next: () => {
          this.toast.success("Seat booked successfully");
          this.route.navigateByUrl("booking/list");
        },
        error: (err) => {
          this.toast.error(err?.error.message || "Something went wrong. Please try again later.");
        }
      })
      this.unsubscribe.push(saveSubscribe);
    } catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred');
    }
  }

  isEventExpired(eventDate: string): boolean {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    return eventDateObj < today;
  }

  backPage() {
    this.route.navigateByUrl("booking/list")
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
