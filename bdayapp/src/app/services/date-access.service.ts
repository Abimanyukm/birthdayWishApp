import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateAccessService {
private readonly telegramAlertUrl ='https://script.google.com/macros/s/AKfycbzbo1TiMDHLAb5BYlgpjuuPouCMdRrbVTcGDp-h5Qr5EFkui8lkxPHj8uWFneiWkZif/exec';

  private readonly key = 'dateMatched';

  setDateMatched(value: boolean): void {
    if (value) {
      sessionStorage.setItem(this.key, 'true');
    } else {
      sessionStorage.removeItem(this.key);
    }
  }

  isDateMatched(): boolean {
    return sessionStorage.getItem(this.key) === 'true';
  }

  sendTelegramAlert(
  event: string,
  timestamp: string,
  extra: Record<string, any> = {}
): void {
  fetch(this.telegramAlertUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify({
      event,
      timestamp,
      ...extra
    })
  }).catch(error => {
    console.error('Telegram alert failed:', error);
  });
}
}