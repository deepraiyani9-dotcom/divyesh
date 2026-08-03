# Lotus Agritech — PVC Manufacturing Website (MERN)

Production-ready website and admin panel for **Lotus Agritech**.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion, React Router, Axios, Chart.js, Swiper |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Multer, Nodemailer |
| Deploy | Vercel (client) · Render (API) · MongoDB Atlas |

## Quick start

### Prerequisites

- Node.js 20+
- MongoDB locally **or** a MongoDB Atlas connection string

### 1. Install

```bash
cd lotus-mern
npm run install:all
```

### 2. Configure API

```bash
cd server
copy .env.example .env
```

Edit `server/.env` and set `MONGODB_URI` (local or Atlas).

### 3. Seed database

```bash
npm run seed
```

Default admin:

- Email: `admin@lotusagritech.com`
- Password: `Admin@12345`

### 4. Run development

**Option A — local / Atlas MongoDB**

Terminal 1 — API (`http://localhost:5000`):

```bash
npm run dev:server
```

Terminal 2 — Client (`http://localhost:5173`):

```bash
npm run dev:client
```

**Option B — no MongoDB installed (in-memory)**

```bash
cd server
npm run dev:memory
```

Then start the client in another terminal. Data resets when the API process stops.

Vite proxies `/api` and `/uploads` to the API.

## Project structure

```
lotus-mern/
├── client/                 # React SPA
│   └── src/
│       ├── components/
│       ├── pages/public/   # Marketing site
│       ├── pages/admin/    # Admin dashboard
│       ├── services/       # Axios API clients
│       ├── context/
│       └── layouts/
└── server/                 # Express API
    └── src/
        ├── controllers/
        ├── models/
        ├── routes/
        ├── middleware/
        └── config/
```

## Public pages

Home, About, Products, Product Details, Industries, Gallery, Certificates, Infrastructure, Manufacturing Process, Quality Control, Blog, Careers, FAQ, Testimonials, Contact, Request Quote, Download Brochure, Privacy Policy, Terms, 404.

## Admin panel

`/admin/login` — Dashboard, Products, Categories, Blogs, Gallery, Testimonials, Certificates, Careers, Contact enquiries, Quote requests, Job applications, Settings, Profile.

## API overview

Base URL: `/api`

| Module | Routes |
|--------|--------|
| Auth | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| Products | `GET/POST /products`, `GET /products/slug/:slug`, `PUT/DELETE /products/:id` |
| Categories / Blogs / Gallery / Testimonials / Certificates / Careers | CRUD under matching paths |
| Public forms | `POST /contact`, `POST /quote`, `POST /subscribe`, `POST /apply` |
| Analytics | `GET /analytics` (auth) |
| Settings | `GET /settings`, `PUT /settings` (admin) |
| Upload | `POST /upload` (auth) |

## Deployment

### MongoDB Atlas

1. Create a free cluster and database user.
2. Whitelist `0.0.0.0/0` (or Render IPs).
3. Set `MONGODB_URI` on the API host.

### Backend — Render

1. New **Web Service** from this repo, root `server`.
2. Build: `npm install`
3. Start: `npm start`
4. Env vars: copy from `.env.example` (production values).
5. Set `CLIENT_URL` to your Vercel URL.
6. Set `NODE_ENV=production`.

### Frontend — Vercel

1. Import repo, root `client`.
2. Build: `npm run build`
3. Output: `dist`
4. **Required env on Vercel:**
   - `VITE_API_URL=https://YOUR-API.onrender.com/api`
5. Redeploy after adding env (Vite bakes env at build time).

### Product images on Vercel (important)

Vercel only hosts the React site. Files in `/uploads` live on the **API server** (or Cloudinary).

1. Set `VITE_API_URL` on Vercel (see above) so images resolve to `https://YOUR-API.../uploads/...`
2. Prefer **Cloudinary** on the API (set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` on Render). New uploads then save as full `https://res.cloudinary.com/...` URLs that work everywhere.
3. Re-upload product photos in admin after Cloudinary is configured (old local `/uploads/...` paths only work while those files exist on the API host).

If the client talks to a separate API origin, ensure Render CORS `CLIENT_URL` matches the Vercel domain.

## Company

- **Lotus Agritech**
- Slogan: *Building trust and steady flows, one pipe at a time.*
- Phone: +91 90990 90582
- Address: Dwarka – Jamnagar Highway, Opposite Khodiyar Mandir, Juvanpur, Kalyanpur, Dwarka, India – 361315
- Hours: Open 24×7
- Developed by Deep's Technology

## License

Private — Lotus Agritech / Deep's Technology.
