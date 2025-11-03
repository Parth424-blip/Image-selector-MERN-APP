# MERN + OAuth: Image Search & Multi-Select

Full-stack project using MongoDB, Express, React, Node, Passport OAuth, and Unsplash API.

## Features
- OAuth login with Google, Facebook, GitHub (Passport.js)
- Only authenticated users can search
- Unsplash image search with 4-column grid and multi-select overlay
- Top 5 searches across all users (banner)
- Per-user search history with timestamps

## Folder Structure
- `src/` React frontend (port 3000)
- `server/` Express backend (port 5000)

## Setup
1) Install deps
```bash
npm install
cd server && npm install
```

2) Create `server/.env`
```bash
MONGODB_URI=mongodb://localhost:27017/mern-oauth-search
SESSION_SECRET=replace-with-strong-secret
CLIENT_ORIGIN=http://localhost:3000
SERVER_BASE_URL=http://localhost:5000

UNSPLASH_ACCESS_KEY=your_unsplash_access_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

3) Configure OAuth app callback URLs
- Google: `http://localhost:5000/auth/google/callback`
- Facebook: `http://localhost:5000/auth/facebook/callback`
- GitHub: `http://localhost:5000/auth/github/callback`

4) Run
```bash
# Terminal 1
cd server
npm start

# Terminal 2 (project root)
npm start
```

Open `http://localhost:3000`. Click a provider to sign in.

## API Endpoints
- GET `/api/current_user` → returns the authenticated user or `null`
- GET `/api/top-searches` → `{ topSearches: string[] }`
- POST `/api/search` `{ term }` → `{ images: {id,url}[] }`
- GET `/api/history` → `{ history: {term,timestamp}[] }`
- POST `/api/logout` → `{ success: true }`

All endpoints require authentication except `/api/current_user`.

### cURL examples
```bash
# Get current user
curl -i -c cookies.txt -b cookies.txt http://localhost:5000/api/current_user

# After login via browser, reuse cookies to call APIs:
curl -i -c cookies.txt -b cookies.txt http://localhost:5000/api/top-searches

curl -i -c cookies.txt -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"term":"mountains"}' \
  http://localhost:5000/api/search

curl -i -c cookies.txt -b cookies.txt http://localhost:5000/api/history
```

## Visual Proof
- OAuth login screen (`src/pages/LoginPage.js`)
- Top Searches banner + Search results + multi-select overlay (`src/pages/SearchPage.js`)
- Search history sidebar (`src/pages/SearchPage.js`)

## Notes
- CORS is restricted to `CLIENT_ORIGIN` and cookies are enabled for session.
- Ensure Unsplash app is approved and usage complies with their terms.
 - Set your OAuth app callback URLs to exactly match:
   - Google: `http://localhost:5000/auth/google/callback`
   - Facebook: `http://localhost:5000/auth/facebook/callback`
   - GitHub: `http://localhost:5000/auth/github/callback`
 - If login redirects to `/auth/failure`, re-check `SERVER_BASE_URL`, provider callback URLs, and client IDs/secrets.
