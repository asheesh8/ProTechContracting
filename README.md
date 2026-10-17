# ProTech Contracting

Website for **ProTech Contracting** in Burlington, Vermont: services, live Google reviews, an estimate-request form, and a blog the owner manages from a private admin area.

**Live:** https://pro-tech-contracting.vercel.app

## Tech stack

- Vite 8 + React 19 + TypeScript, Tailwind CSS 3, React Router
- Supabase — Auth for the admin login, Postgres for blog posts, Storage for blog images (`supabase-schema.sql`)
- Vercel functions in `api/`:
  - `contact.js` — emails estimate requests through Resend
  - `reviews.js` — fetches Google reviews server-side (Places API), with a built-in fallback

## Project layout

```
src/pages/            Home, blog index and post pages
src/pages/admin/      Admin login, dashboard and post editor (behind AdminRoute)
src/components/       Site sections, rich-text editor, admin route guard
src/lib/supabase.ts   Supabase client (falls back to placeholders without env vars)
api/                  Vercel serverless functions
supabase-schema.sql   Tables, row-level security policies and storage bucket
```

## Local setup

Requires Node 20+.

```bash
npm install
cp .env.example .env      # fill in the values below
npm run dev
npm run build             # type-check and build to dist/
```

`/api/*` only runs on Vercel (or under `vercel dev`); with plain `npm run dev` the contact form and live reviews are unavailable.

To set up Supabase, run `supabase-schema.sql` in the SQL editor, create the admin user under Authentication, and **disable public sign-ups** — the policies let any signed-in user edit posts.

## Environment variables

Names only — never commit values.

| Variable | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Browser | Supabase project and public key |
| `GOOGLE_PLACES_API_KEY` | Server (`api/reviews.js`) | Live Google reviews |
| `RESEND_API_KEY` | Server (`api/contact.js`) | Sending estimate emails |
| `CONTACT_EMAIL` | Server (`api/contact.js`) | Inbox that receives estimate requests |

## Deploying

Hosted on Vercel (Vite preset plus the `api/` functions). Set the variables above in the Vercel project; pushes to `main` deploy to production.
