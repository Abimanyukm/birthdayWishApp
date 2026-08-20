import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.html',
  styleUrls: ['./alert.css'],
  imports:[CommonModule]
})
export class Alert {
  @Input() message: string = '';
  @Input() visible: boolean = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.visible = false;
    this.closed.emit(); // notify parent to reset state
  }
}
