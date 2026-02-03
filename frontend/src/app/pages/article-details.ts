import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="py-20 animate-in fade-in duration-700" *ngIf="post">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <button routerLink="/journal" class="mb-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
            <i class="ri-arrow-left-line"></i> Back to Journal
          </button>

          <div class="mb-12">
            <div class="flex items-center gap-3 mb-6">
              <span class="bg-black text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                {{post.category}}
              </span>
              <span class="text-gray-400 text-xs font-medium">{{post.date}}</span>
            </div>
            <h1 class="text-5xl md:text-7xl font-playfair mb-8 leading-tight">{{post.title}}</h1>
            <div class="flex items-center gap-6 pb-8 border-b border-gray-100">
               <div class="flex items-center gap-2">
                 <i class="ri-map-pin-line text-gray-400"></i>
                 <span class="text-sm font-bold">{{post.location}}</span>
               </div>
               <div class="flex items-center gap-1">
                 @for (star of [1,2,3,4,5]; track star) {
                   <i class="ri-star-fill text-xs" [class.text-yellow-400]="star <= post.rating" [class.text-gray-200]="star > post.rating"></i>
                 }
                 <span class="ml-2 text-xs font-bold">{{post.rating}}</span>
               </div>
            </div>
          </div>

          <div class="aspect-video bg-gray-100 rounded-[2.5rem] mb-12 flex items-center justify-center overflow-hidden">
             <i class="ri-image-line text-9xl text-gray-200"></i>
          </div>

          <div class="prose prose-lg max-w-none">
            <p class="text-xl text-gray-600 leading-relaxed mb-8 font-medium italic">
              {{post.description}}
            </p>
            <div class="text-gray-500 leading-relaxed space-y-6">
               <p>
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
               </p>
               <p>
                 Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
               </p>
            </div>
          </div>

          <div class="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
            <div class="flex gap-6">
              <button class="flex items-center gap-2 text-sm font-bold" [class.text-red-500]="post.liked" [class.text-gray-400]="!post.liked" (click)="likePost()">
                <i [class]="post.liked ? 'ri-heart-fill' : 'ri-heart-line'" class="text-xl"></i> {{post.likes}} Likes
              </button>
              <button class="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black" (click)="sharePost()">
                <i class="ri-share-line text-xl"></i> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ArticleDetailsComponent implements OnInit {
  post: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchPost(id);
    }
  }

  fetchPost(id: string) {
    // Attempt to fetch from API
    this.http.get<any>('http://localhost:8000/api/cafes/' + id).subscribe({
      next: (item) => {
        this.post = {
          id: item.id,
          title: item.title || item.name,
          category: (item.tags && item.tags.length ? item.tags[0] : (item.type || 'Coffee')),
          location: item.location,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
          rating: item.rating,
          likes: item.likes || 0,
          liked: false,
          description: item.review
        };
      },
      error: () => {
        // Fallback or handle error
        console.error('Post not found');
      }
    });
  }

  likePost() {
    this.post.liked = !this.post.liked;
    this.post.likes += this.post.liked ? 1 : -1;
  }

  sharePost() {
    if (navigator.share) {
      navigator.share({
        title: this.post.title,
        text: this.post.description,
        url: window.location.href
      });
    }
  }
}
