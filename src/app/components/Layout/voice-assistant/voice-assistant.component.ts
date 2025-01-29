import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../Booking/services/booking.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-voice-assistant',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './voice-assistant.component.html',
  styleUrl: './voice-assistant.component.scss'
})
export class VoiceAssistantComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private toast = inject(ToastrService);
  private bookingService = inject(BookingService);

  recognition: any;
  isListening = false;
  eventList: any[] = [];

  ngOnInit() {
    this.initializeSpeechRecognition();
    this.getEventsList();
  }

  initializeSpeechRecognition() {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("command", command)
      this.processCommand(command);
    };
    this.recognition.onerror = (event: any) => {
      this.toast.error('Voice recognition error. Please try again.');
    };
  }

  getEventsList() {
    this.bookingService.eventList().subscribe({
      next: (res: any) => {
        this.eventList = res.data;
      },
      error: (err) => {
        this.toast.error('Error fetching events');
      }
    });
  }

  toggleListening() {
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      this.recognition.start();
      this.isListening = true;
    }
  }


  processCommand(command: string) {
    if (command.includes('book') || command.includes('booking') || command.includes('add') || command.includes('adding')) {
      const eventMatch = this.eventList.find(event =>
        command.toLowerCase().includes(event.eventName.toLowerCase())
      );

      let seats = 1;

      const numberWords = ['one', 'two', 'three', 'four'];
      const numberValues = [1, 2, 3, 4];
      
      for (let i = 0; i < numberWords.length; i++) {
        if (command.includes(` ${numberWords[i]} `)) {
          seats = numberValues[i];
          break;
        }
      }
      
      const numberMatch = command.match(/\b([1-4])\b/);
      if (numberMatch) {
        seats = parseInt(numberMatch[1]);
      }

      if (eventMatch) {
        this.router.navigate(['/booking/add'], {
          queryParams: {
            eventId: eventMatch._id,
            seatNumber: seats,
          }
        });
        this.recognition.stop();
        this.isListening = false;
      }
      else {
        this.toast.warning('Please specify a valid event name.');
        this.recognition.stop();
        this.isListening = false;
      }
    }
    else {
      this.toast.warning('Please specify a valid command.');
      this.recognition.stop();
        this.isListening = false;
    }
  }

  ngOnDestroy() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
