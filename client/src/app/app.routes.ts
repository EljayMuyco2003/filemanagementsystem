import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'upload', 
    loadComponent: () => import('./pages/upload/upload.component').then(m => m.UploadComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'templates', 
    loadComponent: () => import('./pages/templates/templates.component').then(m => m.TemplatesComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'admin/accounts', 
    loadComponent: () => import('./pages/admin-accounts/admin-accounts.component').then(m => m.AdminAccountsComponent),
    canActivate: [authGuard, roleGuard]
  },
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];
