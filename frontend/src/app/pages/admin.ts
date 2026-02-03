import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <!-- Admin Sidebar -->
      <aside class="w-64 bg-black text-white flex flex-col">
        <div class="p-8">
          <div class="flex items-center gap-2 mb-12">
            <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black">
               <i class="ri-cup-line text-base"></i>
            </div>
            <span class="text-sm font-black tracking-tighter uppercase">BTG Admin</span>
          </div>

          <nav class="space-y-2">
            <a (click)="view = 'dashboard'" [class.bg-white]="view === 'dashboard'" [class.text-black]="view === 'dashboard'" class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">
              <i class="ri-dashboard-line text-lg"></i> Dashboard
            </a>
            <a (click)="view = 'journal'" [class.bg-white]="view === 'journal'" [class.text-black]="view === 'journal'" class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">
              <i class="ri-book-open-line text-lg"></i> Journal
            </a>
            <a (click)="view = 'pins'" [class.bg-white]="view === 'pins'" [class.text-black]="view === 'pins'" class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">
              <i class="ri-map-pin-line text-lg"></i> Map Pins
            </a>
            <a (click)="view = 'settings'" [class.bg-white]="view === 'settings'" [class.text-black]="view === 'settings'" class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">
              <i class="ri-settings-3-line text-lg"></i> Site Settings
            </a>
          </nav>
        </div>

        <div class="mt-auto p-8 border-t border-white/10">
           <button (click)="logout()" class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest w-full">
             <i class="ri-logout-box-line text-lg"></i> Logout
           </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow p-12 overflow-y-auto">
        <header class="flex justify-between items-center mb-12">
          <div>
            <h1 class="text-3xl font-playfair font-bold text-gray-900 capitalize">{{view === 'pins' ? 'Map Pins' : (view === 'settings' ? 'Site Settings' : view)}}</h1>
            <p class="text-gray-400 text-sm font-medium">Manage your platform's content and configuration.</p>
          </div>
          <div class="flex items-center gap-4" *ngIf="view === 'dashboard' || view === 'journal' || view === 'pins'">
            <button (click)="view = 'create'" class="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg">
              Create New Entry
            </button>
          </div>
        </header>

        <!-- View: Dashboard -->
        <div *ngIf="view === 'dashboard'" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
               <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Total Posts</span>
               <span class="text-4xl font-playfair font-bold">{{posts.length}}</span>
            </div>
            <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
               <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Total Likes</span>
               <span class="text-4xl font-playfair font-bold">{{totalLikes}}</span>
            </div>
            <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
               <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Active Pins</span>
               <span class="text-4xl font-playfair font-bold">{{posts.length}}</span>
            </div>
            <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
               <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Avg Rating</span>
               <span class="text-4xl font-playfair font-bold">{{avgRating.toFixed(1)}}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
               <div class="p-8 border-b border-gray-50 flex justify-between items-center">
                 <h3 class="font-bold text-gray-900 uppercase text-xs tracking-widest">Recent Journal Entries</h3>
                 <button (click)="view = 'journal'" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">View All</button>
               </div>
               <div class="overflow-x-auto">
                 <table class="w-full text-left">
                   <thead>
                     <tr class="bg-gray-50/50">
                       <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Title</th>
                       <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     @for (post of posts.slice(0, 5); track post.id) {
                       <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                         <td class="px-8 py-4 font-bold text-sm text-gray-900">{{post.title || post.name}}</td>
                         <td class="px-8 py-4">
                           <button (click)="editPost(post)" class="text-gray-400 hover:text-black mr-4 transition-colors"><i class="ri-edit-line"></i></button>
                           <button (click)="deletePost(post.id)" class="text-gray-400 hover:text-red-500 transition-colors"><i class="ri-delete-bin-line"></i></button>
                         </td>
                       </tr>
                     }
                   </tbody>
                 </table>
               </div>
            </div>

            <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
               <div class="p-8 border-b border-gray-50 flex justify-between items-center">
                 <h3 class="font-bold text-gray-900 uppercase text-xs tracking-widest">Active Map Pins</h3>
                 <button (click)="view = 'pins'" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Manage</button>
               </div>
               <div class="p-8">
                  <div class="space-y-4">
                    @for (post of posts.slice(0, 5); track post.id) {
                       <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <div class="flex items-center gap-3">
                             <div class="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                                <i class="ri-map-pin-line"></i>
                             </div>
                             <div>
                                <h4 class="text-sm font-bold text-gray-900">{{post.name}}</h4>
                                <p class="text-[10px] text-gray-400 font-medium">{{post.location}}</p>
                             </div>
                          </div>
                          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ACTIVE</span>
                       </div>
                    }
                  </div>
               </div>
            </div>
          </div>
        </div>

        <!-- View: Pins -->
        <div *ngIf="view === 'pins'" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
             <div class="p-8 border-b border-gray-50">
               <h3 class="font-bold text-gray-900 uppercase text-xs tracking-widest">Location Management</h3>
             </div>
             <table class="w-full text-left">
               <thead>
                 <tr class="bg-gray-50/50">
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Establishment</th>
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Coordinates</th>
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 @for (post of posts; track post.id) {
                   <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                     <td class="px-8 py-4">
                        <div class="font-bold text-sm text-gray-900">{{post.name}}</div>
                        <div class="text-[10px] text-gray-400 font-medium">{{post.location}}</div>
                     </td>
                     <td class="px-8 py-4 text-xs text-gray-500 font-mono">
                        {{post.latitude || '0.00'}}, {{post.longitude || '0.00'}}
                     </td>
                     <td class="px-8 py-4">
                        <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">Visible</span>
                     </td>
                     <td class="px-8 py-4">
                       <button (click)="editPost(post)" class="text-gray-400 hover:text-black mr-4 transition-colors"><i class="ri-edit-line"></i></button>
                       <button (click)="deletePost(post.id)" class="text-gray-400 hover:text-red-500 transition-colors"><i class="ri-delete-bin-line"></i></button>
                     </td>
                   </tr>
                 }
               </tbody>
             </table>
           </div>
        </div>

        <!-- View: Create/Edit -->
        <div *ngIf="view === 'create' || view === 'edit'" class="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold mb-10 text-gray-900">{{view === 'create' ? 'Create New' : 'Edit'}} Content</h3>
            <form (ngSubmit)="save()" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Journal Title</label>
                <input [(ngModel)]="form.title" name="title" type="text" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-black transition-all" placeholder="Enter title..." />
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Establishment Name</label>
                <input [(ngModel)]="form.name" name="name" type="text" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-black transition-all" required placeholder="Cafe or Restaurant name" />
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Type</label>
                <select [(ngModel)]="form.type" name="type" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-black transition-all appearance-none">
                  <option value="Cafe">Cafe</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Landmark">Landmark</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
                <input [(ngModel)]="form.location" name="location" type="text" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-black transition-all" required placeholder="City, State or Address" />
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Latitude</label>
                <input [(ngModel)]="form.latitude" name="latitude" type="number" step="0.000001" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-black transition-all" placeholder="e.g., 37.7749" />
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Longitude</label>
                <input [(ngModel)]="form.longitude" name="longitude" type="number" step="0.000001" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-black transition-all" placeholder="e.g., -122.4194" />
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Rating (0-5)</label>
                <input [(ngModel)]="form.rating" name="rating" type="number" step="0.1" min="0" max="5" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-black transition-all" required />
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Publish</label>
                <div class="flex items-center gap-3">
                  <input [(ngModel)]="form.is_published" name="is_published" type="checkbox" class="w-4 h-4" />
                  <span class="text-xs text-gray-500">Mark as published</span>
                </div>
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tags</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <button type="button" *ngFor="let t of presetTags" (click)="toggleTag(t)" [class.bg-black]="selectedTags.includes(t)" [class.text-white]="selectedTags.includes(t)" class="px-3 py-1 rounded-full border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:border-black">{{t}}</button>
                </div>
                <input [(ngModel)]="tagsInput" name="tags" type="text" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-black transition-all" placeholder="Add custom tags, comma separated" />
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cover Image</label>
                <input type="file" accept="image/*" (change)="onFileChange($event)" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-3.5 text-sm" />
                <p class="text-[10px] text-gray-400">Recommended: JPG/PNG up to 5MB</p>
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Review Content</label>
                <textarea [(ngModel)]="form.review" name="review" rows="6" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black transition-all resize-none" required placeholder="Share your experience..."></textarea>
              </div>
              <div class="md:col-span-2 flex items-center gap-4">
                 <button type="submit" class="bg-black text-white px-10 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg">
                   {{view === 'create' ? 'Create Entry' : 'Update Entry'}}
                 </button>
                 <button type="button" (click)="view = 'dashboard'" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black px-6 py-3.5">Cancel</button>
                 <span *ngIf="message" class="ml-auto text-xs font-bold" [class.text-green-600]="message.includes('success')" [class.text-red-600]="message.includes('failed')">{{message}}</span>
              </div>
            </form>
          </div>
        </div>

        <!-- View: Settings -->
        <div *ngIf="view === 'settings'" class="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold mb-10 text-gray-900">Site Configuration</h3>
            <div class="space-y-8">
               <div class="space-y-2">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Site Name</label>
                  <input type="text" value="Beyond The Grind" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-black transition-all">
               </div>
               <div class="space-y-2">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Admin Email</label>
                  <input type="email" value="habee2004@gmail.com" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-black transition-all">
               </div>
               <div class="pt-4">
                  <button class="bg-black text-white px-10 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg">Save Configuration</button>
               </div>
            </div>
          </div>
        </div>

        <!-- View: Journal (Full List) -->
        <div *ngIf="view === 'journal'" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <!-- Post list (same as dashboard but bigger or with more info) -->
           <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
             <table class="w-full text-left">
               <thead>
                 <tr class="bg-gray-50/50">
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Title</th>
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Location</th>
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 @for (post of posts; track post.id) {
                   <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                     <td class="px-8 py-4 font-bold text-sm text-gray-900">{{post.title || post.name}}</td>
                     <td class="px-8 py-4"><span class="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest">{{post.type || 'Coffee'}}</span></td>
                     <td class="px-8 py-4 text-sm text-gray-500">{{post.location}}</td>
                     <td class="px-8 py-4 text-xs text-gray-400 font-medium">{{post.created_at | date}}</td>
                     <td class="px-8 py-4">
                       <button (click)="editPost(post)" class="text-gray-400 hover:text-black mr-4 transition-colors"><i class="ri-edit-line"></i></button>
                       <button (click)="deletePost(post.id)" class="text-gray-400 hover:text-red-500 transition-colors"><i class="ri-delete-bin-line"></i></button>
                     </td>
                   </tr>
                 }
               </tbody>
             </table>
           </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AdminComponent implements OnInit {
  view: 'dashboard' | 'journal' | 'pins' | 'settings' | 'create' | 'edit' = 'dashboard';
  posts: any[] = [];
  form: any = { title: '', name: '', type: 'Cafe', location: '', rating: 0, review: '', is_published: true, latitude: null, longitude: null };
  tagsInput = '';
  presetTags: string[] = ['Coffee', 'Travel', 'Food', 'Tourist Spot', 'Mountain'];
  selectedTags: string[] = [];
  imageFile: File | null = null;
  message = '';
  totalLikes = 0;
  avgRating = 0;

  constructor(private router: Router, private http: HttpClient) {}

  toggleTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags = [...this.selectedTags, tag];
    }
  }

  onFileChange(evt: any) {
    const file = evt?.target?.files?.[0];
    this.imageFile = file || null;
  }

  ngOnInit() {
    const ok = localStorage.getItem('btg_admin') === '1';
    if (!ok) {
      this.router.navigate(['/admin-login']);
    } else {
      this.fetchPosts();
    }
  }

  fetchPosts() {
    this.http.get<any[]>('http://localhost:8000/api/cafes?all=true').subscribe({
      next: (data) => {
        this.posts = data;
        this.totalLikes = data.reduce((acc, p) => acc + (p.likes || 0), 0);
        this.avgRating = data.length ? data.reduce((acc, p) => acc + (p.rating || 0), 0) / data.length : 0;
      }
    });
  }

  save() {
    // Merge preset selected tags with custom input
    const customTags = this.tagsInput.split(',').map(t => t.trim()).filter(t => !!t);
    const allTags = Array.from(new Set([...(this.selectedTags || []), ...customTags]));

    if (this.view === 'create') {
      const fd = new FormData();
      fd.append('title', this.form.title || '');
      fd.append('name', this.form.name || '');
      fd.append('type', this.form.type || 'Cafe');
      fd.append('location', this.form.location || '');
      fd.append('rating', String(this.form.rating ?? 0));
      fd.append('review', this.form.review || '');
      if (this.form.latitude !== null && this.form.latitude !== undefined) fd.append('latitude', String(this.form.latitude));
      if (this.form.longitude !== null && this.form.longitude !== undefined) fd.append('longitude', String(this.form.longitude));
      fd.append('is_published', this.form.is_published ? '1' : '0');
      allTags.forEach(t => fd.append('tags[]', t));
      if (this.imageFile) {
        fd.append('image', this.imageFile);
      }
      this.http.post('http://localhost:8000/api/cafes', fd).subscribe({
        next: () => {
          this.message = 'Content created successfully';
          setTimeout(() => {
            this.message = '';
            this.view = 'dashboard';
            this.fetchPosts();
          }, 1500);
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.message = 'Operation failed';
        }
      });
    } else {
      const data = {
        ...this.form,
        tags: allTags
      };
      this.http.put(`http://localhost:8000/api/cafes/${this.form.id}`, data).subscribe({
        next: () => {
          this.message = 'Content updated successfully';
          setTimeout(() => {
            this.message = '';
            this.view = 'dashboard';
            this.fetchPosts();
          }, 1500);
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.message = 'Operation failed';
        }
      });
    }
  }

  editPost(post: any) {
    this.form = { ...post };
    this.selectedTags = Array.isArray(post.tags) ? post.tags : [];
    this.tagsInput = '';
    this.imageFile = null;
    this.view = 'edit';
  }

  deletePost(id: number) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.http.delete(`http://localhost:8000/api/cafes/${id}`).subscribe({
        next: () => this.fetchPosts()
      });
    }
  }

  resetForm() {
    this.form = { title: '', name: '', type: 'Cafe', location: '', rating: 0, review: '', is_published: true, latitude: null, longitude: null };
    this.tagsInput = '';
    this.selectedTags = [];
    this.imageFile = null;
  }

  logout() {
    localStorage.removeItem('btg_admin');
    this.router.navigate(['/admin-login']);
  }
}
