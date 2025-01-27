import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../services/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-add',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './event-add.component.html',
  styleUrl: './event-add.component.scss'
})
export class EventAddComponent implements OnInit, OnDestroy {
  private eventService = inject(EventService);
  private route = inject(Router);
  private toast = inject(ToastrService);
  private activateRoute = inject(ActivatedRoute);

  private unsubscribe: Subscription[] = [];

  eventForm!: FormGroup;
  eventInputDate: any;
  eventDate: any;

  ngOnInit(): void {
    this.getEventForm();
    this.getEventDate();
  }

  getEventForm() {
    this.eventForm = new FormGroup({
      eventName: new FormControl('', Validators.required),
      eventType: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', [Validators.required, this.endTimeAfterStartTime()]),
      totalSeats: new FormControl('', Validators.required),
      bookedSeats: new FormControl(null)
    })
  }

  getEventDate() {
    this.eventDate = this.activateRoute.snapshot.queryParamMap.get('date');
    if (this.eventDate) {
      this.eventInputDate = new Date(this.eventDate).toISOString().split('T')[0];
      this.eventForm.patchValue({
        date: this.eventInputDate
      });
    }
  }

  addEventHandler() {
    try {
      if (this.eventForm.valid) {
        const formData = this.eventForm.value;
        formData.startTime = this.convertTo12HourFormat(formData.startTime);
        formData.endTime = this.convertTo12HourFormat(formData.endTime);

        const saveSubscribe = this.eventService.addEvent(formData).subscribe({
          next: () => {
            this.toast.success("Event added successfully");
            this.route.navigateByUrl("event/list");
            this.eventForm.reset();
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
      this.toast.error(err || 'An unexpected error occurred')
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

  backPage() {
    this.route.navigateByUrl("event/list");
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sub) => sub.unsubscribe());
  }

}
