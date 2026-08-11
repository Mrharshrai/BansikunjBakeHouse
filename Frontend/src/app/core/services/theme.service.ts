import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'bansikunj-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(this.load());

  constructor() {
    this.apply(this.isDark());
  }

  toggle(): void {
    this.set(!this.isDark());
  }

  private set(dark: boolean): void {
    this.isDark.set(dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // ignore storage errors (private mode, etc.)
    }
    this.apply(dark);
  }

  private load(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  }

  private apply(dark: boolean): void {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }
}
