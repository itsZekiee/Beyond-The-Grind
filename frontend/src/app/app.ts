import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('Beyond the Grinds');
  isAdminPage = false;
  isLoggedIn = false;

  navLinks = [
    { path: '/home', label: 'Home', icon: 'ri-cup-line' },
    { path: '/journal', label: 'Journal', icon: 'ri-book-open-line' },
    { path: '/road-trips', label: 'Road Trips', icon: 'ri-map-2-line' },
    { path: '/gallery', label: 'Gallery', icon: 'ri-image-line' },
  ];

  isMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminPage = event.url.startsWith('/admin');
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    this.isLoggedIn = localStorage.getItem('btg_admin') === '1';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
