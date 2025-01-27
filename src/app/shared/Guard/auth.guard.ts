import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(LoginService);

  if (authService.currentUser()) {
    return true;
  } else {
    authService.logout();
    return false;
  }

};
