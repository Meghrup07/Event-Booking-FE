import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
   const authService = inject(LoginService);
    const router = inject(Router);
    if (authService.currentUser()?.role == "admin") {
      return true;
    } else {
      router.navigateByUrl("event");
      return false;
    }
};
