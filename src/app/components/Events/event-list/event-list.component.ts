import { Component, inject, OnInit } from '@angular/core';
import { EventService } from '../../../shared/services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {

  private eventService = inject(EventService);
  private authService = inject(LoginService);
  private route = inject(Router);
  private toast = inject(ToastrService);
  private modalService = inject(NgbModal);
  
  eventList: any[] = [];
  search = '';
  page = 1;
  limit = 10;
  totalCount:any = null
  adminRole:any = null

  selectedEventId: string | null = null;

  ngOnInit(): void {
    this.getEventsList();
    this.adminRole = this.authService.currentUser()?.role == "admin"
  }


  getEventsList() {
    this.eventService.getEventList(this.page, this.limit, this.search).subscribe((res:any) => {
      this.eventList = res.data;
      this.totalCount = res.total;
    });
  }

  onSearchChange(search: string): void {
    this.search = search;
    this.page = 1;
    this.getEventsList();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.getEventsList();
  }

  onPageSizeChange(size: number): void {
    this.limit = size;
    this.page = 1;
    this.getEventsList();
  }

  getTotalPages(): number {
    return Math.ceil((this.totalCount ?? 0) / this.limit);
  }

  getPagesArray(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  openModal(content: any, eventId: string) {
    this.selectedEventId = eventId;
    this.modalService.open(content);
  }

  deleteEvent() {
    if (this.selectedEventId) {
      this.eventService.deleteEvent(this.selectedEventId).subscribe({
        next: () => {
          this.toast.success("Event deleted successfully");
          this.modalService.dismissAll();
          this.getEventsList();
        },
        error: (err: any) => {
          this.toast.error(err?.error?.message);
        }
      });
    }
  }

  addEventPage(){
    this.route.navigateByUrl("event/add");
  }

  editEventPage(id:string){
    this.route.navigateByUrl(`event/edit/${id}`);
  }

  bookingPage(){
    this.route.navigateByUrl("booking/add")
  }

}
