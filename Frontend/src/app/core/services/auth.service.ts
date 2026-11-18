import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { STORAGE } from '../constants/storage';
import { AuthBundle, LoginPayload, PasswordChangeRequest, RegisterPayload, Role, TokenBundle, UserOut, UserProfileUpdate, UserSummary } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly userSignal = signal<UserSummary | UserOut | null>(this.readUser());
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!localStorage.getItem(STORAGE.authToken) && !!this.userSignal());
  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');
  readonly role = computed<Role | null>(() => this.userSignal()?.role ?? null);

  login(payload: LoginPayload): Observable<UserSummary> {
    return this.api.post<AuthBundle>('/auth/login', payload).pipe(tap((b) => this.setSession(b)), map((b) => b.user));
  }

  register(payload: RegisterPayload): Observable<UserSummary> {
    return this.api.post<AuthBundle>('/auth/register', payload).pipe(tap((b) => this.setSession(b)), map((b) => b.user));
  }

  refresh(): Observable<void> {
    const refresh_token = localStorage.getItem(STORAGE.refreshToken);
    if (!refresh_token) throw new Error('No refresh token');
    return this.api.post<TokenBundle>('/auth/refresh', { refresh_token }).pipe(
      tap((b) => { localStorage.setItem(STORAGE.authToken, b.tokens.access_token); localStorage.setItem(STORAGE.refreshToken, b.tokens.refresh_token); }),
      map(() => undefined),
    );
  }

  me(): Observable<UserOut> {
    return this.api.get<UserOut>('/users/me').pipe(tap((u) => this.setUser(u)));
  }

  updateProfile(body: UserProfileUpdate): Observable<UserOut> {
    return this.api.patch<UserOut>('/users/me', body).pipe(tap((u) => this.setUser(u)));
  }

  changePassword(body: PasswordChangeRequest) {
    return this.api.post('/users/me/change-password', body);
  }

  forgotPassword(email: string) { return this.api.post('/auth/forgot-password', { email }); }
  resetPassword(payload: { token: string; password: string }) { return this.api.post('/auth/reset-password', payload); }
  verifyEmail(token: string) { return this.api.post('/auth/verify-email', { token }); }
  resendVerification(email: string) { return this.api.post('/auth/resend-verification', { email }); }

  logout(): void {
    const token = localStorage.getItem(STORAGE.authToken);
    if (token) this.api.post('/auth/logout', {}).subscribe({ error: () => {} });
    this.clearSession();
  }

  logoutAll(): void { this.api.post('/auth/logout-all', {}).subscribe({ error: () => {} }); this.clearSession(); }

  private setSession(bundle: AuthBundle): void {
    localStorage.setItem(STORAGE.authToken, bundle.tokens.access_token);
    localStorage.setItem(STORAGE.refreshToken, bundle.tokens.refresh_token);
    this.setUser(bundle.user);
  }

  private setUser(user: UserSummary | UserOut): void {
    localStorage.setItem(STORAGE.authUser, JSON.stringify(user));
    this.userSignal.set(user);
  }

  private clearSession(): void {
    localStorage.removeItem(STORAGE.authToken);
    localStorage.removeItem(STORAGE.refreshToken);
    localStorage.removeItem(STORAGE.authUser);
    this.userSignal.set(null);
  }

  private readUser(): UserSummary | UserOut | null {
    try { const r = localStorage.getItem(STORAGE.authUser); return r ? JSON.parse(r) : null; } catch { return null; }
  }
}
