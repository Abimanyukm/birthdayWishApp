import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateAccessService {

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
}