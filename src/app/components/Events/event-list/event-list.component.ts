import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarModule } from 'primeng/calendar';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventService } from '../services/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-list',
  imports: [CommonModule, FormsModule, NgbModule, CalendarModule, FullCalendarModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit, AfterViewInit, OnDestroy {

  private eventService = inject(EventService);
  private authService = inject(LoginService);
  private route = inject(Router);
  private toast = inject(ToastrService);
  private modalService = inject(NgbModal);

  private unsubscribe: Subscription[] = [];

  @ViewChild('eventDetailsModal', { static: true }) eventDetailsModal: TemplateRef<any> | undefined;
  @ViewChild(FullCalendarComponent) fullCalendar: FullCalendarComponent | undefined;

  page = 1;
  limit = 100;
  search = ''
  adminRole: any = null;
  selectedEventId: string | null = null;
  selectedEvent: any = null;
  eventDates: string[] = [];
  events: any[] = [];

  calendarVisible = signal(true);

  ngOnInit(): void {
    this.getEventsList();
    this.adminRole = this.authService.currentUser()?.role === 'admin';
  }

  ngAfterViewInit(): void {
    const calendarApi = this.fullCalendar?.getApi();
    if (calendarApi) {
    }
  }

  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: '',
      center: '',
      right: ''
    },
    events: [],
    initialView: 'timeGridDay',
    editable: false,
    selectable: true,
    selectMirror: false,
    timeZone: 'local',
    eventDisplay: 'block',
    allDaySlot: false,
    select: (info) => this.addEventPage(info.startStr),
    eventClick: (info) => {
      this.openEventModal(info.event.id);
    }
  });

  getEventsList() {
    try {
      const saveSubscribe = this.eventService.getEventList(this.page, this.limit, this.search).subscribe((res: any) => {
        const uniqueDates = new Set<string>();
        this.events = res.data.map((event: any) => {

          const eventStartDate = new Date(event.date);
          const eventStartTime = event.startTime ? this.convertToDateTime(event.date, event.startTime) : event.date;
          const eventEndTime = event.endTime ? this.convertToDateTime(event.date, event.endTime) : event.date;

          const eventDate = eventStartDate.toISOString().split('T')[0];
          uniqueDates.add(eventDate);

          return {
            id: event._id,
            title: event.eventName,
            start: eventStartTime,
            end: eventEndTime,
            date: eventStartDate,
            description: event.eventType
          };
        });
        this.eventDates = Array.from(uniqueDates);
        this.updateCalendarEvents();
      });
      this.unsubscribe.push(saveSubscribe);
    }
    catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred');
    }
  }

  updateCalendarEvents() {
    this.calendarOptions.set({
      events: this.events
    });
  }

  convertToDateTime(date: string, time: string) {
    const eventDate = new Date(date);
    const [timeStr, period] = time.split(' ');
    let [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    eventDate.setHours(hours, minutes, 0);
    return eventDate.toISOString();
  }

  onDateChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedDate = target.value;
    let selectedDay: Date;
    if (selectedDate === 'today') {
      selectedDay = new Date();
    } else {
      selectedDay = new Date(selectedDate);
    }
    const selectedEvents = this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === selectedDay.toDateString();
    });
    this.calendarOptions.set({
      events: selectedEvents,
      initialView: 'timeGridDay',
    });
    const calendarApi = this.fullCalendar?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(selectedDay);
    }
  }


  openEventModal(eventId: string) {
    const selectedEvent = this.events.find(event => event.id === eventId);
    if (selectedEvent) {
      this.selectedEvent = selectedEvent;
      this.modalService.open(this.eventDetailsModal);
    }
  }

  openModal(content: any, eventId: string) {
    this.selectedEventId = eventId;
    this.modalService.open(content);
  }

  deleteEvent() {
    try {
      if (this.selectedEventId) {
        const saveSubscribe = this.eventService.deleteEvent(this.selectedEventId).subscribe({
          next: () => {
            this.toast.success('Event deleted successfully');
            this.modalService.dismissAll();
            this.getEventsList();
          },
          error: (err: any) => {
            this.toast.error(err?.error?.message || "Something went wrong. Please try again later.");
          }
        });
        this.unsubscribe.push(saveSubscribe);
      }
    } catch (err: any) {
      this.toast.error(err || 'An unexpected error occurred');
    }
  }

  addEventPage(date?: string) {
    if (date) {
      this.route.navigateByUrl(`event/add?date=${date}`);
    } else {
      this.route.navigateByUrl('event/add');
    }
  }

  editEventPage(id: string) {
    this.route.navigateByUrl(`event/edit/${id}`);
    this.modalService.dismissAll();
  }

  bookingPage() {
    this.route.navigateByUrl('booking/add');
    this.modalService.dismissAll();
  }


  ngOnDestroy(): void {
    this.unsubscribe.forEach((sub) => sub.unsubscribe());
  }

}
