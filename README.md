# Beyond The Grind

A modern web application for documenting and discovering coffee adventures, cafes, and culinary journeys. This digital journal platform allows users to explore cozy cafes, perfect brews, and epic food journeys.

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **PHP** | ^8.2 | Server-side language |
| **Laravel** | ^12.0 | PHP web framework |
| **Laravel Sanctum** | ^4.0 | API authentication |
| **Intervention/Image** | * | Image processing and manipulation |
| **MySQL/Database** | - | Data persistence |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | ^21.1.0 | Frontend framework |
| **TypeScript** | ~5.9.2 | Type-safe JavaScript |
| **TailwindCSS** | ^3.4.1 | Utility-first CSS framework |
| **RxJS** | ~7.8.0 | Reactive programming |
| **Angular SSR** | ^21.1.2 | Server-side rendering |
| **Express** | ^5.1.0 | SSR server |
| **Vitest** | ^4.0.8 | Unit testing |

---

## 📋 Core Functionalities

### 1. Cafe Management
- **Browse Cafes**: View a list of published cafes with filtering and sorting options
- **Search**: Search cafes by title, name, or location
- **Featured Listings**: Highlight featured cafes for better visibility
- **Cafe Details**: View detailed information including ratings, reviews, location coordinates, and images
- **CRUD Operations**: Create, read, update, and delete cafe entries (admin)

### 2. User Engagement
- **Like System**: Users can like/unlike cafes to show appreciation
- **View Tracking**: Automatic view count tracking for each cafe
- **Visitor Counter**: Global visitor count displayed on the homepage

### 3. Content Organization
- **Tags**: Organize cafes with customizable tags
- **Publishing Status**: Control visibility with publish/unpublish functionality
- **Sorting Options**: Sort by popularity (views/likes) or latest additions

### 4. Pages & Navigation
| Page | Description |
|------|-------------|
| **Home** | Landing page with visitor counter and featured content |
| **Journal** | Browse all cafe entries and adventures |
| **Road Trips** | Explore travel-related content |
| **Gallery** | Visual showcase of cafe images |
| **Article Details** | Detailed view of individual cafe entries |
| **Admin Login** | Authentication for administrators |
| **Admin Panel** | Manage cafe entries and content |

### 5. Media & Images
- **Image Upload**: Support for cafe images up to 5MB
- **Image Processing**: Server-side image handling with Intervention/Image
- **Responsive Images**: Optimized display across devices

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer
- npm

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:4200` with API proxy to the backend.

---

## 📁 Project Structure

```
Beyond The Grind/
├── backend/                 # Laravel API backend
│   ├── app/
│   │   ├── Http/Controllers/   # API controllers
│   │   └── Models/             # Eloquent models (Cafe, User, Visitor)
│   ├── routes/api.php          # API route definitions
│   ├── database/migrations/    # Database schema
│   └── config/                 # Laravel configuration
│
├── frontend/                # Angular frontend
│   ├── src/app/
│   │   ├── pages/              # Page components
│   │   └── app.routes.ts       # Application routing
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── proxy.conf.json         # API proxy configuration
│
└── README.md               # This file
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cafes` | List all cafes (with filters) |
| GET | `/api/cafes/{id}` | Get single cafe details |
| POST | `/api/cafes` | Create new cafe |
| PUT | `/api/cafes/{id}` | Update cafe |
| DELETE | `/api/cafes/{id}` | Delete cafe |
| POST | `/api/cafes/{id}/like` | Like a cafe |
| POST | `/api/cafes/{id}/unlike` | Unlike a cafe |
| POST | `/api/cafes/{id}/view` | Record a view |
| GET | `/api/visitors` | Get and increment visitor count |

---

## 📄 License

This project is open-sourced software licensed under the MIT license.

