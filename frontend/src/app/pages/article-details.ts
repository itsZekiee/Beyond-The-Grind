import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { InteractionService, Comment, RatingSummary } from '../services/interaction.service';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- Loading Skeleton -->
    <div *ngIf="loading" class="py-20 container mx-auto px-4 max-w-6xl">
      <div class="h-6 w-32 bg-gray-100 rounded-full mb-8 animate-pulse"></div>
      <div class="aspect-video bg-gray-100 rounded-3xl mb-4 animate-pulse"></div>
      <div class="flex gap-2 mb-8">
        <div *ngFor="let t of [1,2,3,4]" class="h-16 flex-1 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
      <div class="h-10 w-3/4 bg-gray-100 rounded-full mb-4 animate-pulse"></div>
      <div class="h-4 w-1/2 bg-gray-100 rounded-full animate-pulse"></div>
    </div>

    <!-- Error State -->
    <div *ngIf="!loading && !post" class="py-40 text-center">
      <i class="ri-error-warning-line text-6xl text-gray-200 mb-4 block"></i>
      <h2 class="text-2xl font-playfair text-gray-400 mb-4">Article not found</h2>
      <button routerLink="/journal" class="text-sm font-bold underline">Back to Journal</button>
    </div>

    <!-- Article Layout -->
    <div *ngIf="!loading && post" class="animate-in fade-in duration-700">
      <div class="container mx-auto px-4 py-10 max-w-7xl">

        <!-- Back Button -->
        <button routerLink="/journal"
          class="mb-8 inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-wider">
          <i class="ri-arrow-left-line"></i> Back to Journal
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

          <!-- ── MAIN CONTENT ────────────────────────────────────── -->
          <div>

            <!-- Hero Image Gallery -->
            <div class="mb-4 relative overflow-hidden rounded-3xl aspect-video bg-gray-100 group">
              <img *ngIf="currentImage"
                [src]="currentImage"
                [alt]="post.title"
                class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500">
              <i *ngIf="!currentImage" class="ri-image-line text-8xl text-gray-200 absolute inset-0 flex items-center justify-center"></i>

              <!-- Gallery nav arrows (only shown when multiple images) -->
              <ng-container *ngIf="post.images && post.images.length > 1">
                <button (click)="prevImage()"
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                  <i class="ri-arrow-left-s-line text-xl"></i>
                </button>
                <button (click)="nextImage()"
                  class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                  <i class="ri-arrow-right-s-line text-xl"></i>
                </button>
              </ng-container>

              <!-- Image counter badge -->
              <div *ngIf="post.images && post.images.length > 1"
                class="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                {{ currentImageIndex + 1 }} / {{ post.images.length }}
              </div>
            </div>

            <!-- Thumbnail Strip -->
            <div *ngIf="post.images && post.images.length > 1" class="flex gap-2 mb-8 overflow-x-auto pb-1">
              <button *ngFor="let img of post.images; let i = index"
                (click)="setImage(i)"
                class="flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all"
                [class.border-black]="i === currentImageIndex"
                [class.border-transparent]="i !== currentImageIndex">
                <img [src]="img" [alt]="'Photo ' + (i+1)" class="w-full h-full object-cover">
              </button>
            </div>

            <!-- Article Metadata -->
            <div class="mb-8">
              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span *ngFor="let tag of post.tags"
                  class="bg-gray-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {{ tag }}
                </span>
              </div>

              <h1 class="text-4xl md:text-5xl font-playfair mb-4 leading-tight text-gray-900">
                {{ post.title }}
              </h1>

              <div class="flex flex-wrap items-center gap-5 pb-6 border-b border-gray-100">
                <!-- Location -->
                <div class="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                  <i class="ri-map-pin-line text-gray-400"></i>
                  <span>{{ post.location }}</span>
                </div>

                <!-- Star Rating Overview -->
                <div class="flex items-center gap-1.5">
                  <div class="flex items-center gap-0.5">
                    <i *ngFor="let star of [1,2,3,4,5]" class="ri-star-fill text-sm"
                      [class.text-yellow-400]="star <= ratingSummary.avg"
                      [class.text-gray-200]="star > ratingSummary.avg"></i>
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ ratingSummary.avg || post.rating }}</span>
                  <span class="text-xs text-gray-400">({{ ratingSummary.count }} {{ ratingSummary.count === 1 ? 'rating' : 'ratings' }})</span>
                </div>

                <!-- Published Date -->
                <div class="flex items-center gap-1.5 text-sm font-medium text-gray-400">
                  <i class="ri-calendar-line"></i>
                  <span>{{ post.date }}</span>
                </div>

                <!-- Likes -->
                <button (click)="likePost()"
                  class="flex items-center gap-1.5 text-sm font-bold transition-colors ml-auto"
                  [class.text-red-500]="post.liked"
                  [class.text-gray-400]="!post.liked">
                  <i [class]="post.liked ? 'ri-heart-fill text-lg' : 'ri-heart-line text-lg'"></i>
                  {{ post.likes }} {{ post.likes === 1 ? 'Like' : 'Likes' }}
                </button>

                <!-- Share -->
                <button (click)="sharePost()"
                  class="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-black transition-colors">
                  <i class="ri-share-line text-lg"></i> Share
                </button>
              </div>
            </div>

            <!-- Admin / Official Review Content -->
            <div class="prose prose-lg max-w-none mb-12">
              <div class="text-gray-600 leading-relaxed space-y-5 whitespace-pre-wrap font-medium text-[15px]">
                {{ post.description }}
              </div>
            </div>

            <!-- ── COMMUNITY SECTION ───────────────────────────────── -->
            <div class="mt-16 pt-10 border-t border-gray-100">
              <h2 class="text-2xl font-playfair mb-2">Share Your Experience With Us!</h2>
              <p class="text-gray-400 text-sm mb-8">Community reviews and comments are visible to all visitors.</p>

              <!-- Rate this article (auth only) -->
              <div class="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Your Rating</h3>
                <div *ngIf="currentUser; else ratingPrompt">
                  <div class="flex items-center gap-2 mb-3">
                    <button *ngFor="let star of [1,2,3,4,5]"
                      (click)="setHoveredRating(star); submitRating(star)"
                      (mouseenter)="hoveredRating = star"
                      (mouseleave)="hoveredRating = 0"
                      class="text-3xl transition-all duration-100 hover:scale-125">
                      <i class="ri-star-fill"
                        [class.text-yellow-400]="star <= (hoveredRating || myRating)"
                        [class.text-gray-200]="star > (hoveredRating || myRating)"></i>
                    </button>
                    <span class="ml-2 text-sm font-medium text-gray-500" *ngIf="myRating">
                      You rated {{ myRating }}/5
                      <span *ngIf="ratingSubmitting" class="ml-1 text-gray-400">— saving...</span>
                    </span>
                  </div>
                  <p class="text-xs text-gray-400">Click a star to rate. Your rating updates the average.</p>
                </div>
                <ng-template #ratingPrompt>
                  <div class="flex items-center gap-3">
                    <div class="flex gap-1">
                      <i *ngFor="let s of [1,2,3,4,5]" class="ri-star-fill text-xl text-gray-200"></i>
                    </div>
                    <span class="text-sm text-gray-500">
                      <a routerLink="/login" class="font-bold text-black hover:underline">Sign in</a> to rate this article
                    </span>
                  </div>
                </ng-template>
              </div>

              <!-- Comment Form (auth only) -->
              <div class="mb-10">
                <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Leave a Comment</h3>
                <div *ngIf="currentUser; else commentPrompt">
                  <div class="flex items-start gap-3">
                    <div class="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                      <img *ngIf="currentUser.avatar" [src]="currentUser.avatar" [alt]="currentUser.name" class="w-full h-full object-cover">
                      <span *ngIf="!currentUser.avatar">{{ currentUser.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="flex-1">
                      <textarea [(ngModel)]="commentBody"
                        placeholder="Write your thoughts about this place..."
                        rows="3"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none text-sm">
                      </textarea>
                      <div class="flex items-center justify-between mt-2">
                        <span *ngIf="commentError" class="text-xs text-red-500">{{ commentError }}</span>
                        <span class="flex-1"></span>
                        <button (click)="postComment()"
                          [disabled]="!commentBody.trim() || commentSubmitting"
                          class="bg-black text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40">
                          {{ commentSubmitting ? 'Posting...' : 'Post Comment' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <ng-template #commentPrompt>
                  <div class="bg-gray-50 rounded-2xl p-6 text-center">
                    <i class="ri-chat-3-line text-3xl text-gray-300 mb-2 block"></i>
                    <p class="text-sm text-gray-500 mb-3">Join the conversation</p>
                    <a routerLink="/login"
                      class="inline-block bg-black text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors uppercase tracking-widest">
                      Sign In to Comment
                    </a>
                  </div>
                </ng-template>
              </div>

              <!-- Public Comments List -->
              <div>
                <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 mb-6">
                  {{ comments.length }} {{ comments.length === 1 ? 'Review' : 'Reviews' }}
                </h3>

                <div *ngIf="commentsLoading" class="space-y-4">
                  <div *ngFor="let s of [1,2,3]" class="flex gap-3 animate-pulse">
                    <div class="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-3 w-24 bg-gray-100 rounded"></div>
                      <div class="h-3 w-full bg-gray-100 rounded"></div>
                      <div class="h-3 w-3/4 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>

                <div *ngIf="!commentsLoading && comments.length === 0" class="text-center py-10 text-gray-400">
                  <i class="ri-chat-quote-line text-4xl mb-2 block"></i>
                  <p class="text-sm">No reviews yet. Be the first to share your experience!</p>
                </div>

                <div *ngIf="!commentsLoading" class="space-y-6">
                  <div *ngFor="let comment of comments" class="flex gap-3 group">
                    <div class="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                      <img *ngIf="comment.user.avatar" [src]="comment.user.avatar" [alt]="comment.user.name" class="w-full h-full object-cover">
                      <span *ngIf="!comment.user.avatar">{{ comment.user.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-bold text-gray-900">{{ comment.user.name }}</span>
                        <div class="flex items-center gap-3">
                          <span class="text-xs text-gray-400">{{ formatDate(comment.created_at) }}</span>
                          <button *ngIf="currentUser && currentUser.id === comment.user.id"
                            (click)="deleteComment(comment.id)"
                            class="text-xs text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                            <i class="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                      <p class="text-sm text-gray-600 leading-relaxed">{{ comment.body }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── SIDEBAR ──────────────────────────────────────────── -->
          <aside class="hidden lg:block">
            <div class="sticky top-24">
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Related Articles</h3>

              <div *ngIf="relatedLoading" class="space-y-4">
                <div *ngFor="let s of [1,2,3]" class="flex gap-3 animate-pulse">
                  <div class="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0"></div>
                  <div class="flex-1 space-y-2 pt-1">
                    <div class="h-3 bg-gray-100 rounded w-full"></div>
                    <div class="h-3 bg-gray-100 rounded w-2/3"></div>
                  </div>
                </div>
              </div>

              <div *ngIf="!relatedLoading && relatedArticles.length === 0"
                class="text-center py-8 text-gray-300 text-xs font-medium">
                No related articles found.
              </div>

              <div *ngIf="!relatedLoading" class="space-y-4">
                <a *ngFor="let article of relatedArticles"
                  [routerLink]="['/article', article.id]"
                  class="flex gap-3 group cursor-pointer p-3 rounded-2xl hover:bg-gray-50 transition-colors -mx-3">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img *ngIf="article.image" [src]="article.image" [alt]="article.title"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <i *ngIf="!article.image" class="ri-image-line text-2xl text-gray-200 w-full h-full flex items-center justify-center"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-bold text-gray-900 leading-tight mb-1 line-clamp-2 group-hover:text-black transition-colors">
                      {{ article.title }}
                    </h4>
                    <div class="flex items-center gap-1 mb-1">
                      <i *ngFor="let star of [1,2,3,4,5]" class="ri-star-fill text-[8px]"
                        [class.text-yellow-400]="star <= article.rating"
                        [class.text-gray-200]="star > article.rating"></i>
                    </div>
                    <span class="text-[10px] text-gray-400 flex items-center gap-1">
                      <i class="ri-map-pin-line"></i> {{ article.location }}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ArticleDetailsComponent implements OnInit {
  post: any = null;
  loading = true;
  currentUser: any = null;

  // Gallery
  currentImageIndex = 0;
  currentImage = '';

  // Community
  comments: Comment[] = [];
  commentsLoading = false;
  commentBody = '';
  commentSubmitting = false;
  commentError = '';

  // Ratings
  ratingSummary: RatingSummary = { avg: 0, count: 0, myRating: null };
  myRating = 0;
  hoveredRating = 0;
  ratingSubmitting = false;

  // Related articles
  relatedArticles: any[] = [];
  relatedLoading = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private interactionService: InteractionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && isPlatformBrowser(this.platformId)) {
      this.fetchPost(id);
    } else if (id) {
      // SSR: fetch using absolute URL
      this.fetchPost(id, 'http://127.0.0.1:8000');
    }
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (isPlatformBrowser(this.platformId) && window.location.hostname === 'localhost') {
      return 'http://127.0.0.1:8000' + path;
    }
    return path;
  }

  fetchPost(id: string, baseUrl = '') {
    this.loading = true;
    this.http.get<any>(`${baseUrl}/api/cafes/${id}`).subscribe({
      next: (item) => {
        // Build images array
        let images: string[] = [];
        if (Array.isArray(item.images) && item.images.length > 0) {
          images = item.images.map((img: string) => this.getImageUrl(img)).filter(Boolean);
        } else if (item.image_path) {
          images = [this.getImageUrl(item.image_path)];
        }

        this.post = {
          id: item.id,
          title: item.title || item.name,
          tags: item.tags || (item.type ? [item.type] : ['Coffee']),
          location: item.location,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
          rating: item.rating || 0,
          likes: item.likes || 0,
          liked: false,
          description: item.review,
          images,
        };

        this.currentImageIndex = 0;
        this.currentImage = images[0] || '';
        this.loading = false;

        // Record view
        this.http.post(`${baseUrl}/api/cafes/${id}/view`, {}).subscribe();

        // Load community data
        this.loadComments(id, baseUrl);
        this.loadRatingSummary(id);
        this.loadRelated(item);

        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.post = null;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Gallery ────────────────────────────────────────────────────────────────

  setImage(index: number) {
    this.currentImageIndex = index;
    this.currentImage = this.post.images[index] || '';
  }

  prevImage() {
    const newIndex = (this.currentImageIndex - 1 + this.post.images.length) % this.post.images.length;
    this.setImage(newIndex);
  }

  nextImage() {
    const newIndex = (this.currentImageIndex + 1) % this.post.images.length;
    this.setImage(newIndex);
  }

  // ── Ratings ────────────────────────────────────────────────────────────────

  loadRatingSummary(id: string) {
    this.interactionService.getRatingSummary(id).subscribe({
      next: (summary) => {
        this.ratingSummary = summary;
        this.myRating = summary.myRating || 0;
        this.cdr.detectChanges();
      }
    });
  }

  setHoveredRating(star: number) {
    this.hoveredRating = star;
  }

  submitRating(value: number) {
    if (!this.currentUser || this.ratingSubmitting) return;
    this.ratingSubmitting = true;
    this.myRating = value;
    this.interactionService.submitRating(this.post.id, value).subscribe({
      next: (summary) => {
        this.ratingSummary = summary;
        this.myRating = summary.myRating || value;
        this.ratingSubmitting = false;
        this.cdr.detectChanges();
      },
      error: () => { this.ratingSubmitting = false; }
    });
  }

  // ── Comments ───────────────────────────────────────────────────────────────

  loadComments(id: string, baseUrl = '') {
    this.commentsLoading = true;
    this.interactionService.getComments(id).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.commentsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.commentsLoading = false; }
    });
  }

  postComment() {
    if (!this.commentBody.trim() || this.commentSubmitting) return;
    this.commentSubmitting = true;
    this.commentError = '';

    this.interactionService.postComment(this.post.id, this.commentBody.trim()).subscribe({
      next: (comment) => {
        this.comments.unshift(comment);
        this.commentBody = '';
        this.commentSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.commentSubmitting = false;
        this.commentError = err.error?.message || 'Failed to post comment.';
        this.cdr.detectChanges();
      }
    });
  }

  deleteComment(commentId: number) {
    this.interactionService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== commentId);
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  // ── Related Articles ───────────────────────────────────────────────────────

  loadRelated(item: any) {
    const tags: string[] = item.tags || [];
    if (tags.length === 0) {
      this.relatedArticles = [];
      return;
    }

    this.relatedLoading = true;
    const baseUrl = isPlatformBrowser(this.platformId) ? '' : 'http://127.0.0.1:8000';

    // Fetch published articles and filter by shared tags client-side
    this.http.get<any[]>(`${baseUrl}/api/cafes?limit=20`).subscribe({
      next: (all) => {
        this.relatedArticles = all
          .filter(a => a.id !== item.id && Array.isArray(a.tags) && a.tags.some((t: string) => tags.includes(t)))
          .slice(0, 5)
          .map(a => ({
            id: a.id,
            title: a.title || a.name,
            location: a.location,
            rating: a.rating || 0,
            image: this.getImageUrl(Array.isArray(a.images) && a.images.length ? a.images[0] : a.image_path),
          }));
        this.relatedLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.relatedLoading = false; }
    });
  }

  // ── Like / Share ───────────────────────────────────────────────────────────

  likePost() {
    if (!this.post) return;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    const action = this.post.liked ? 'unlike' : 'like';
    const baseUrl = isPlatformBrowser(this.platformId) ? '' : 'http://127.0.0.1:8000';
    this.http.post<any>(`${baseUrl}/api/cafes/${this.post.id}/${action}`, {}).subscribe({
      next: (res) => {
        this.post.liked = !this.post.liked;
        this.post.likes = res.likes;
        this.cdr.detectChanges();
      }
    });
  }

  sharePost() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (navigator.share) {
      navigator.share({ title: this.post.title, text: this.post.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }
}
