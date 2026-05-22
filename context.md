# Lots of Offers - Project Context & Documentation

## 📋 Project Overview

**Project Name:** Lots of Offers  
**Type:** Full-Stack Web Application (Deals Aggregation Website)  
**Technologies:** React 19 (Frontend) + Node.js/Express (Backend) + Vite  
**Creation Date:** May 2026

---

## 📁 Project Structure

```
buyoffer/
├── backend/                 # Backend API
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies (Express, CORS, dotenv)
│   └── server.js           # Main API server with 30 pre-loaded offers
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx         # Main app with categories, search, & offers grid
│   │   ├── App.css         # Complete modern styling with design system
│   │   ├── main.jsx        # Entry point
│   │   └── index.css
│   ├── index.html
│   └── package.json        # Dependencies (React 19, Vite)
├── context.md              # This file - project documentation
├── README.md
└── .gitignore
```

---

## ✨ Key Features Implemented

### 🎯 Core Features
1. **5 Categories**: Home, Traveling, Food, Grocery, Shopping
2. **30 Pre-loaded Offers**: Indian brands like Amazon India, Flipkart, Zomato, Swiggy, Myntra, etc.
3. **Search Functionality**: Search across offers (title, description, category, city, area)
4. **Discount Display**: Original price, discounted price, discount percentage
5. **Expiration Dates**: See when offers expire
6. **Affiliate Links**: Clicking an offer redirects to partner website
7. **Responsive Design**: Works on mobile, tablet & desktop
8. **Currency Display**: Indian Rupees (₹) throughout

### 📍 Location Filtering System
- **All India**: View all offers without location filtering
- **Near Me**: GPS-based proximity detection (uses browser's Geolocation API)
- **City**: Filter by specific city (Delhi, Mumbai, Bangalore, etc.)
- **State**: Filter by state (Delhi, Maharashtra, Karnataka, etc.)
- **Area**: Filter by specific area/landmark (Connaught Place, Bandra, Indiranagar, etc.)

### 🔍 Advanced Search & Filtering
- **Price Range**: Min and max price filters
- **Sorting Options**: 
  - Recommended
  - Best Deals (Highest Discount)
  - Price: Low → High
  - Price: High → Low
  - Ending Soon
- **Availability Filter**: Show only non-expired offers
- **Real-time Updates**: Offers reload when any filter changes

---

## 🎨 UI/UX Redesign (May 2026)

### Modern Design Features
- **Sticky Navbar**: Glass-morphism effect with backdrop blur
- **Premium Hero Section**: 3-stop gradient, floating accents, badge with highlight
- **Category Cards**: Each with unique gradient backgrounds
- **Premium Offer Cards**: Overlay, smooth animations, staggered loading
- **Complete Design System**: CSS variables, color palette, shadows, spacing
- **Micro-interactions**: Hover lifts, scale effects, fade-in animations

### Color Palette
- Primary: #6366f1 (Indigo)
- Secondary: #f97316 (Orange)
- Accent: #10b981 (Green)
- Success: #22c55e
- Danger: #ef4444
- Dark: #0f172a

---

## 🚀 How to Run

### Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend (in a new terminal)
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 📡 API Endpoints

### Offers
- `GET /api/offers` - Get all offers (supports multiple query params)
  - Query params:
    - `category`: Filter by category
    - `search`: Search across offers
    - `city`, `state`, `area`: Location filters
    - `lat`, `lng`, `radius`: Near Me search
    - `minPrice`, `maxPrice`: Price range
    - `sortBy`: Sorting option
    - `showAvailable`: Filter expired offers

- `GET /api/offers/:id` - Get single offer by ID

### Locations
- `GET /api/locations` - Get available cities, states, and areas

### Health
- `GET /api/health` - Health check

---

## 💰 Offer Data

All 30 offers include:
- Title, description, category
- Original price, discounted price, discount percentage
- Image URL (AI-generated)
- Affiliate link
- Expiration date
- Location information: city, state, area, coordinates
- 10+ Indian cities included (Delhi, Mumbai, Bangalore, Hyderabad, Chennai, etc.)

---

## 📱 Responsive Breakpoints

- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px
- Small Mobile: < 480px

---

## 📝 Changelog & Development History

### May 12-13, 2026
1. **Initial Project Scan**: Analyzed existing project structure
2. **Currency Update**: Changed from $ to ₹ (INR) throughout
3. **Location System Added**: Implemented Near Me, City, State, Area filters
4. **Deal Selection Bug Fixed**: Secure window.open with proper state management
5. **Advanced Search Added**: Price range, sorting, availability filter
6. **Complete UI Redesign**: Modern, premium design with glass-morphism
7. **Sticky Navbar**: Added glass-effect navigation
8. **Backend Started Successfully**: Running on http://localhost:5000

---

## 🎯 Future Enhancements (Suggestions)

- User authentication & accounts
- Database integration (MongoDB, PostgreSQL)
- User reviews & ratings
- Email notifications for expiring deals
- Admin dashboard for managing offers
- More cities and locations
- Offer bookmarking
- Social sharing
- Payment integration

---

## 📄 License

© 2026 Lots of Offers. All rights reserved.
