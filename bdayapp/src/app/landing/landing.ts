import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Alert } from '../alert/alert';
import { DateAccessService } from '../services/date-access.service';

// ✅ Declare GA function globally for TypeScript
declare var gtag: Function;

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule, Alert],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class Landing {
  dob: string = '2000-01-01';
  alertMessage: string = '';
  showAlert: boolean = false;
  constructor(
    private router: Router,
    private dateAccessService: DateAccessService, private service: DateAccessService
  ) { }

  checkDob(): void {
    const timestamp = new Date().toISOString();
    if (this.dob === '2000-08-26') {
      this.dateAccessService.setDateMatched(true);

      this.alertMessage = 'Thank God, at least you remember that 💖';
      this.showAlert = true;

      // 🔥 GA event for successful DOB auth
      gtag('event', 'dob_auth_success', {
        event_category: 'authentication',
        event_label: 'DOB Matched',
        value: 1,
        entered_dob: this.dob,
        client_timestamp_dob_match: timestamp

      });
      this.service.sendTelegramAlert(
        'dob_auth_success',
        timestamp
      );

      setTimeout(() => {
        this.router.navigate(['/wish']);
      }, 2000);

    } else {
      this.dateAccessService.setDateMatched(false);

      this.alertMessage = 'You forget that too, really??? 💭';
      this.showAlert = true;
      // 🔥 GA event for failed DOB auth (mismatch)
      gtag('event', 'dob_auth_failed', {
        event_category: 'authentication',
        event_label: 'DOB Mismatch',
        value: 0,
        entered_dob: this.dob,
        client_timestamp_dob_missmatch: timestamp
      });
      this.dateAccessService.sendTelegramAlert(
  'dob_auth_failed',
  timestamp,
  {
    entered_dob: this.dob
  }
);
    }
  }

  handleAlertClosed(): void {
    this.showAlert = false;
    this.alertMessage = '';
  }
}
