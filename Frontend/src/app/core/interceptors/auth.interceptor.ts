import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { STORAGE } from '../constants/storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem(STORAGE.authToken);
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        localStorage.removeItem(STORAGE.authToken);
        localStorage.removeItem(STORAGE.refreshToken);
        localStorage.removeItem(STORAGE.authUser);
        if (!req.url.includes('/auth/login')) router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
