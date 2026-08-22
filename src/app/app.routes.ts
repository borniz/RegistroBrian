import { Routes } from '@angular/router';
import { Vehicle } from './features/vehicles/pages/vehicle/vehicle';
import { Store } from './store/store';
import { Dashboard } from './dashboard/dashboard';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout, // El Layout solo va aquí como padre
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'vehicle',
        loadComponent: () => import('./features/vehicles/pages/vehicle/vehicle').then(m => m.Vehicle)
      },
      {
        path: 'store',
        loadComponent: () => import('./store/store').then(m => m.Store)
      },
      {
        path: 'restaurant',
        loadComponent: () => import('./restaurant/restaurant').then(m => m.Restaurant)
      },
      
    ]
  }
];