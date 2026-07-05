import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-20 px-4">
      <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-playfair mb-3">Welcome Back</h1>
          <p class="text-gray-500 text-sm">Sign in to your Beyond The Grind account</p>
        </div>

        <div *ngIf="error" class="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-start gap-3">
            <i class="ri-error-warning-fill mt-0.5"></i>
            <span>{{ error }}</span>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all">
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required
                   class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all">
          </div>

          <button type="submit" [disabled]="loading"
                  class="w-full bg-black text-white rounded-xl py-4 font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center mt-8 text-sm text-gray-500">
          Don't have an account? 
          <a routerLink="/register" class="text-black font-bold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        
        if (err.error?.errors) {
            const firstErrorKey = Object.keys(err.error.errors)[0];
            this.error = err.error.errors[firstErrorKey][0];
        } else {
            this.error = err.error?.message || 'Invalid email or password.';
        }
        
        this.cdr.detectChanges();
      }
    });
  }
}
