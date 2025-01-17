import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../shared/services/login.service';
import { EventService } from '../../../shared/services/event.service';
import { BookingService } from '../../../shared/services/booking.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-booking.component.html',
  styleUrl: './add-booking.component.scss'
})
export class AddBookingComponent implements OnInit {

    private bookingService = inject(BookingService);
    private authService = inject(LoginService);
    private toast = inject(ToastrService);
    private route = inject(Router);
    private modalService = inject(NgbModal);
    
    eventList: any[] = [];
    selectedEvent: any;
    availableSeats: number[] = [];
    bookedSeats: number[] = [];
    userId:any = null

    booleanValue = false;

    bookingForm!: FormGroup;
  
    ngOnInit(): void {
      this.getBookingForm();
      this.getEventsList();
      this.userId = this.authService.currentUser()?.id
    }

    getBookingForm(){
      this.bookingForm = new FormGroup({
        userId: new FormControl(null, Validators.required),
        eventId: new FormControl(null, Validators.required),
        seatNumber: new FormControl(null, Validators.required),
      });

      this.bookingForm.get('eventId')?.valueChanges.subscribe((eventId: string) => {
        this.onEventChange(eventId);
      });
    }
  
    getEventsList() {
      this.bookingService.eventList().subscribe((res:any) => {
        this.eventList = res.data;
      });
    }

    onEventChange(eventId: string) {
      this.selectedEvent = this.eventList.find(event => event._id === eventId);
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

    selectSeat(seat: number, content:any) {
      const bookedSeatsAsStrings = this.bookedSeats.map((s: any) => s.toString());
      if (bookedSeatsAsStrings.includes(seat.toString())) {        
        this.modalService.open(content);
        this.booleanValue = true;
        return;
      }
      this.bookingForm.get('seatNumber')?.setValue(seat);
    }
    

    bookingHandler(){
      const reqBody = {
        userId: this.userId,
        eventId: this.bookingForm.controls['eventId'].value,
        seatNumber: this.bookingForm.controls['seatNumber'].value
      }
      this.bookingService.bookeSeats(reqBody).subscribe({
        next: ()=>{
          this.toast.success("Seat booked successfully");
          this.route.navigateByUrl("booking");
        },
        error: (err)=>{
          this.toast.error(err?.error.message);
        }
      })
    }

    backPage(){
      this.route.navigateByUrl("booking")
    }

}
