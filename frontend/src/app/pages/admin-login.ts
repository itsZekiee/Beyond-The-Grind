import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="py-20 animate-in fade-in duration-700">
      <div class="container mx-auto px-4">
        <div class="max-w-md mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <h1 class="text-3xl font-playfair mb-6 tracking-tight text-center">Admin Sign In</h1>

          <form (ngSubmit)="login()" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
              <input [(ngModel)]="email" name="email" type="email" class="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black" placeholder="Enter email" required />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
              <input [(ngModel)]="password" name="password" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black" placeholder="Enter password" required />
            </div>
            <div *ngIf="error" class="text-red-500 text-xs">{{error}}</div>
            <button type="submit" class="w-full bg-black text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">Sign In</button>
            <button type="button" routerLink="/home" class="w-full bg-gray-100 text-gray-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors mt-2">Back to Home</button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  login() {
    const validEmail = 'habee2004@gmail.com';
    const validPassword = 'Zacchaeus_01011010';
    if (this.email === validEmail && this.password === validPassword) {
      localStorage.setItem('btg_admin', '1');
      this.router.navigate(['/admin']);
    } else {
      this.error = 'Invalid credentials';
    }
  }
}
