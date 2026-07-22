# K3 Plattform

Ein Verbundprojekt von KJR und KoJa im Landkreis Weilheim-Schongau — eine Koordinationsplattform, um die Verteilung von Informationen von und für Akteur:innen der Jugendarbeit im Landkreis zu verbessern.

This is a rebuild of the original Streamlit prototype (kept for reference in [`legacy-streamlit/`](./legacy-streamlit)) as a Vue 3 + Vite frontend backed by a small Node/Express + SQLite API, with real user accounts and an editor review workflow for entries shown on the public map.

## Stack

- `frontend/` — Vue 3, Vite, Vue Router, Pinia, Leaflet (`@vue-leaflet/vue-leaflet`)
- `backend/` — Node, Express, better-sqlite3, JWT auth (bcrypt password hashes)

## How it works

- Anyone can view the public map and submit a new offer via the submission form — no login required.
- Submissions land in a **pending** review queue. Only logged-in **editor** accounts (KJR/KoJa staff) can see the queue, fill in the location, edit fields, and publish an entry — only then does it appear as a marker on the public map.
- Editors can also drag, edit, or delete already-published markers directly on the map.

## Getting started

```bash
npm run install:all      # installs backend/ and frontend/ deps
cp backend/.env.example backend/.env
npm run migrate          # creates backend/data/k3.sqlite
npm run seed             # creates a local dev editor account + one sample published event
npm run dev              # runs backend (:3001) and frontend (:5173) together
```

The seed script prints a local-dev-only editor login (email/password) to the console — use it to log in and try the review queue.

To provision additional editor accounts:

```bash
node backend/src/db/create-user.js --email you@example.com --password "..." --name "Your Name"
```

## Legacy prototype

The original Streamlit prototype (non-functional submission form and map, no backend) lives in [`legacy-streamlit/`](./legacy-streamlit) for reference. See its own `README.md` there for the original project description.
