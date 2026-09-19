import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateAccessService {
  private readonly telegramAlertUrl = 'https://script.google.com/macros/s/AKfycbzbo1TiMDHLAb5BYlgpjuuPouCMdRrbVTcGDp-h5Qr5EFkui8lkxPHj8uWFneiWkZif/exec';
  private readonly key = 'dateMatched';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setDateMatched(value: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (value) {
        sessionStorage.setItem(this.key, 'true');
      } else {
        sessionStorage.removeItem(this.key);
      }
    }
  }

  isDateMatched(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(this.key) === 'true';
    }
    return false; // safe default during prerender
  }

  sendTelegramAlert(event: string, timestamp: string, extra: Record<string, any> = {}): void {
    fetch(this.telegramAlertUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ event, timestamp, ...extra })
    }).catch(error => console.error('Telegram alert failed:', error));
  }

  getDeviceModel(): string {
    if (isPlatformBrowser(this.platformId)) {
      const ua = navigator.userAgent;
      if (/iPhone/.test(ua)) return 'iPhone';
      if (/iPad/.test(ua)) return 'iPad';
      const androidMatch = ua.match(/Android.*;\s([A-Za-z0-9\-]+)/);
      if (androidMatch && androidMatch[1]) return androidMatch[1];
      if (/Windows NT/.test(ua)) return 'Windows PC';
      if (/Macintosh/.test(ua)) return 'Mac';
    }
    return 'Unknown Device';
  }
}
