import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../shared/services/event.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './event-edit.component.html',
  styleUrl: './event-edit.component.scss'
})
export class EventEditComponent implements OnInit {
  private eventService = inject(EventService);
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toast = inject(ToastrService);

  editEventForm!: FormGroup;
  eventDetails: any = null;
  eventId: any;

  ngOnInit(): void {
    this.eventId = this.activatedRoute.snapshot.paramMap.get("id");
    this.getEventEditForm();
    this.getEventDetails();
  }

  getEventEditForm(){
    this.editEventForm = new FormGroup({
      eventName: new FormControl('', Validators.required),
      eventType: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      totalSeats: new FormControl('', Validators.required),
      bookedSeats: new FormControl(null)
    })
  }
  
  getEventDetails(){
    this.eventService.getEvent(this.eventId).subscribe((res)=>{
      this.eventDetails = res;
      const formatedDate = new Date(this.eventDetails.date).toISOString().split('T')[0];
      this.editEventForm.patchValue({
        eventName: this.eventDetails.eventName,
        eventType: this.eventDetails.eventType,
        date: formatedDate,
        totalSeats: this.eventDetails.totalSeats,
        bookedSeats: this.eventDetails.bookedSeats
      })
    })
  }

  editEventHandler(){
    const formObj = this.editEventForm.value;
    this.eventService.updateEvent(this.eventId, formObj).subscribe({
      next: () =>{
        this.toast.success("Event updated successfully");
        this.route.navigateByUrl("event");
      },
      error:(err)=>{
        this.toast.error(err?.error?.message);
      }
    })
  }


  backPage(){
    this.route.navigateByUrl("event");
  }

}
