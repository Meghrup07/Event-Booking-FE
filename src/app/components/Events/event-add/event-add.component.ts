import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../../shared/services/event.service';

@Component({
  selector: 'app-event-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './event-add.component.html',
  styleUrl: './event-add.component.scss'
})
export class EventAddComponent implements OnInit {
  private eventService = inject(EventService);
  private route = inject(Router);
  private toast = inject(ToastrService)

  eventForm!: FormGroup;

  ngOnInit(): void {
    this.getEventForm();
  }

  getEventForm(){
    this.eventForm = new FormGroup({
      eventName: new FormControl(null, Validators.required),
      eventType: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      totalSeats: new FormControl(null, Validators.required),
      bookedSeats: new FormControl(null)
    })
  }

  addEventHandler(){
    this.eventService.addEvent(this.eventForm.value).subscribe({
      next:()=>{
        this.toast.success("Event added successfully");
        this.route.navigateByUrl("event");
        this.eventForm.reset();
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
