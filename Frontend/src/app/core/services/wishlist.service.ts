import { Injectable, computed, signal } from '@angular/core';
import { STORAGE } from '../constants/storage';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly ids = signal<string[]>(this.readStorage());

  readonly count = computed(() => this.ids().length);

  isWishlisted(productId: string): boolean {
    return this.ids().includes(productId);
  }

  toggle(productId: string): void {
    this.ids.update((ids) =>
      ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId],
    );
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(STORAGE.wishlist, JSON.stringify(this.ids()));
  }

  private readStorage(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE.wishlist);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  }
}
