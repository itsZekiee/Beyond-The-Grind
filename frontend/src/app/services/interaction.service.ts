import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

export interface Comment {
  id: number;
  body: string;
  created_at: string;
  user: { id: number; name: string; avatar: string | null };
}

export interface RatingSummary {
  avg: number;
  count: number;
  myRating: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.baseUrl = isPlatformBrowser(this.platformId) ? '' : 'http://127.0.0.1:8000';
  }

  // ─── Comments ──────────────────────────────────────────────────────────────

  getComments(cafeId: number | string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/api/cafes/${cafeId}/comments`);
  }

  postComment(cafeId: number | string, body: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/api/cafes/${cafeId}/comments`, { body });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/comments/${commentId}`);
  }

  // ─── Ratings ───────────────────────────────────────────────────────────────

  getRatingSummary(cafeId: number | string): Observable<RatingSummary> {
    return this.http.get<RatingSummary>(`${this.baseUrl}/api/cafes/${cafeId}/ratings/summary`);
  }

  submitRating(cafeId: number | string, value: number): Observable<RatingSummary> {
    return this.http.post<RatingSummary>(`${this.baseUrl}/api/cafes/${cafeId}/ratings`, { value });
  }
}
