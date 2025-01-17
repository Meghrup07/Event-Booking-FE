import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(LoginService);
  if (authService.currentUser()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.currentUser()?.token}`
      }
    })
  }
  return next(req);
};
