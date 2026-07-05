import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-20 px-4">
      <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-playfair mb-3">Join the Community</h1>
          <p class="text-gray-500 text-sm">Create an account to save your favorite spots.</p>
        </div>

        <div *ngIf="error" class="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-start gap-3">
            <i class="ri-error-warning-fill mt-0.5"></i>
            <span>{{ error }}</span>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Name</label>
            <input type="text" [(ngModel)]="name" name="name" required
                   class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all">
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all">
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required minlength="11"
                   class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all">
          </div>
          
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Confirm Password</label>
            <input type="password" [(ngModel)]="password_confirmation" name="password_confirmation" required minlength="11"
                   class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all">
          </div>

          <div class="flex items-start gap-3">
            <div class="flex items-center h-5">
              <input type="checkbox" [(ngModel)]="receivesNewsfeed" name="receivesNewsfeed" class="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black">
            </div>
            <div class="text-sm">
              <label class="font-medium text-gray-900">Subscribe to Weekly Newsfeed</label>
              <p class="text-gray-500 text-xs mt-1">Get updates on the newest featured cafes directly to your inbox.</p>
            </div>
          </div>

          <button type="submit" [disabled]="loading"
                  class="w-full bg-black text-white rounded-xl py-4 font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
            {{ loading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </form>

        <p class="text-center mt-8 text-sm text-gray-500">
          Already have an account? 
          <a routerLink="/login" class="text-black font-bold hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  receivesNewsfeed = true;
  
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    if (this.password !== this.password_confirmation) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const payload = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
      receives_newsfeed: this.receivesNewsfeed
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        
        if (err.error?.errors) {
            const firstErrorKey = Object.keys(err.error.errors)[0];
            this.error = err.error.errors[firstErrorKey][0];
        } else {
            this.error = err.error?.message || 'Registration failed. Please try again.';
        }
        
        this.cdr.detectChanges();
      }
    });
  }
}
