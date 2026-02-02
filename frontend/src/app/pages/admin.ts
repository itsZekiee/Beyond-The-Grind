import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-20 animate-in fade-in duration-700">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h1 class="text-6xl font-playfair mb-4 tracking-tight">Admin Dashboard</h1>
          <p class="text-gray-500 font-medium">Welcome back, habee2004&#64;gmail.com</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div class="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
             <i class="ri-book-open-line text-3xl mb-4 block"></i>
             <h3 class="text-xl font-bold mb-2 text-gray-900">Manage Journal</h3>
             <p class="text-gray-400 text-sm mb-6">Create, edit, or delete your coffee adventure entries.</p>
             <button class="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">Go to Journal</button>
           </div>

           <div class="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
             <i class="ri-map-2-line text-3xl mb-4 block"></i>
             <h3 class="text-xl font-bold mb-2 text-gray-900">Map Pins</h3>
             <p class="text-gray-400 text-sm mb-6">Add or remove coffee shop pins from the interactive map.</p>
             <button class="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">Manage Pins</button>
           </div>

           <div class="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
             <i class="ri-settings-3-line text-3xl mb-4 block"></i>
             <h3 class="text-xl font-bold mb-2 text-gray-900">Site Settings</h3>
             <p class="text-gray-400 text-sm mb-6">Update site information and global configuration.</p>
             <button class="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">Settings</button>
           </div>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent {}
