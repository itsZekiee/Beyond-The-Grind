import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-6xl md:text-7xl font-playfair mb-6 tracking-tighter text-gray-900 leading-[1.1]">Beyond The Grind</h1>
        <p class="text-lg md:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed mb-10 font-medium">
          A digital journal for the modern explorer. Document your coffee adventures, discover hidden gems, and map your culinary journeys.
        </p>

        <!-- Visitor Counter -->
        <div class="inline-flex items-center gap-4 px-6 py-3 bg-white border border-gray-100 rounded-full shadow-sm animate-in slide-in-from-top-4 duration-1000 delay-500">
           <div class="flex -space-x-2">
             <div class="w-8 h-8 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
               <i class="ri-user-line"></i>
             </div>
             <div class="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
               <i class="ri-pulse-line"></i>
             </div>
           </div>
           <div class="text-left">
             <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none mb-1">Total Visitors</span>
             <span class="text-sm font-bold text-gray-900">{{visitorCount.toLocaleString()}}</span>
           </div>
        </div>
      </div>
    </section>

    <!-- Visual Highlights -->
    <section class="pb-20 px-4">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div class="aspect-video bg-gray-100 flex items-end p-6 relative overflow-hidden group cursor-pointer rounded-2xl" routerLink="/journal">
              <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Cozy Cafes">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span class="relative z-10 text-white font-bold text-xl tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Cozy Cafes</span>
           </div>
           <div class="aspect-video bg-gray-100 flex items-end p-6 relative overflow-hidden group cursor-pointer rounded-2xl" routerLink="/journal">
              <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Perfect Brews">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span class="relative z-10 text-white font-bold text-xl tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Perfect Brews</span>
           </div>
           <div class="aspect-video bg-gray-100 flex items-end p-6 relative overflow-hidden group cursor-pointer rounded-2xl" routerLink="/journal">
              <img src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=800" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Epic Journeys">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span class="relative z-10 text-white font-bold text-xl tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Epic Journeys</span>
           </div>
        </div>
      </div>
    </section>

    <!-- Recent Adventures -->
    <section class="py-20 bg-gray-50/50">
      <div class="container mx-auto px-4">
        <div class="flex items-end justify-between mb-12">
          <div>
            <h2 class="text-4xl font-playfair mb-2">Recent Adventures</h2>
            <p class="text-gray-500 font-medium text-sm">Documenting the journey, one cup at a time</p>
          </div>
          <button class="text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all" routerLink="/journal">View All</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (post of posts; track post.id) {
            <div class="bg-white overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl border border-gray-100 cursor-pointer" [routerLink]="['/article', post.id]">
            <div class="relative h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img *ngIf="post.image" [src]="post.image" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" [alt]="post.title">
                <i *ngIf="!post.image" class="ri-image-line text-5xl text-gray-200 group-hover:scale-110 transition-transform duration-700"></i>
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 rounded-full shadow-sm">
                  {{post.category}}
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-lg font-bold mb-2 text-gray-900 leading-tight group-hover:text-black transition-colors">{{post.title}}</h3>
                <div class="flex items-center gap-3 text-[11px] text-gray-400 mb-4 font-medium">
                  <span class="flex items-center gap-1"><i class="ri-map-pin-line"></i> {{post.location}}</span>
                  <span class="flex items-center gap-1"><i class="ri-calendar-line"></i> {{post.date}}</span>
                </div>
                <div class="flex items-center gap-1 mb-4">
                   @for (star of [1,2,3,4,5]; track star) {
                     <i class="ri-star-fill text-[10px]" [class.text-yellow-400]="star <= post.rating" [class.text-gray-200]="star > post.rating"></i>
                   }
                   <span class="ml-2 text-[10px] font-bold text-gray-900">{{post.rating}}</span>
                </div>
                <p class="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {{post.description}}
                </p>
                <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div class="flex gap-4">
                    <button class="flex items-center gap-1.5 text-[10px] font-bold transition-colors" [class.text-red-500]="post.liked" [class.text-gray-400]="!post.liked" (click)="$event.stopPropagation(); likePost(post)">
                      <i [class]="post.liked ? 'ri-heart-fill' : 'ri-heart-line'"></i> {{post.likes || 0}} Like{{post.likes !== 1 ? 's' : ''}}
                    </button>
                    <button class="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-black transition-colors" (click)="$event.stopPropagation(); sharePost(post)">
                      <i class="ri-share-line"></i> Share
                    </button>
                  </div>
                  <button class="text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4" [routerLink]="['/article', post.id]">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="bg-black rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div class="absolute -bottom-10 -right-10 opacity-10 rotate-12">
             <i class="ri-cup-line text-[15rem]"></i>
          </div>
          <div class="relative z-10">
            <h2 class="text-3xl md:text-5xl font-playfair mb-6">Join the Exploration</h2>
            <p class="text-lg text-gray-400 max-w-xl mx-auto mb-10">
              Subscribe to our newsletter and get the latest coffee guides and travel stories delivered directly to your inbox.
            </p>
            <div class="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" class="flex-grow bg-white/10 border border-white/20 rounded-full px-6 py-3 focus:outline-none focus:border-white transition-all text-sm">
              <button class="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all text-sm">Join Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  visitorCount = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
    this.updateVisitorCount();
  }

  private updateVisitorCount() {
    this.http.get<{count: number}>('/api/visitors').subscribe({
      next: (res) => this.visitorCount = res.count,
      error: () => {
        // Fallback only if backend fails
        this.visitorCount = parseInt(localStorage.getItem('btg_visitors') || '1240');
      }
    });
  }

  private fetchPosts() {
    // Fetch top 3 most popular articles
    this.http.get<any[]>('/api/cafes?sort=popular').subscribe({
      next: (data) => {
        if (data && data.length) {
          // Take top 3
          this.posts = data
            .slice(0, 3)
            .map(item => ({
            id: item.id,
            title: item.title || item.name,
            category: (item.tags && item.tags.length ? item.tags[0] : (item.type || 'Coffee')),
            location: item.location,
            date: item.created_at ? new Date(item.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
            rating: item.rating,
            likes: item.likes || 0,
            views: item.views || 0,
            liked: false,
            description: item.review,
            image: item.image_path
          }));
        } else {
          this.posts = this.mockPosts();
        }
      },
      error: () => this.posts = this.mockPosts()
    });
  }

  private recordView(id: number) {
    this.http.post(`/api/cafes/${id}/view`, {}).subscribe();
  }

  private mockPosts() {
    return [
    {
      title: 'Hidden Gem in Portland',
      category: 'Coffee',
      location: 'Portland, OR',
      date: 'Jan 28, 2026',
      rating: 4.5,
      likes: 124,
      liked: false,
      description: 'Discovered an incredible third-wave coffee shop tucked away in the Pearl District. Their single-origin Ethiopian pour-over was absolutely divine.'
    },
    {
      title: 'Coastal Highway Adventure',
      category: 'Travel',
      location: 'Highway 1, CA',
      date: 'Jan 25, 2026',
      rating: 5,
      likes: 89,
      liked: false,
      description: 'Epic road trip along the Pacific Coast Highway. Stopped at every scenic viewpoint and found amazing local roasters along the way.'
    },
    {
      title: 'Artisan Bakery & Brew',
      category: 'Food & Coffee',
      location: 'Seattle, WA',
      date: 'Jan 22, 2026',
      rating: 4.8,
      likes: 56,
      liked: false,
      description: 'Perfect pairing of fresh croissants and a velvety cappuccino. The barista art was next level.'
    }
    ];
  }

  likePost(post: any) {
    post.liked = !post.liked;
    if (post.liked) {
      post.likes = (post.likes || 0) + 1;
    } else {
      post.likes = Math.max(0, (post.likes || 0) - 1);
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
