import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-20 animate-in fade-in duration-700">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center mb-12">
          <h1 class="text-6xl font-playfair mb-4 tracking-tight">Photo Journal</h1>
          <p class="text-gray-500 font-medium tracking-wide">Capturing the essence of every cafe adventure</p>
        </div>

        <div class="flex flex-wrap justify-center gap-4 mb-16">
          @for (cat of categories; track cat) {
            <button class="px-8 py-2.5 rounded-sm border border-gray-200 hover:border-black transition-all text-sm font-medium"
                    [class.bg-black]="cat === activeCategory"
                    [class.text-white]="cat === activeCategory"
                    [class.border-black]="cat === activeCategory"
                    (click)="setCategory(cat)">
              {{cat}}
            </button>
          }
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (post of filteredPosts; track post.id) {
            <div class="aspect-square bg-gray-100 relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 rounded-xl">
                 <img *ngIf="post.image_path" [src]="post.image_path" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" [alt]="post.name">
                 <i *ngIf="!post.image_path" class="ri-image-line text-8xl text-gray-300 absolute inset-0 flex items-center justify-center"></i>
                 
                 <!-- Hover Overlay -->
                 <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center text-white p-6">
                    <h3 class="text-2xl font-playfair font-bold text-center mb-2">{{post.name || post.title}}</h3>
                    <div class="flex items-center gap-2 text-sm font-medium mb-3">
                      <i class="ri-map-pin-line text-gray-300"></i> {{post.location}}
                    </div>
                    <div class="flex items-center gap-1">
                      @for (star of [1,2,3,4,5]; track star) {
                         <i class="ri-star-fill text-xs" [class.text-yellow-400]="star <= post.rating" [class.text-gray-500]="star > post.rating"></i>
                      }
                      <span class="ml-2 text-xs font-bold">{{post.rating}}</span>
                    </div>
                 </div>
            </div>
          }
          @if (filteredPosts.length === 0) {
            <div class="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-gray-400">
               <i class="ri-image-line text-6xl mb-4 block opacity-50"></i>
               <p class="text-sm font-medium">No images found in this category.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class GalleryComponent implements OnInit {
  categories = ['All', 'Coffee', 'Restaurant', 'Landmark'];
  activeCategory = 'All';
  posts: any[] = [];
  filteredPosts: any[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<any[]>('/api/cafes').subscribe({
        next: (data) => {
          // Filter to only posts that have an image
          this.posts = data.filter(p => p.image_path);
          this.applyFilters();
        },
        error: (err) => console.error('Failed to fetch gallery images', err)
      });
    }
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
    this.applyFilters();
  }

  private applyFilters() {
    if (this.activeCategory === 'All') {
      this.filteredPosts = [...this.posts];
    } else {
      this.filteredPosts = this.posts.filter(p => 
        p.type === this.activeCategory || (p.tags && p.tags.includes(this.activeCategory))
      );
    }
  }
}
