import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'journal', loadComponent: () => import('./pages/journal').then(m => m.JournalComponent) },
  { path: 'road-trips', loadComponent: () => import('./pages/road-trips').then(m => m.RoadTripsComponent) },
  { path: 'gallery', loadComponent: () => import('./pages/gallery').then(m => m.GalleryComponent) },
  { path: 'admin-login', loadComponent: () => import('./pages/admin-login').then(m => m.AdminLoginComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin').then(m => m.AdminComponent) },
  { path: 'article/:id', loadComponent: () => import('./pages/article-details').then(m => m.ArticleDetailsComponent) },
  { path: 'get-password-reset', loadComponent: () => import('./pages/get-password-reset').then(m => m.GetPasswordResetComponent) },
];
