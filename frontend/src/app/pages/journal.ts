import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="py-20 animate-in fade-in duration-700">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h1 class="text-6xl font-playfair mb-4 tracking-tight">All Journal Entries</h1>
          <p class="text-gray-500 font-medium">Documenting the journey, one cup at a time</p>
        </div>

        <!-- Search + Layout Toggle -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div class="w-full md:w-auto flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <input [(ngModel)]="query" (ngModelChange)="onSearchChange($event)" type="text" placeholder="Search by Journal Title or Cafe/Restaurant Name" class="w-full md:w-96 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-black" />
              <button (click)="search()" class="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800">Search</button>
              <button (click)="clearSearch()" class="px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black">Clear</button>
            </div>

            <!-- Tag Filter Chips -->
            <div class="flex flex-wrap gap-2">
              <button (click)="filterByTag('')" [class.bg-black]="selectedTag===''" [class.text-white]="selectedTag===''" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-200 hover:border-black transition-all">All</button>
              <button *ngFor="let tag of availableTags" (click)="filterByTag(tag)" [class.bg-black]="selectedTag===tag" [class.text-white]="selectedTag===tag" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-200 hover:border-black transition-all">{{tag}}</button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-400">Layout:</span>
            <div class="flex border rounded-lg overflow-hidden shadow-sm">
               <button (click)="setLayout('grid')" class="p-2 border-r" [class.bg-black]="layout==='grid'" [class.text-white]="layout==='grid'" [class.text-gray-400]="layout!=='grid'"><i class="ri-grid-fill"></i></button>
               <button (click)="setLayout('list')" class="p-2 border-r" [class.bg-black]="layout==='list'" [class.text-white]="layout==='list'" [class.text-gray-400]="layout!=='list'"><i class="ri-list-unordered"></i></button>
               <button (click)="setLayout('gallery')" class="p-2" [class.bg-black]="layout==='gallery'" [class.text-white]="layout==='gallery'" [class.text-gray-400]="layout!=='gallery'"><i class="ri-image-line"></i></button>
            </div>
          </div>
        </div>

        <!-- Main Layouts -->
        <div [ngClass]="{
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8': layout==='grid',
              'space-y-6': layout==='list',
              'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4': layout==='gallery'
            }">
          @for (post of filteredPosts; track post.id) {
            <!-- Grid and List Layout Item -->
            <div *ngIf="layout !== 'gallery'"
                [ngClass]="{
                  'bg-white border border-gray-100 overflow-hidden group shadow-sm hover:shadow-md transition-all cursor-pointer': true,
                  'md:col-span-1 lg:col-span-1': layout==='grid'
                }" [routerLink]="['/article', post.id]"
                [style.display]="layout==='list' ? 'flex' : 'block'">
              <div [ngClass]="{
                    'relative h-64 bg-gray-100 flex items-center justify-center overflow-hidden': true,
                    'h-48 w-48 shrink-0': layout==='list'
                  }">
                <img *ngIf="post.image" [src]="post.image" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" [alt]="post.title">
                <i *ngIf="!post.image" class="ri-image-line text-6xl text-gray-300 group-hover:scale-110 transition-transform duration-700"></i>
                <div class="absolute top-4 right-4 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 shadow-sm">
                  {{post.category}}
                </div>
              </div>
              <div class="p-8 flex-grow">
                <h3 class="text-xl font-bold mb-3 text-gray-900 leading-tight group-hover:text-black transition-colors" [ngClass]="{'mb-1': layout==='list'}">{{post.title}}</h3>
                <div class="flex items-center gap-4 text-xs text-gray-400 mb-4 font-medium">
                  <span class="flex items-center gap-1"><i class="ri-map-pin-line"></i> {{post.location}}</span>
                  <span class="flex items-center gap-1"><i class="ri-calendar-line"></i> {{post.date}}</span>
                </div>
                <div class="flex items-center gap-1 mb-4">
                   @for (star of [1,2,3,4,5]; track star) {
                     <i class="ri-star-fill text-sm" [class.text-black]="star <= post.rating" [class.text-gray-200]="star > post.rating"></i>
                   }
                   <span class="ml-2 text-xs font-bold text-gray-900">{{post.rating}}</span>
                </div>
                <p class="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                  {{post.description}}
                </p>
                <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div class="flex gap-4">
                    <button class="flex items-center gap-1.5 text-xs font-bold transition-colors" [class.text-red-500]="post.liked" [class.text-gray-400]="!post.liked" (click)="$event.stopPropagation(); likePost(post)">
                      <i [class]="post.liked ? 'ri-heart-fill' : 'ri-heart-line'"></i> {{post.likes || 0}}
                    </button>
                    <button class="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-black transition-colors" (click)="$event.stopPropagation(); sharePost(post)">
                      <i class="ri-share-line"></i> Share
                    </button>
                  </div>
                  <button class="bg-black text-white px-6 py-2 text-xs font-bold hover:bg-gray-800 transition-colors" [routerLink]="['/article', post.id]">
                    Read More
                  </button>
                </div>
              </div>
            </div>

            <!-- Gallery Layout Item (Instagram-style) -->
            <div *ngIf="layout === 'gallery'"
                 class="relative mb-4 break-inside-avoid overflow-hidden group cursor-pointer rounded-xl bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                 [routerLink]="['/article', post.id]">
              <img *ngIf="post.image" [src]="post.image" class="w-full h-auto block group-hover:scale-105 transition-transform duration-700" [alt]="post.title">
              <div *ngIf="!post.image" class="w-full aspect-square flex items-center justify-center">
                 <i class="ri-image-line text-4xl text-gray-300"></i>
              </div>

              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center text-white p-6">
                <h4 class="text-lg font-playfair font-bold text-center mb-2">{{post.title}}</h4>
                <div class="flex gap-4 text-sm font-bold">
                  <span class="flex items-center gap-1"><i class="ri-heart-fill"></i> {{post.likes}}</span>
                  <span class="flex items-center gap-1"><i class="ri-eye-fill"></i> {{post.views || 0}}</span>
                </div>
                <div class="mt-4 flex flex-wrap justify-center gap-2">
                  <span *ngFor="let tag of post.tags" class="text-[8px] border border-white/40 px-2 py-0.5 rounded-full uppercase tracking-widest">{{tag}}</span>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredPosts.length === 0" class="text-center py-20">
          <i class="ri-search-line text-6xl text-gray-200 mb-4 block"></i>
          <h3 class="text-xl font-bold text-gray-400">No journal entries found</h3>
          <p class="text-gray-400">Try adjusting your search or filters.</p>
        </div>
      </div>
    </div>
  `
})
export class JournalComponent implements OnInit, OnDestroy {
  posts: any[] = [];
  filteredPosts: any[] = [];
  layout: 'grid' | 'list' | 'gallery' = 'grid';
  query = '';
  availableTags: string[] = ['Coffee', 'Travel', 'Food', 'Tourist Spot', 'Mountain'];
  selectedTag = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.fetchPosts();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setLayout(mode: 'grid'|'list'|'gallery') {
    this.layout = mode;
  }

  filterByTag(tag: string) {
    this.selectedTag = tag;
    this.applyFilters();
  }

  onSearchChange(val: string) {
    this.searchSubject.next(val);
  }

  search() {
    this.fetchPosts();
  }

  private applyFilters() {
    let results = [...this.posts];

    if (this.selectedTag) {
      results = results.filter(p =>
        p.category === this.selectedTag || (p.tags && p.tags.includes(this.selectedTag))
      );
    }

    this.filteredPosts = results;
  }

  clearSearch() {
    this.query = '';
    this.selectedTag = '';
    this.fetchPosts();
  }

  fetchPosts() {
    const url = this.query && this.query.trim()
      ? `/api/cafes?all=true&q=${encodeURIComponent(this.query.trim())}`
      : '/api/cafes?all=true';

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.mapPosts(data);
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to fetch cafes from backend:', err);
        this.posts = [];
        this.filteredPosts = [];
      }
    });
  }

  private mapPosts(data: any[]) {
    this.posts = (data || []).map(item => ({
      id: item.id,
      title: item.title || item.name,
      category: (item.tags && item.tags.length ? item.tags[0] : (item.type || 'Coffee')),
      tags: item.tags || [],
      location: item.location,
      date: item.created_at ? new Date(item.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
      rating: item.rating,
      likes: item.likes || 0,
      views: item.views || 0,
      liked: false,
      description: item.review,
      image: item.image_path
    }));
  }

  likePost(post: any) {
    const action = post.liked ? 'unlike' : 'like';
    this.http.post<any>(`/api/cafes/${post.id}/${action}`, {}).subscribe({
      next: (res) => {
        post.liked = !post.liked;
        post.likes = res.likes;
      }
    });
  }

  sharePost(post: any) {
    console.log('Shared post:', post.title);
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      alert('Sharing is not supported on this browser. Link copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  }
}
