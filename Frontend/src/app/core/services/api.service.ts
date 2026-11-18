import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Central HTTP client. Unwraps backend `{success,message,data}` envelopes. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(path: string, params?: HttpParams | Record<string, string | number | boolean | undefined | null>): Observable<T> {
    return this.http
      .get<ApiEnvelope<T>>(`${this.baseUrl}${path}`, { params: this.toParams(params) })
      .pipe(map((r) => r.data));
  }

  post<T>(path: string, body?: unknown): Observable<T> {
    return this.http
      .post<ApiEnvelope<T>>(`${this.baseUrl}${path}`, body ?? {})
      .pipe(map((r) => r.data));
  }

  put<T>(path: string, body?: unknown): Observable<T> {
    return this.http
      .put<ApiEnvelope<T>>(`${this.baseUrl}${path}`, body ?? {})
      .pipe(map((r) => r.data));
  }

  patch<T>(path: string, body?: unknown): Observable<T> {
    return this.http
      .patch<ApiEnvelope<T>>(`${this.baseUrl}${path}`, body ?? {})
      .pipe(map((r) => r.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<ApiEnvelope<T>>(`${this.baseUrl}${path}`)
      .pipe(map((r) => r.data));
  }

  private toParams(params?: HttpParams | Record<string, string | number | boolean | undefined | null>): HttpParams | undefined {
    if (!params || params instanceof HttpParams) return params;
    let hp = new HttpParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') hp = hp.set(k, String(v));
    }
    return hp;
  }
}
