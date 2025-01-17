import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { BusyServiceService } from '../services/busy-service.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyServiceService)

  busyService.busy();

  return next(req).pipe(
    delay(1000),
    finalize(() => {
      busyService.idle()
    })
  );
};
