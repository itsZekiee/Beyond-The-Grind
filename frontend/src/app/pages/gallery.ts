import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

        <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          @for (item of filteredGallery; track item.id) {
             <div class="relative mb-4 break-inside-avoid overflow-hidden group cursor-pointer rounded-xl bg-gray-100 shadow-sm" [routerLink]="['/article', item.id]">
               <!-- First image -->
               <img *ngIf="item.images && item.images.length > 0" [src]="item.images[0]" class="w-full h-auto block group-hover:scale-105 transition-transform duration-700">
               <img *ngIf="(!item.images || item.images.length === 0) && item.image_path" [src]="item.image_path" class="w-full h-auto block group-hover:scale-105 transition-transform duration-700">
               <div *ngIf="(!item.images || item.images.length === 0) && !item.image_path" class="w-full aspect-square flex items-center justify-center">
                  <i class="ri-image-line text-4xl text-gray-300"></i>
               </div>
               
               <!-- Hover Overlay -->
               <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center text-white p-6">
                 <h4 class="text-lg font-playfair font-bold text-center mb-1">{{item.name || item.title}}</h4>
                 <div class="flex items-center gap-2 text-xs font-bold text-gray-300 mb-4">
                   <i class="ri-map-pin-line"></i> {{item.location}}
                 </div>
                 <div class="flex items-center gap-4 text-sm font-bold">
                   <span class="flex items-center gap-1"><i class="ri-star-fill text-yellow-400"></i> {{item.rating}}</span>
                 </div>
               </div>
             </div>
          }
          @if (filteredGallery.length === 0) {
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
  galleryItems: any[] = [];
  filteredGallery: any[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchGallery();
    }
  }

  getImageUrl(path: string) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (isPlatformBrowser(this.platformId) && window.location.hostname === 'localhost') {
        return 'http://127.0.0.1:8000' + path;
    }
    return path;
  }

  fetchGallery() {
    const baseUrl = isPlatformBrowser(this.platformId) ? '' : 'http://127.0.0.1:8000';
    this.http.get<any[]>(`${baseUrl}/api/cafes`).subscribe({
      next: (data) => {
        this.galleryItems = (data || []).map(p => ({
          ...p,
          image_path: this.getImageUrl(p.image_path),
          images: (p.images || []).map((img: string) => this.getImageUrl(img))
        })).filter(p => (p.images && p.images.length > 0) || p.image_path);
        this.applyFilters();
      },
      error: (err) => console.error('Failed to fetch gallery', err)
    });
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
    this.applyFilters();
  }

  private applyFilters() {
    if (this.activeCategory === 'All') {
      this.filteredGallery = [...this.galleryItems];
    } else {
      this.filteredGallery = this.galleryItems.filter((p: any) => 
        p.type === this.activeCategory || (p.tags && p.tags.includes(this.activeCategory))
      );
    }
  }
}
