import {
  Component,
  OnInit,
  OnDestroy,
  signal
} from '@angular/core';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Wish2026 } from '../wish2026/wish2026';
import { DateAccessService } from '../services/date-access.service';

interface Countdown {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

@Component({
  selector: 'app-wish-shell',
  standalone: true,
  imports: [CommonModule, Wish2026],
  templateUrl: './wish-shell.html',
  styleUrls: ['./wish-shell.css']
})
export class WishShell implements OnInit, OnDestroy {

  archiveOpen = false;
  private deviceModel: any;
  countdown = signal<Countdown>({
    days: '000',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  private intervalId?: ReturnType<typeof setInterval>;

  /*
   * 15 September 2027, 12:00 AM IST
   *
   * Explicitly using IST (+05:30)
   */
  private readonly targetTimestamp =
    new Date('2027-09-15T00:00:00+05:30').getTime();

  constructor(private router: Router,private service: DateAccessService) {}

  ngOnInit(): void {
    // Update immediately when the component loads
    this.updateCountdown();
this.deviceModel = this.service.getDeviceModel(); 
    // Keep the countdown updated every second
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  toggleArchive(): void {
    this.archiveOpen = !this.archiveOpen;
  }

goToYear(year: number): void {
    this.archiveOpen = false;

    // Timestamp for alert
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    this.service.sendTelegramAlert(
      'archive_navigate',
      timestamp,
      { target_year: year, device_model: this.deviceModel }
    );

    // Navigate to selected wish page
    this.router.navigate([`/wish-${year}`]);
  }
  private updateCountdown(): void {
    const remaining = this.targetTimestamp - Date.now();

    // Birthday has arrived
    if (remaining <= 0) {
      this.countdown.set({
        days: '000',
        hours: '00',
        minutes: '00',
        seconds: '00'
      });

      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }

      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);

    const hours = Math.floor(
      (totalSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;

    // Updating the signal automatically notifies Angular
    this.countdown.set({
      days: this.pad(days, 3),
      hours: this.pad(hours, 2),
      minutes: this.pad(minutes, 2),
      seconds: this.pad(seconds, 2)
    });
  }

  private pad(value: number, length: number): string {
    return String(value).padStart(length, '0');
  }
}
