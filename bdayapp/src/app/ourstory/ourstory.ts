import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// ✅ Declare GA globally
declare var gtag: Function;

interface StoryImage {
  src: string;
  filename: string;
}

@Component({
  selector: 'app-ourstory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ourstory.html',
  styleUrl: './ourstory.css',
})
export class Ourstory implements AfterViewInit, OnDestroy {
  @ViewChild('carouselRef') carouselRef!: ElementRef<HTMLDivElement>;
  @ViewChild('storyAudio') storyAudio!: ElementRef<HTMLAudioElement>;

  images: StoryImage[] = Array.from({ length: 16 }, (_, i) => ({
    src: `images/story${i + 1}.png`,
    filename: `our-story-${i + 1}.png`,
  }));

  activeIndex = 0;
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  audioStarted = false;
  showAudioPopup = true; // show popup on load

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    const audioEl = this.storyAudio?.nativeElement;
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
  }

  confirmAudio(play: boolean): void {
    this.showAudioPopup = false;
    if (play) {
      this.startAudio();
    }
  }

  startAudio(): void {
    const audioEl = this.storyAudio?.nativeElement;
    if (!audioEl || this.audioStarted) return;

    audioEl.play()
      .then(() => {
        this.audioStarted = true;
        console.log('Audio started successfully.');

        // 🔥 GA event for audio start
        gtag('event', 'audio_started', {
          event_category: 'interaction',
          event_label: 'Story Audio Played',
          value: 1
        });
      })
      .catch(err => {
        console.warn('Playback blocked:', err);
      });
  }

  private updateActiveIndex(): void {
    const el = this.carouselRef?.nativeElement;
    if (!el) return;
    const slideWidth = el.scrollWidth / this.images.length;
    const index = Math.round(el.scrollLeft / slideWidth);
    const newIndex = Math.max(0, Math.min(index, this.images.length - 1));

    if (newIndex !== this.activeIndex) {
      this.activeIndex = newIndex;

      // 🔥 GA event when image is scrolled
      gtag('event', 'image_scrolled', {
        event_category: 'interaction',
        event_label: `Scrolled to image ${this.activeIndex + 1}`,
        value: this.activeIndex + 1
      });
    }
  }

  scrollToIndex(index: number): void {
    const el = this.carouselRef?.nativeElement;
    if (!el) return;
    const slideWidth = el.scrollWidth / this.images.length;
    el.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
    this.activeIndex = index;

    // 🔥 GA event when user clicks dot navigation
    gtag('event', 'image_dot_click', {
      event_category: 'interaction',
      event_label: `Dot clicked for image ${index + 1}`,
      value: index + 1
    });
  }

  scrollByCard(direction: 1 | -1): void {
    const next = this.activeIndex + direction;
    if (next < 0 || next >= this.images.length) return;
    this.scrollToIndex(next);
  }

  async downloadImage(src: string, filename: string): Promise<void> {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // 🔥 GA event for image download
      gtag('event', 'image_download', {
        event_category: 'interaction',
        event_label: filename,
        value: 1
      });
    } catch {
      window.open(src, '_blank');
    }
  }
}
