import { Routes } from '@angular/router';
import { authGuard } from './shared/Guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: '',
        loadChildren: () => import('./components/Auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: "event",
        loadChildren: () => import("./components/Events/event.module").then(m => m.EventModule),
        canActivate: [authGuard]
    },
    {
        path: "booking",
        loadChildren:() => import("./components/Booking/booking.module").then(m=>m.BookingModule),
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        loadChildren:()=> import("./components/User/user.module").then(m=> m.UserModule),
        canActivate: [authGuard]
    },
    {
        path: '**',
        loadChildren: () => import('./components/Auth/auth.module').then(m => m.AuthModule),
        pathMatch: "full"
    },
];
