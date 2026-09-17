import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Alert } from '../alert/alert';
import { DateAccessService } from '../services/date-access.service';


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
  deviceModel:any;
  constructor(
    private router: Router,
    private dateAccessService: DateAccessService, private service: DateAccessService
  ) { }

  checkDob(): void {
    this.deviceModel=this.service.getDeviceModel();
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, day: '2-digit', month: 'short', year: 'numeric' });
    if (this.dob === '2000-08-26') {
      this.dateAccessService.setDateMatched(true);

      this.alertMessage = 'Thank God, at least you remember that 💖';
      this.showAlert = true;

      this.service.sendTelegramAlert(
        'dob_auth_success',
        timestamp,
        {device_model:this.deviceModel}
      );

      setTimeout(() => {
        this.router.navigate(['/wish-shell']);
      }, 2000);

    } else {
      this.dateAccessService.setDateMatched(false);

      this.alertMessage = 'You forget that too, really??? 💭';
      this.showAlert = true;
      this.dateAccessService.sendTelegramAlert(
        'dob_auth_failed',
        timestamp,
        {
          entered_dob: this.dob,
          device_model:this.deviceModel
        }
        
      );
    }
  }

  handleAlertClosed(): void {
    this.showAlert = false;
    this.alertMessage = '';
  }
}
