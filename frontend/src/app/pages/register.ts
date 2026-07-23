import { Component, ChangeDetectorRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

declare const google: any;

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

        <!-- Google SSO Button -->
        <div class="mb-6">
          <div id="google-signup-btn" class="flex justify-center"></div>
          <div *ngIf="!googleReady" class="flex justify-center">
            <button disabled
              class="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-500 bg-gray-50 cursor-not-allowed">
              <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/><path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/><path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
              Continue with Google
            </button>
          </div>
        </div>

        <div class="relative flex items-center gap-4 mb-6">
          <div class="flex-1 h-px bg-gray-100"></div>
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">or sign up with email</span>
          <div class="flex-1 h-px bg-gray-100"></div>
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
export class RegisterComponent implements AfterViewInit {
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  receivesNewsfeed = true;
  
  loading = false;
  error = '';
  googleReady = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initGoogleSignIn();
  }

  private initGoogleSignIn() {
    const attempt = () => {
      if (typeof google === 'undefined' || !google?.accounts?.id) {
        setTimeout(attempt, 300);
        return;
      }

      const clientId = (window as any).__GOOGLE_CLIENT_ID__ || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => this.handleGoogleCredential(response.credential),
      });

      google.accounts.id.renderButton(
        document.getElementById('google-signup-btn'),
        { theme: 'outline', size: 'large', width: 400, text: 'signup_with' }
      );

      this.googleReady = true;
      this.cdr.detectChanges();
    };
    attempt();
  }

  handleGoogleCredential(credential: string) {
    this.loading = true;
    this.error = '';
    this.authService.googleSignIn(credential).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Google sign-up failed. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

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
