import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "event",
        loadChildren: () => import("../Events/event.module").then(m => m.EventModule),
      },
      {
        path: "booking",
        loadChildren: () => import("../Booking/booking.module").then(m => m.BookingModule),
      },
      {
        path: 'user',
        loadChildren: () => import("../User/user.module").then(m => m.UserModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
