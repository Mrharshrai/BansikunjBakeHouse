import { HttpInterceptorFn } from '@angular/common/http';
import { STORAGE } from '../constants/storage';

/** Attaches the bearer token (if present) to every API request. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(STORAGE.authToken);

  if (!token) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(cloned);
};
