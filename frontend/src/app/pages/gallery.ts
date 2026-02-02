import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
                    (click)="activeCategory = cat">
              {{cat}}
            </button>
          }
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of [1,2,3,4,5,6,7,8,9]; track item) {
            <div class="aspect-square bg-gray-100 flex items-center justify-center text-gray-300 group cursor-pointer hover:bg-gray-200 transition-colors">
                 <i class="ri-image-line text-8xl"></i>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class GalleryComponent {
  categories = ['All', 'Coffee', 'Ambiance', 'Food', 'Behind the Scenes', 'Lifestyle'];
  activeCategory = 'All';
}
