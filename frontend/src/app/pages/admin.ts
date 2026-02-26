import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
            <a (click)="view = 'dashboard'" [class.bg-white]="view === 'dashboard' || view === 'create' || view === 'edit'" [class.text-black]="view === 'dashboard' || view === 'create' || view === 'edit'" class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">
              <i class="ri-dashboard-line text-lg"></i> Dashboard
            </a>
            <div class="pt-4 pb-2 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Management</div>
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
               <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Total Views</span>
               <span class="text-4xl font-playfair font-bold">{{totalViews}}</span>
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
            <h3 class="font-bold text-gray-900 uppercase text-xs tracking-widest">Manage Journal (Published)</h3>
            <button (click)="view = 'journal'" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">View All</button>
          </div>
          <div class="px-8 pt-4">
            <p class="text-xs text-gray-400">View and manage your published coffee adventure entries.</p>
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
                     @for (post of publishedPosts.slice(0, 5); track post.id) {
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
              <h3 class="font-bold text-gray-900 uppercase text-xs tracking-widest">Manage Pins (Locations)</h3>
              <button (click)="view = 'pins'" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Manage</button>
            </div>
            <div class="px-8 pt-4">
              <p class="text-xs text-gray-400">Location pins for the interactive map.</p>
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
                          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{post.latitude ? 'ACTIVE' : 'NO COORDS'}}</span>
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
        <div *ngIf="view === 'create' || view === 'edit'" class="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
              <div>
                <h3 class="text-2xl font-bold text-gray-900">{{view === 'create' ? 'Create New' : 'Edit'}} Entry</h3>
                <p class="text-gray-400 text-xs font-medium mt-1">Fill in the information below to {{view === 'create' ? 'publish a new adventure' : 'update your entry' }}.</p>
              </div>
              <button (click)="view = 'dashboard'" class="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                <i class="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form (ngSubmit)="save()" class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <!-- Left Column -->
                <div class="space-y-6">
                  <div class="space-y-2">
                    <label class="block text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Journal Title</label>
                    <input [(ngModel)]="form.title" name="title" type="text" class="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all outline-none" placeholder="Enter a compelling title..." />
                  </div>

                  <div class="space-y-2">
                    <label class="block text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Establishment Name</label>
                    <input [(ngModel)]="form.name" name="name" type="text" class="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all outline-none" required placeholder="Cafe or Restaurant name" />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="block text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Type</label>
                      <div class="relative">
                        <select [(ngModel)]="form.type" name="type" class="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all appearance-none outline-none">
                          <option value="Cafe">Cafe</option>
                          <option value="Restaurant">Restaurant</option>
                          <option value="Landmark">Landmark</option>
                        </select>
                        <i class="ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label class="block text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Rating (0.0 - 5.0)</label>
                      <input [(ngModel)]="form.rating" name="rating" type="number" step="0.1" min="0" max="5" class="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all outline-none" required />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Location Details</label>
                    <input [(ngModel)]="form.location" name="location" type="text" class="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all outline-none" required placeholder="City, State or Full Address" />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="block text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Latitude</label>
                      <input [(ngModel)]="form.latitude" name="latitude" type="number" step="0.000001" class="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all outline-none" placeholder="e.g., 37.7749" />
                    </div>
                    <div class="space-y-2">
                      <label class="block text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Longitude</label>
                      <input [(ngModel)]="form.longitude" name="longitude" type="number" step="0.000001" class="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all outline-none" placeholder="e.g., -122.4194" />
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-6">
                  <div class="space-y-2">
                    <label class="block text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Cover Image</label>
                    <div class="border-2 border-dashed border-gray-100 rounded-2xl p-6 text-center hover:border-black/10 transition-colors bg-gray-50/50">
                      <input type="file" accept="image/*" (change)="onFileChange($event)" id="file-upload" class="hidden" />
                      <label for="file-upload" class="cursor-pointer">
                        <i class="ri-image-add-line text-3xl text-gray-300 block mb-2"></i>
                        <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">{{imageFile ? imageFile.name : 'Select or drop image'}}</span>
                        <p class="text-[10px] text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                      </label>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Categorization (Tags)</label>
                    <div class="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <button type="button" *ngFor="let t of presetTags" (click)="toggleTag(t)" [class.bg-black]="selectedTags.includes(t)" [class.text-white]="selectedTags.includes(t)" [class.border-black]="selectedTags.includes(t)" class="px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:border-black transition-all">{{t}}</button>
                    </div>
                    <input [(ngModel)]="tagsInput" name="tags" type="text" class="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all outline-none mt-2" placeholder="Custom tags (comma separated)..." />
                  </div>

                  <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative w-10 h-6">
                        <input [(ngModel)]="form.is_published" name="is_published" type="checkbox" class="sr-only peer" />
                        <div class="w-full h-full bg-gray-200 rounded-full peer-checked:bg-black transition-colors"></div>
                        <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                      </div>
                      <div>
                        <span class="block text-xs font-bold uppercase tracking-widest text-gray-900">Visibility</span>
                        <span class="text-[10px] text-gray-400">Published content is visible to all users.</span>
                      </div>
                    </label>
                  </div>

                  <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative w-10 h-6">
                        <input [(ngModel)]="form.is_featured" name="is_featured" type="checkbox" class="sr-only peer" />
                        <div class="w-full h-full bg-gray-200 rounded-full peer-checked:bg-yellow-400 transition-colors"></div>
                        <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                      </div>
                      <div>
                        <span class="block text-xs font-bold uppercase tracking-widest text-gray-900">Featured</span>
                        <span class="text-[10px] text-gray-400">Display this article prominently on the home page.</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Review Content</label>
                <textarea [(ngModel)]="form.review" name="review" rows="6" class="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all outline-none resize-none" required placeholder="Describe the atmosphere, the coffee, and your overall experience..."></textarea>
              </div>

              <div class="flex items-center justify-between pt-6 border-t border-gray-50">
                <div class="flex items-center gap-4">
                  <button type="submit" class="bg-black text-white px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50">
                    {{view === 'create' ? 'Publish Entry' : 'Update Entry'}}
                  </button>
                  <button type="button" (click)="saveDraft()" class="bg-gray-100 text-gray-900 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                    Save Draft
                  </button>
                  <button type="button" (click)="loadDraft()" class="bg-gray-100 text-gray-900 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                    Load Draft
                  </button>
                  <button type="button" (click)="view = 'dashboard'" class="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black px-6 py-4 transition-colors">Cancel</button>
                </div>
                <div *ngIf="message" class="flex items-center gap-2 px-4 py-2 rounded-lg" [class.bg-green-50]="message.includes('success')" [class.bg-red-50]="message.includes('failed')">
                  <i [class]="message.includes('success') ? 'ri-checkbox-circle-line text-green-600' : 'ri-error-warning-line text-red-600'"></i>
                  <span class="text-xs font-bold uppercase tracking-widest" [class.text-green-600]="message.includes('success')" [class.text-red-600]="message.includes('failed')">{{message}}</span>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- View: Settings -->
        <div *ngIf="view === 'settings'" class="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 class="text-xl font-bold mb-2 text-gray-900">Site Configuration</h3>
              <p class="text-xs text-gray-400 mb-10">Update site information and global configuration.</p>
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

            <div class="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
               <h3 class="text-xl font-bold mb-2 text-gray-900">Featured Content</h3>
               <p class="text-xs text-gray-400 mb-10">Manage which articles are featured across the site.</p>
               <div class="space-y-4">
                 @for (post of posts; track post.id) {
                   @if (post.is_featured) {
                     <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div class="flex items-center gap-3">
                           <i class="ri-star-fill text-yellow-400"></i>
                           <span class="text-xs font-bold text-gray-900 truncate max-w-[150px]">{{post.title || post.name}}</span>
                        </div>
                        <button (click)="toggleFeatured(post)" class="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700">Remove</button>
                     </div>
                   }
                 }
                 @if (!hasFeatured()) {
                   <div class="text-center py-8">
                      <i class="ri-star-line text-4xl text-gray-200 block mb-2"></i>
                      <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">No featured articles</p>
                   </div>
                 }
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
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Stats</th>
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                   <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 @for (post of posts; track post.id) {
                   <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                     <td class="px-8 py-4 font-bold text-sm text-gray-900">{{post.title || post.name}}</td>
                     <td class="px-8 py-4"><span class="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest">{{post.type || 'Coffee'}}</span></td>
                     <td class="px-8 py-4">
                       <div class="flex gap-4">
                         <span class="text-[10px] font-bold text-gray-400"><i class="ri-eye-line mr-1"></i>{{post.views || 0}}</span>
                         <span class="text-[10px] font-bold text-gray-400"><i class="ri-heart-line mr-1"></i>{{post.likes || 0}}</span>
                       </div>
                     </td>
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
  publishedPosts: any[] = [];
  form: any = { title: '', name: '', type: 'Cafe', location: '', rating: 0, review: '', is_published: true, is_featured: false, latitude: null, longitude: null };
  tagsInput = '';
  presetTags: string[] = ['Coffee', 'Travel', 'Food', 'Tourist Spot', 'Mountain'];
  selectedTags: string[] = [];
  imageFile: File | null = null;
  message = '';
  totalLikes = 0;
  totalViews = 0;
  avgRating = 0;

  constructor(private router: Router, private http: HttpClient) {}

  hasFeatured() {
    return this.posts.some(p => p.is_featured);
  }

  toggleFeatured(post: any) {
    const newVal = !post.is_featured;
    this.http.put(`/api/cafes/${post.id}`, {
      ...post,
      is_featured: newVal
    }).subscribe({
      next: () => this.fetchPosts()
    });
  }

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

  private fetchPosts() {
    this.http.get<any[]>('/api/cafes?all=true').subscribe({
      next: (data) => {
        this.posts = (data || []).map(p => ({
          ...p,
          image: p.image_path // Unified image property name for consistency if needed, though admin uses p.image_path mostly
        }));
        this.publishedPosts = this.posts.filter(p => p.is_published);
        this.totalLikes = this.posts.reduce((acc, p) => acc + (p.likes || 0), 0);
        this.totalViews = this.posts.reduce((acc, p) => acc + (p.views || 0), 0);
        this.avgRating = this.posts.length ? this.posts.reduce((acc, p) => acc + (p.rating || 0), 0) / this.posts.length : 0;
      }
    });
  }

  save() {
    const customTags = this.tagsInput.split(',').map(t => t.trim()).filter(t => !!t);
    const allTags = Array.from(new Set([...(this.selectedTags || []), ...customTags]));

    const fd = new FormData();
    fd.append('title', this.form.title || '');
    fd.append('name', this.form.name || '');
    fd.append('type', this.form.type || 'Cafe');
    fd.append('location', this.form.location || '');
    fd.append('rating', String(this.form.rating ?? 0));
    fd.append('review', this.form.review || '');

    if (this.form.latitude !== null && this.form.latitude !== undefined) {
      fd.append('latitude', String(this.form.latitude));
    }
    if (this.form.longitude !== null && this.form.longitude !== undefined) {
      fd.append('longitude', String(this.form.longitude));
    }

    fd.append('is_published', this.form.is_published ? '1' : '0');
    fd.append('is_featured', this.form.is_featured ? '1' : '0');

    // PHP expects tags[] for arrays in FormData
    allTags.forEach((t) => fd.append('tags[]', t));

    if (this.imageFile) {
      fd.append('image', this.imageFile);
    }

    if (this.view === 'create') {
      this.http.post('/api/cafes', fd).subscribe({
        next: () => this.handleSuccess('Content created successfully'),
        error: (err) => this.handleError(err)
      });
    } else {
      // Laravel PUT doesn't handle FormData well, so we spoof it with POST + _method=PUT
      fd.append('_method', 'PUT');
      this.http.post(`/api/cafes/${this.form.id}`, fd).subscribe({
        next: () => this.handleSuccess('Content updated successfully'),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleSuccess(msg: string) {
    this.message = msg;
    localStorage.removeItem('btg_draft');
    setTimeout(() => {
      this.message = '';
      this.view = 'dashboard';
      this.fetchPosts();
    }, 1500);
    this.resetForm();
  }

  private handleError(err: any) {
    console.error('Operation Error:', err);
    if (err.status === 404) {
      this.message = `404 Error: The endpoint "${err.url}" was not found. If using "npm start", ensure the proxy is active.`;
    } else if (err.status === 0) {
      this.message = 'Network error: Ensure backend is running and you used "npm start"';
    } else if (err.error && err.error.errors) {
      const messages = Object.values(err.error.errors).flat().join(', ');
      this.message = 'Validation failed: ' + messages;
    } else {
      this.message = 'Operation failed: ' + (err.error?.message || err.message || 'Unknown error');
    }
  }

  editPost(post: any) {
    this.form = { ...post, is_published: !!post.is_published, is_featured: !!post.is_featured };
    this.selectedTags = Array.isArray(post.tags) ? post.tags : [];
    this.tagsInput = '';
    this.imageFile = null;
    this.view = 'edit';
  }

  deletePost(id: number) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.http.delete(`/api/cafes/${id}`).subscribe({
        next: () => this.fetchPosts()
      });
    }
  }

  resetForm() {
    this.form = { title: '', name: '', type: 'Cafe', location: '', rating: 0, review: '', is_published: true, is_featured: false, latitude: null, longitude: null };
    this.tagsInput = '';
    this.selectedTags = [];
    this.imageFile = null;
  }

  logout() {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('btg_admin');
      localStorage.removeItem('btg_draft');
      this.router.navigate(['/admin-login']);
    }
  }

  saveDraft() {
    const draftData = {
      form: this.form,
      selectedTags: this.selectedTags,
      tagsInput: this.tagsInput
    };
    localStorage.setItem('btg_draft', JSON.stringify(draftData));
    this.message = 'Draft saved locally';
    setTimeout(() => this.message = '', 2000);
  }

  loadDraft() {
    const saved = localStorage.getItem('btg_draft');
    if (saved) {
      const data = JSON.parse(saved);
      this.form = { ...data.form };
      this.selectedTags = [...(data.selectedTags || [])];
      this.tagsInput = data.tagsInput || '';
      this.message = 'Draft restored';
      setTimeout(() => this.message = '', 2000);
    } else {
      alert('No draft found');
    }
  }
}
