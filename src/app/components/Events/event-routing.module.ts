import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventAddComponent } from './event-add/event-add.component';
import { roleGuard } from '../../shared/Guard/role.guard';
import { EventEditComponent } from './event-edit/event-edit.component';

const routes: Routes = [
  {
    path: "list",
    component: EventListComponent,
    canActivate: [roleGuard]
  },
  {
    path: "add",
    component: EventAddComponent,
    canActivate: [roleGuard]
  },
  {
    path: "edit/:id",
    component: EventEditComponent,
    canActivate: [roleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
