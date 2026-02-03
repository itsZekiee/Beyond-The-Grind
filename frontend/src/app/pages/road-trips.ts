import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var L: any;

@Component({
  selector: 'app-road-trips',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-20 animate-in fade-in duration-700">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h1 class="text-6xl font-playfair mb-4 tracking-tight">Road Trip Navigator</h1>
          <p class="text-gray-500 font-medium tracking-wide">Map your adventures and plan your next coffee hop</p>
        </div>

        <div class="flex flex-wrap justify-center gap-4 mb-12">
          @for (cat of ['All Locations', 'Coffee', 'Food', 'Landmarks']; track cat) {
            <button class="px-8 py-2.5 rounded-sm border border-gray-200 hover:border-black transition-all text-sm font-medium flex items-center gap-2"
                    [class.bg-black]="cat === activeCategory"
                    [class.text-white]="cat === activeCategory"
                    [class.border-black]="cat === activeCategory"
                    (click)="setCategory(cat)">
              <i class="text-lg" [class]="getIcon(cat)"></i>
              {{cat}}
            </button>
          }
        </div>

        <div class="bg-white border border-gray-100 overflow-hidden flex flex-col md:flex-row shadow-sm min-h-[600px]">
          <!-- Map: Leaflet Implementation -->
          <div class="flex-grow bg-[#f8f8f8] relative overflow-hidden border-r border-gray-100 min-h-[400px]" id="map">
            <!-- Leaflet map will render here -->
          </div>

          <!-- Sidebar: List -->
          <div class="w-full md:w-[450px] flex flex-col bg-white">
            <div class="p-8 border-b border-gray-50 flex justify-between items-center">
               <h2 class="text-2xl font-playfair font-bold">Locations</h2>
               <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest" *ngIf="userCoords">Within 5km</span>
            </div>
            <div class="flex-grow overflow-y-auto">
               @for (loc of filteredLocations; track loc.name) {
                 <div class="p-8 border-b border-gray-50 hover:bg-gray-50 transition-colors flex justify-between items-center group cursor-pointer" (click)="focusLocation(loc)">
                   <div>
                     <div class="flex items-center gap-3 mb-2">
                        <i class="ri-cup-line text-xl text-gray-400"></i>
                        <h5 class="font-bold text-gray-900">{{loc.name}}</h5>
                     </div>
                     <div class="flex items-center gap-4">
                        <div class="flex items-center gap-1">
                           <i class="ri-star-fill text-yellow-400 text-xs"></i>
                           <span class="text-xs text-gray-900 font-bold">{{loc.rating}}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                           <i class="ri-check-line text-gray-400"></i>
                           <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{{loc.status}}</span>
                        </div>
                        <div class="text-[10px] text-gray-400 font-bold" *ngIf="loc.distance">
                          {{loc.distance.toFixed(1)}}km away
                        </div>
                     </div>
                   </div>
                   <i class="ri-map-pin-line text-gray-300 text-xl group-hover:text-black transition-colors"></i>
                 </div>
               }
               @if (filteredLocations.length === 0) {
                 <div class="p-20 text-center text-gray-400">
                    <i class="ri-map-pin-2-line text-4xl mb-4 block"></i>
                    <p class="text-sm font-medium">No locations found within 5km of your location.</p>
                 </div>
               }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    #map { height: 100%; width: 100%; z-index: 1; }
    ::ng-deep .leaflet-popup-content-wrapper {
      border-radius: 1rem;
      padding: 0;
      overflow: hidden;
    }
    ::ng-deep .leaflet-popup-content {
      margin: 0;
      width: 250px !important;
    }
  `]
})
export class RoadTripsComponent implements AfterViewInit {
  activeCategory = 'All Locations';
  private map: any;
  userCoords: { lat: number, lng: number } | null = null;
  filteredLocations: any[] = [];
  markers: any[] = [];

  locations = [
    { name: 'Blue Bottle Coffee', rating: 4.5, status: 'Visited', lat: 37.7749, lng: -122.4194, category: 'Coffee' },
    { name: 'Tartine Bakery', rating: 4.8, status: 'Visited', lat: 37.7614, lng: -122.4243, category: 'Food' },
    { name: 'Sightglass Coffee', rating: 4.6, status: 'Not visited', lat: 37.7770, lng: -122.4085, category: 'Coffee' },
    { name: 'Ferry Building', rating: 4.7, status: 'Visited', lat: 37.7955, lng: -122.3937, category: 'Landmarks' },
  ];

  ngAfterViewInit() {
    this.initMap();
    this.applyFilters();
  }

  private initMap() {
    this.map = L.map('map').setView([37.7749, -122.4194], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(this.map);

    this.detectUserLocation();
  }

  private detectUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.map.setView([this.userCoords.lat, this.userCoords.lng], 13);

        L.marker([this.userCoords.lat, this.userCoords.lng], {
          icon: L.divIcon({
            html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
            className: 'custom-user-icon'
          })
        }).addTo(this.map).bindPopup('You are here');

        this.applyFilters();
      });
    }
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
    this.applyFilters();
  }

  private applyFilters() {
    // 1. Filter by category
    let filtered = this.locations;
    if (this.activeCategory !== 'All Locations') {
      filtered = filtered.filter(loc => loc.category === this.activeCategory);
    }

    // 2. Filter by Geofence (5km)
    if (this.userCoords) {
      filtered = filtered.filter(loc => {
        const dist = this.getDistance(this.userCoords!.lat, this.userCoords!.lng, loc.lat, loc.lng);
        (loc as any).distance = dist;
        return dist <= 5;
      });
    }

    this.filteredLocations = filtered;
    this.updateMarkers();
  }

  private getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  private updateMarkers() {
    // Clear existing markers
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    // Add new markers
    this.filteredLocations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng], {
        icon: L.divIcon({
          html: `<div class="bg-black text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                  <i class="${this.getIcon(loc.category)}"></i>
                 </div>`,
          className: 'custom-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      }).addTo(this.map);

      marker.bindPopup(this.createPopupContent(loc));
      this.markers.push(marker);
    });
  }

  private createPopupContent(loc: any) {
    return `
      <div class="p-4 font-inter">
        <div class="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          <i class="ri-image-line text-3xl text-gray-300"></i>
        </div>
        <h3 class="font-black uppercase tracking-tight text-sm mb-1">${loc.name}</h3>
        <div class="flex items-center gap-2 mb-2">
          <div class="flex items-center gap-1">
            <i class="ri-star-fill text-yellow-400 text-[10px]"></i>
            <span class="text-[10px] font-bold">${loc.rating}</span>
          </div>
          <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">${loc.status}</span>
        </div>
        <button class="w-full bg-black text-white py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">
          View Details
        </button>
      </div>
    `;
  }

  focusLocation(loc: any) {
    this.map.flyTo([loc.lat, loc.lng], 15);
  }

  getIcon(cat: string) {
    switch (cat) {
      case 'Coffee': return 'ri-cup-line';
      case 'Food': return 'ri-restaurant-line';
      case 'Landmarks': return 'ri-navigation-line';
      default: return 'ri-apps-2-line';
    }
  }
}
