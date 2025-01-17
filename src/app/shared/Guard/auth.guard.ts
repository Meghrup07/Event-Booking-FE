import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginService);
  const router = inject(Router);
  if (authService.currentUser()) {
    return true;
  } else {
    router.navigateByUrl("");
    return false;
  }
};
