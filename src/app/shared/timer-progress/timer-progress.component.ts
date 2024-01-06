import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'org-timer-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-progress.component.html',
  styleUrls: ['./timer-progress.component.scss'],
})

export class TimerProgressComponent implements OnDestroy, OnChanges {
  @Input() totalDuration = 0 as number;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() endTimer = new EventEmitter<void>();
  @Output() currentDuration = new EventEmitter<number>();
  duration = 0;
  c1StrokeDashArray = [100, 0] as any;
  c2StrokeDashArray = [0, 100] as any;
  c1StrokeDashoffset = '100' as any;
  displayTimer = '00:00';
  timeout = null as any;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalDuration'].currentValue) {
      this.duration = this.totalDuration;
      if (this.duration) {
        this.startTimer(this.duration);
      }
    }
  }
  mmssFormat() {
    const minutes = Math.floor(this.duration / 60);
    const seconds = this.duration % 60;
    this.displayTimer = `${this.formatDigits(minutes)}:${this.formatDigits(seconds)}`;
    this.currentDuration.emit(this.totalDuration - this.duration);
  }
  formatDigits(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  startTimer(duration: number) {
    this.timeout = setTimeout(() => {
      const time = duration;
      let i = 1;
      let k = ((i / duration) * 100);
      let l = 100 - k;
      i++;
      this.c1StrokeDashArray = [l, k];
      this.c2StrokeDashArray = [k, l];
      this.c1StrokeDashoffset = l;
      this.duration = (duration + 1);
      this.mmssFormat();
      const interval = setInterval(() => {
        if (i > time) {
          clearInterval(interval);
          clearTimeout(this.timeout);
          return;
        }
        k = ((i / duration) * 100);
        l = 100 - k;
        this.c1StrokeDashArray = [l, k];
        this.c2StrokeDashArray = [k, l];
        this.c1StrokeDashoffset = l;
        this.duration = (duration + 1) - i;
        this.mmssFormat();
        if (this.duration <= 1) {
          this.endTimer.emit();
        }
        i++;
      }, 1000);
    }, 0);
  }
  ngOnDestroy() {
    clearTimeout(this.timeout);
  }
}
