import { NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../services/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-edit',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './event-edit.component.html',
  styleUrl: './event-edit.component.scss'
})
export class EventEditComponent implements OnInit, OnDestroy {
  private eventService = inject(EventService);
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toast = inject(ToastrService);

  private unsubscribe: Subscription[] = [];

  editEventForm!: FormGroup;
  eventDetails: any = null;
  eventId: any;

  ngOnInit(): void {
    this.eventId = this.activatedRoute.snapshot.paramMap.get("id");
    this.getEventEditForm();
    this.getEventDetails();
  }

  getEventEditForm() {
    this.editEventForm = new FormGroup({
      eventName: new FormControl('', Validators.required),
      eventType: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', [Validators.required, this.endTimeAfterStartTime()]),
      totalSeats: new FormControl('', Validators.required),
      bookedSeats: new FormControl(null)
    })
  }

  getEventDetails() {
    try {
      const saveSubscribe = this.eventService.getEvent(this.eventId).subscribe((res) => {
        this.eventDetails = res;
        const formatedDate = new Date(this.eventDetails.date).toISOString().split('T')[0];
        const startTime24 = this.convertTo24HourFormat(this.eventDetails.startTime);
        const endTime24 = this.convertTo24HourFormat(this.eventDetails.endTime);
        this.editEventForm.patchValue({
          eventName: this.eventDetails.eventName,
          eventType: this.eventDetails.eventType,
          date: formatedDate,
          startTime: startTime24,
          endTime: endTime24,
          totalSeats: this.eventDetails.totalSeats,
          bookedSeats: this.eventDetails.bookedSeats
        })
      });
      this.unsubscribe.push(saveSubscribe);
    } catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred');
    }
  }

  editEventHandler() {
    try {

      if (this.editEventForm.valid) {
        const formData = this.editEventForm.value;
        formData.startTime = this.convertTo12HourFormat(formData.startTime);
        formData.endTime = this.convertTo12HourFormat(formData.endTime);

        const saveSubscribe = this.eventService.updateEvent(this.eventId, formData).subscribe({
          next: () => {
            this.toast.success("Event updated successfully");
            this.route.navigateByUrl("event/list");
          },
          error: (err) => {
            this.toast.error(err?.error?.message || "Something went wrong. Please try again later.");
          }
        });
        this.unsubscribe.push(saveSubscribe);
      }
      else {
        this.toast.error('Please fill in all required fields');
      }

    } catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred');
    }

  }


  endTimeAfterStartTime() {
    return (control: AbstractControl): ValidationErrors | null => {
      const startTime = control.root?.get('startTime')?.value;
      const endTime = control.value;

      if (startTime && endTime) {
        const start = new Date(`2024-01-01T${startTime}:00`);
        const end = new Date(`2024-01-01T${endTime}:00`);

        if (end <= start) {
          return { endBeforeStart: true };
        }
      }
      return null;
    };
  }

  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(':');
    const ampm = +hours >= 12 ? 'PM' : 'AM';
    const hourIn12 = +hours % 12 || 12;
    return `${hourIn12}:${minutes} ${ampm}`;
  }

  convertTo24HourFormat(time: any) {
    const [timePart, ampm] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    hours = parseInt(hours, 10);
    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  backPage() {
    this.route.navigateByUrl("event/list");
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sub) => sub.unsubscribe());
  }

}
