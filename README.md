# FoodLink — Smart Food Waste & Donation Platform (Frontend)

React + Vite + Tailwind frontend wired to the real Express/MongoDB backend in
`backend/`. No invented endpoints — every request in `src/lib/api.js` maps to
a route that actually exists in `src/app.js` on the backend.

## Run locally

```bash
npm install
npm run dev
```

`.env` should point at your backend:

```env
VITE_API_URL=http://localhost:8080/api
```

## Known backend gaps this UI works around

- There is no `GET /api/donations/my` for donors, and `GET /api/donations` is
  restricted to `NGO`/`ADMIN`. So the "My Donations" page reads from a
  device-local cache (`localStorage`) populated when a donor submits a
  donation — it is clearly labelled as device-only, not a shared history.
- `GET /api/claims` returns every claim visible to `NGO`/`ADMIN`, not just the
  logged-in NGO's own claims (the backend doesn't filter by `ngoId`). The
  Claims page is labelled accordingly.

## Roles

- **DONOR** — create a donor profile, log donations.
- **NGO** — create an NGO profile, claim available donations, view claims.
- **ADMIN** — dashboard stats, trigger a DA output sync, browse directories.
