import { Routes } from '@angular/router';
import { authGuard } from './shared/Guard/auth.guard';
import { ErrorPageComponent } from './components/Layout/error-page/error-page.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        
        loadChildren: () => import('./components/Auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: '',
        loadChildren: () => import('./components/Layout/layout.module').then(m => m.LayoutModule),
        canActivate: [authGuard],
    },
    {
        path: 'error',
        component: ErrorPageComponent
    },
    {
        path: '**',
        redirectTo: 'error'
    },
];
