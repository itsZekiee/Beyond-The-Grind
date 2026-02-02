import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'journal', loadComponent: () => import('./pages/journal').then(m => m.JournalComponent) },
  { path: 'road-trips', loadComponent: () => import('./pages/road-trips').then(m => m.RoadTripsComponent) },
  { path: 'gallery', loadComponent: () => import('./pages/gallery').then(m => m.GalleryComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin').then(m => m.AdminComponent) },
];
