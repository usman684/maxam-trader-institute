# MAXAM TRADER INSTITUTE

Institute website, student portal and admin panel.

- `client/` React + Vite + Tailwind frontend
- `server/` Express + MongoDB (Mongoose) API, Vercel serverless

## Run locally
1. `cd server && npm install`, copy `.env.example` to `.env` and fill it in.
2. `ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=a-strong-password npm run seed:admin` (once, creates the Super Admin).
3. `npm run dev` (API on http://localhost:3000)
4. In another terminal: `cd client && npm install && npm run dev`
5. Open the site, then `/admin/login`. In Admin > Manage site > courses, press "Load the 4 default courses".

## Deploy on Vercel (two projects from this one repo)
- Project 1: Root Directory `server`. Add every variable from `server/.env.example`. Set `CLIENT_ORIGIN` to the client URL.
- Project 2: Root Directory `client` (Vite). Add `VITE_API_URL=https://YOUR-SERVER-URL/api`.
- Never commit `.env` files.

## Before going live
Fill social links and office details (`client/src/config.js` or Admin settings), set payment details in Admin settings, and add real lessons, mentors and results. Test the full flow: apply, verify payment, enroll, student login, lesson, certificate.
