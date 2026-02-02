import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Beyond the Grinds');

  navLinks = [
    { path: '/home', label: 'Home', icon: 'ri-cup-line' },
    { path: '/journal', label: 'Journal', icon: 'ri-book-open-line' },
    { path: '/road-trips', label: 'Road Trips', icon: 'ri-map-2-line' },
  ];

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
