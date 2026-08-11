import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { STORAGE } from '../constants/storage';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../models/user.model';
import { ApiService } from './api.service';

const DEMO_EMAIL = 'demo@bansikunj.in';
const DEMO_PASSWORD = 'demo123';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly userSignal = signal<User | null>(this.readStoredUser());
  private readonly loadingSignal = signal(false);

  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  login(payload: LoginPayload): Observable<User> {
    this.loadingSignal.set(true);
    return this.api.post<AuthResponse>('/auth/login', payload).pipe(
      catchError(() => this.mockLogin(payload)),
      tap((response) => this.setSession(response)),
      map((response) => response.user),
    );
  }

  register(payload: RegisterPayload): Observable<User> {
    this.loadingSignal.set(true);
    return this.api.post<AuthResponse>('/auth/register', payload).pipe(
      catchError(() => this.mockRegister(payload)),
      tap((response) => this.setSession(response)),
      map((response) => response.user),
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE.authToken);
    localStorage.removeItem(STORAGE.authUser);
    this.userSignal.set(null);
  }

  /** Sign in silently for demo purposes (used on the login page). */
  demoLogin(): Observable<User> {
    return this.login({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(STORAGE.authToken, response.token);
    localStorage.setItem(STORAGE.authUser, JSON.stringify(response.user));
    this.userSignal.set(response.user);
    this.loadingSignal.set(false);
  }

  // ---------------------------------------------------------------------------
  //  Mock authentication used until the backend exists
  // ---------------------------------------------------------------------------
  private mockLogin(payload: LoginPayload): Observable<AuthResponse> {
    const email = payload.email.trim().toLowerCase();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const demoCredentials = email === DEMO_EMAIL && payload.password === DEMO_PASSWORD;

    if (payload.password.length >= 6 && (validEmail || demoCredentials)) {
      return of({
        user: { id: 'u-demo', name: email.split('@')[0].replace(/[.\-_]/g, ' ') || 'Cookie Lover', email },
        token: `mock-token-${Date.now()}`,
      });
    }

    return throwError(() => new Error('Invalid email or password. Try demo@bansikunj.in / demo123'));
  }

  private mockRegister(payload: RegisterPayload): Observable<AuthResponse> {
    const email = payload.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || payload.password.length < 6) {
      return throwError(() => new Error('Please enter a valid email and a password of 6+ characters.'));
    }
    return of({
      user: { id: `u-${Date.now()}`, name: payload.name, email, phone: payload.phone },
      token: `mock-token-${Date.now()}`,
    });
  }

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE.authUser);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
