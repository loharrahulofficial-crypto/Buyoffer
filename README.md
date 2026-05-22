# Lots of Offers

A comprehensive deals aggregation website that helps users find the best offers across multiple categories.

## Features

- 🎯 **Multiple Categories**: Home, Traveling, Food point, Grocery, Shopping
- 🔍 **Powerful Search**: Search deals across all categories
- 💳 **Discount Display**: Shows original price, discounted price, and discount percentage
- ⏰ **Expiration Dates**: See when offers expire
- 🔗 **Affiliate Links**: Direct redirect to partner websites with discounts applied
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- 🚀 **Fast Performance**: Built with React and Vite

## Project Structure

```
buyoffer/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx    # Main application component
│   │   ├── App.css    # Styles
│   │   ├── main.jsx   # Entry point
│   │   └── index.css  # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/           # Node.js + Express backend
│   ├── server.js      # API server
│   ├── .env           # Environment variables
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Usage

1. **Browse Categories**: Click on category tabs to filter offers
2. **Search**: Use the search bar to find specific deals
3. **View Offers**: Click on any offer card to view details on the partner website

## API Endpoints

### Get All Offers
```
GET /api/offers
```

Query Parameters:
- `category`: Filter by category (home, traveling, food, grocery, shopping)
- `search`: Search by keyword

### Get Single Offer
```
GET /api/offers/:id
```

### Health Check
```
GET /api/health
```

## Future Enhancements

- User authentication and favorite deals
- Email notifications for price drops
- Admin dashboard for managing offers
- Analytics tracking
- Real-time price comparison
- Automated deal updates every 15 minutes
- Integration with major affiliate networks

## Technologies

- **Frontend**: React 19, Vite, CSS3
- **Backend**: Node.js, Express, CORS
- **API**: RESTful API design

## License

ISC
