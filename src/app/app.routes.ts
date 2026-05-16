import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((c) => c.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((c) => c.Register),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((c) => c.Dashboard),
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/categories/list/category-list').then((c) => c.CategoryList),
  },
  {
    path: 'categories/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/categories/form/category-form').then((c) => c.CategoryForm),
  },
  {
    path: 'categories/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/categories/form/category-form').then((c) => c.CategoryForm),
  },
  {
    path: 'movements',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/movements/list/movement-list').then((c) => c.MovementList),
  },
  {
    path: 'movements/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/movements/form/movement-form').then((c) => c.MovementForm),
  },
  {
    path: 'movements/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/movements/form/movement-form').then((c) => c.MovementForm),
  },
];
