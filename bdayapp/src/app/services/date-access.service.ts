import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateAccessService {
  private readonly telegramAlertUrl = 'https://script.google.com/macros/s/AKfycbzbo1TiMDHLAb5BYlgpjuuPouCMdRrbVTcGDp-h5Qr5EFkui8lkxPHj8uWFneiWkZif/exec';

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

  getDeviceModel(): string {
  const ua = navigator.userAgent;

  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua)) return 'iPad';

  const androidMatch = ua.match(/Android.*;\s([A-Za-z0-9\-]+)/);
  if (androidMatch && androidMatch[1]) return androidMatch[1];

  if (/Windows NT/.test(ua)) return 'Windows PC';
  if (/Macintosh/.test(ua)) return 'Mac';

  return 'Unknown Device';
}

}