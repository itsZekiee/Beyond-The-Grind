import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  receives_newsfeed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.baseUrl = isPlatformBrowser(this.platformId) ? '' : 'http://127.0.0.1:8000';
    this.loadToken();
  }

  private loadToken() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Fetch current user from token
        this.http.get<User>(`${this.baseUrl}/api/me`).subscribe({
          next: (user) => this.currentUserSubject.next(user),
          error: () => this.logout() // Invalid token
        });
      }
    }
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/register`, data).pipe(
      tap((res: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('auth_token', res.access_token);
        }
        this.currentUserSubject.next(res.user);
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/login`, credentials).pipe(
      tap((res: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('auth_token', res.access_token);
        }
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      this.http.post(`${this.baseUrl}/api/logout`, {}).subscribe({
        next: () => {},
        error: () => {}
      });
    }
    this.currentUserSubject.next(null);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
