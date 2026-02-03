import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
          <div class="w-full md:w-auto flex items-center gap-2">
            <input [(ngModel)]="query" (keyup.enter)="search()" type="text" placeholder="Search by Journal Title or Cafe/Restaurant Name" class="w-full md:w-96 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-black" />
            <button (click)="search()" class="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800">Search</button>
            <button (click)="clearSearch()" class="px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black">Clear</button>
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

        <div [ngClass]="{
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8': layout==='grid' || layout==='gallery',
              'space-y-6': layout==='list'
            }">
          @for (post of posts; track post.id) {
            <div [ngClass]="{
                  'bg-white border border-gray-100 overflow-hidden group shadow-sm hover:shadow-md transition-all cursor-pointer': true,
                  'md:col-span-2 lg:col-span-1': layout==='gallery'
                }" [routerLink]="['/article', post.id]">
              <div [ngClass]="{
                    'relative h-64 bg-gray-100 flex items-center justify-center overflow-hidden': true,
                    'h-48': layout==='list'
                  }">
                <i class="ri-image-line text-6xl text-gray-300 group-hover:scale-110 transition-transform duration-700"></i>
                <div class="absolute top-4 right-4 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 shadow-sm">
                  {{post.category}}
                </div>
              </div>
              <div class="p-8" [ngClass]="{'flex items-start gap-6': layout==='list'}">
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
                      <i [class]="post.liked ? 'ri-heart-fill' : 'ri-heart-line'"></i> {{post.likes || 0}} Like{{post.likes !== 1 ? 's' : ''}}
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
          }
        </div>
      </div>
    </div>
  `
})
export class JournalComponent implements OnInit {
  posts: any[] = [];
  layout: 'grid' | 'list' | 'gallery' = 'grid';
  query = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  setLayout(mode: 'grid'|'list'|'gallery') {
    this.layout = mode;
  }

  search() {
    const url = this.query && this.query.trim() ? `http://localhost:8000/api/cafes?q=${encodeURIComponent(this.query.trim())}` : 'http://localhost:8000/api/cafes';
    this.http.get<any[]>(url).subscribe({
      next: (data) => this.mapPosts(data),
      error: () => this.loadMockData()
    });
  }

  clearSearch() {
    this.query = '';
    this.fetchPosts();
  }

  fetchPosts() {
    this.http.get<any[]>('http://localhost:8000/api/cafes').subscribe({
      next: (data) => this.mapPosts(data),
      error: (err) => {
        console.error('Failed to fetch cafes from backend:', err);
        this.loadMockData();
      }
    });
  }

  private mapPosts(data: any[]) {
    if (data && data.length > 0) {
      this.posts = data.map(item => ({
        id: item.id,
        title: item.title || item.name,
        category: (item.tags && item.tags.length ? item.tags[0] : (item.type || 'Coffee')),
        location: item.location,
        date: item.created_at ? new Date(item.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
        rating: item.rating,
        likes: item.likes || 0,
        liked: false,
        description: item.review
      }));
    } else {
      this.loadMockData();
    }
  }

  loadMockData() {
    this.posts = [
      {
        title: 'Hidden Gem in Portland',
        category: 'Coffee',
        location: 'Portland, OR',
        date: '1/28/2026',
        rating: 4.5,
        likes: 42,
        liked: false,
        description: 'Discovered an incredible third-wave coffee shop tucked away in the Pearl District. Their single-origin Ethiopian pour-over was absolutely divine.'
      },
      {
        title: 'Coastal Highway Adventure',
        category: 'Travel',
        location: 'Highway 1, CA',
        date: '1/25/2026',
        rating: 5,
        likes: 128,
        liked: false,
        description: 'Epic road trip along the Pacific Coast Highway. Stopped at every scenic viewpoint and found amazing local roasters along the way.'
      },
      {
        title: 'Artisan Bakery & Brew',
        category: 'Food & Coffee',
        location: 'Seattle, WA',
        date: '1/22/2026',
        rating: 4.8,
        likes: 67,
        liked: false,
        description: 'Perfect pairing of fresh croissants and a velvety cappuccino. The barista art was next level.'
      },
      {
        title: 'Mountain Retreat Cafe',
        category: 'Coffee',
        location: 'Asheville, NC',
        date: '1/20/2026',
        rating: 4.3,
        likes: 34,
        liked: false,
        description: 'Rustic mountain cafe with breathtaking views. Their cold brew was smooth and perfectly balanced.'
      },
      {
        title: 'Urban Food Market',
        category: 'Food',
        location: 'Brooklyn, NY',
        date: '1/18/2026',
        rating: 4.6,
        likes: 91,
        liked: false,
        description: 'Explored a vibrant food market with incredible street food vendors and a specialty coffee cart.'
      },
      {
        title: 'Desert Oasis Roastery',
        category: 'Coffee',
        location: 'Phoenix, AZ',
        date: '1/15/2026',
        rating: 4.7,
        likes: 53,
        liked: false,
        description: 'Unexpected find in the desert! Small-batch roastery with unique bean selections from around the world.'
      },
      {
        title: 'Vintage Coffeehouse Chronicles',
        category: 'Coffee',
        location: 'Austin, TX',
        date: '1/12/2026',
        rating: 4.4,
        likes: 27,
        liked: false,
        description: 'A nostalgic journey through a beautifully preserved 1960s coffeehouse with authentic vintage equipment.'
      },
      {
        title: 'Minimalist Brew Bar',
        category: 'Coffee',
        location: 'Tokyo, Japan',
        date: '1/8/2026',
        rating: 4.9,
        likes: 215,
        liked: false,
        description: 'Japanese precision meets coffee artistry in this serene minimalist space dedicated to the perfect cup.'
      },
    ];
  }

  likePost(post: any) {
    post.liked = !post.liked;
    if (post.liked) {
      post.likes = (post.likes || 0) + 1;
      if (post.id) {
        this.http.post('http://localhost:8000/api/cafes/' + post.id + '/like', {}).subscribe();
      }
    } else {
      post.likes = Math.max(0, (post.likes || 0) - 1);
      if (post.id) {
        this.http.post('http://localhost:8000/api/cafes/' + post.id + '/unlike', {}).subscribe();
      }
    }
    console.log('Liked post:', post.title, 'Status:', post.liked, 'Likes:', post.likes);
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
