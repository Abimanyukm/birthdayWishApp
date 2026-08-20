import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
declare var gtag: Function;
interface ConfettiParticle {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

@Component({
  selector: 'app-wish',
  imports: [CommonModule],
  templateUrl: './wish.html',
  styleUrl: './wish.css',
})
export class Wish implements AfterViewInit, OnDestroy {
  @ViewChild('trackRef') trackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('knifeRef') knifeRef!: ElementRef<HTMLDivElement>;
  @ViewChild('confettiCanvas') confettiCanvas?: ElementRef<HTMLCanvasElement>;
  private router = inject(Router);
  protected readonly Math = Math;
alertVisible = false;
alertMessage = 'Dont zoom too much on face ,chatgpt ആണ് അറിയാലോ ';
  knifeX = 0;
  progress = 0;
  handleHalfWidth = 24;

  isDragging = false;
  isCut = false;
  showConfetti = false;
  showMessage = false;

  private readonly handleWidth = 48;
  private readonly cutTriggerProgress = 0.7;
  private readonly autoCutProgress = 0.96;

  private trackWidth = 0;
  private dragStartX = 0;
  private dragStartKnifeX = 0;

  private confettiParticles: ConfettiParticle[] = [];
  private confettiAnimId = 0;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.measureTrack();
    this.resizeObserver = new ResizeObserver(() => this.measureTrack());
    this.resizeObserver.observe(this.trackRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    cancelAnimationFrame(this.confettiAnimId);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.measureTrack();
  }

  private measureTrack(): void {
    const trackEl = this.trackRef?.nativeElement;
    if (!trackEl) return;
    this.trackWidth = trackEl.clientWidth;
  }

  private get maxKnifeX(): number {
    return Math.max(this.trackWidth - this.handleWidth, 0);
  }

  onPointerDown(event: PointerEvent): void {
    if (this.isCut) return;
    event.preventDefault();

    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartKnifeX = this.knifeX;

    this.knifeRef.nativeElement.setPointerCapture(event.pointerId);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.isDragging) return;

    const dx = event.clientX - this.dragStartX;
    const max = this.maxKnifeX;

    this.knifeX = this.clamp(this.dragStartKnifeX + dx, 0, max);
    this.progress = max > 0 ? this.knifeX / max : 0;

    if (this.progress >= this.autoCutProgress) {
      this.endDrag();
      this.cutCake();
    }
  };

  private onPointerUp = (): void => {
    if (!this.isDragging) return;
    this.endDrag();

    if (this.progress >= this.cutTriggerProgress) {
      this.cutCake();
    } else {
      this.knifeX = 0;
      this.progress = 0;
    }
  };

  private endDrag(): void {
    this.isDragging = false;
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.isCut) return;
    const max = this.maxKnifeX;
    const step = 20;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.knifeX = this.clamp(this.knifeX + step, 0, max);
      this.progress = max > 0 ? this.knifeX / max : 0;
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.knifeX = this.clamp(this.knifeX - step, 0, max);
      this.progress = max > 0 ? this.knifeX / max : 0;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.cutCake();
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  cutCake(): void {
    if (this.isCut) return;
    this.isCut = true;
    this.knifeX = this.maxKnifeX;
    this.progress = 1;
    this.showConfetti = true;
    this.showMessage = true;

    // 🔥 GA event when cake is cut
    gtag('event', 'cake_cut', {
      event_category: 'interaction',
      event_label: 'Cake Cut Triggered',
      value: 1,
      progress: this.progress
    });

    setTimeout(() => {
      this.showConfetti = true;
      requestAnimationFrame(() => this.startConfetti());
    }, 450);

    setTimeout(() => {
      this.showMessage = true;
    }, 950);
  }

  private startConfetti(): void {
    const canvas = this.confettiCanvas?.nativeElement;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const colors = ['#ff6f91', '#ffd166', '#06d6a0', '#4cc9f0', '#f72585', '#ffffff'];
    this.confettiParticles = Array.from({ length: 140 }, () => ({
      x: Math.random() * width,
      y: -20 - Math.random() * height * 0.6,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      speed: 2 + Math.random() * 3,
      drift: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let elapsed = 0;
    const duration = 4200;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      elapsed += dt;

      ctx.clearRect(0, 0, width, height);

      for (const p of this.confettiParticles) {
        p.y += p.speed;
        p.x += p.drift;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (elapsed < duration) {
        this.confettiAnimId = requestAnimationFrame(animate);
      } else {
        this.showConfetti = false;
      }
    };

    this.confettiAnimId = requestAnimationFrame(animate);
  }

  resetCake() {
    this.isCut = false;
    this.showConfetti = false;
    this.showMessage = false;
    this.knifeX = 0; // reset knife position if needed
    this.progress = 0;
  }

redirectToStory(): void {
  // instead of navigating immediately, show the alert
  this.router.navigate(['/ourstory']);
}


}