# CognifyZ — MERN Smart Dashboard

A full-stack MERN application with Google/GitHub OAuth, real-time weather, news feed, dark/light mode, and rate limiting.

## Tech Stack

**Client:** React 18 + Vite, Bootstrap 5, React Router v6  
**Server:** Node.js + Express (ES Modules), Passport.js OAuth  
**Database:** MongoDB + Mongoose  
**Auth:** JWT + Google OAuth 2.0 + GitHub OAuth  
**APIs:** OpenWeatherMap, NewsAPI  

---

## Quick Start

### 1. Clone & Install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment Variables

#### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cognifyz_oauth
JWT_SECRET=your_super_secret_jwt_key_change_in_production
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
OPENWEATHER_API_KEY=your_openweather_api_key
NEWS_API_KEY=your_news_api_key
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:3000
```

#### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Get API Keys

| Service | URL | Free Tier |
|---------|-----|-----------|
| OpenWeatherMap | https://openweathermap.org/api | 1000 calls/day |
| NewsAPI | https://newsapi.org | 100 calls/day |
| Google OAuth | https://console.cloud.google.com | Free |
| GitHub OAuth | https://github.com/settings/developers | Free |

### 4. OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → Enable Google+ API
3. OAuth 2.0 Credentials → Authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App:
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:5000/api/auth/github/callback`

### 5. Run

```bash
# Terminal 1 — Start server
cd server && npm run dev

# Terminal 2 — Start client
cd client && npm run dev
```

Visit: http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register with email |
| POST | `/api/auth/login` | Public | Login with email |
| GET | `/api/auth/profile` | JWT | Get user profile |
| GET | `/api/auth/google` | Public | Google OAuth |
| GET | `/api/auth/github` | Public | GitHub OAuth |
| GET | `/api/weather/:city` | JWT | Weather by city |
| GET | `/api/weather/coords/:lat/:lon` | JWT | Weather by coordinates |
| GET | `/api/news/:category` | JWT | News by category |
| GET | `/api/news/search/:query` | JWT | Search news |
| GET | `/api/health` | Public | Health check |

### Rate Limits
- **General API:** 100 requests / 15 minutes per IP
- **Auth routes:** 10 requests / 15 minutes per IP

---

## Project Structure

```
cognifyz-app/
├── client/                     # Vite + React frontend
│   ├── src/
│   │   ├── components/         # Navbar, ThemeToggle, WeatherCard, NewsCard, OAuthButton
│   │   ├── pages/              # Home, Login, Dashboard, Weather, News
│   │   ├── context/            # ThemeContext, AuthContext
│   │   ├── services/           # authApi, weatherApi, newsApi
│   │   ├── App.jsx             # Router + Providers
│   │   └── App.css             # Full design system (dark/light)
│   └── .env
└── server/                     # Express backend
    ├── src/
    │   ├── controllers/        # authController, weatherController, newsController
    │   ├── models/             # userModel (Mongoose)
    │   ├── routes/             # authRoutes, weatherRoutes, newsRoutes
    │   ├── middleware/         # authMiddleware, rateLimiter, errorHandler
    │   ├── config/             # db.js
    │   └── app.js              # Express app entry point
    └── .env
```

---

## Features

- ✅ Google & GitHub OAuth 2.0 with Passport.js
- ✅ Traditional email/password auth with bcrypt
- ✅ JWT-based protected routes
- ✅ Live weather with city search + auto-location
- ✅ News feed with category filter + pagination + search
- ✅ Dark / Light mode with smooth CSS transitions
- ✅ Rate limiting (general + stricter for auth)
- ✅ Global error handler with custom error classes
- ✅ Fully responsive (mobile → desktop)
- ✅ MVC folder structure with ES Modules
