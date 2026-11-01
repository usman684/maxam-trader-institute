# MAXAM Backend (Express + MongoDB + Vercel)
1. npm install  2. copy .env.example to .env and fill it  3. ADMIN_EMAIL=.. ADMIN_PASSWORD=.. npm run seed:admin (one time)  4. npm run dev (http://localhost:3000)
Deploy: import to Vercel, add the same env vars. Set CLIENT_ORIGIN to your frontend URL.
Frontend: set VITE_API_URL to https://YOUR-BACKEND.vercel.app/api
