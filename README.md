# RiyaWedding

A mobile-first, Hindi/English wedding invitation built with React and CSS, backed by a small Node.js/Express server. The original single-file version is preserved as `archive-invitation.html` for reference.

## Run locally

```bash
npm install
npm run dev
```

Open the address printed by Vite (usually `http://localhost:5173`). `npm run dev` starts the Vite frontend; to accept RSVPs locally, run `npm start` in a second terminal as well.

## Production

```bash
npm run build
npm start
```

The Express server serves the production build and the RSVP API at `http://localhost:3000` (or `PORT`).

## Deploy to Netlify

The repository includes `netlify.toml` with the production build command and `dist` publish directory. To deploy:

1. Push this project to a GitHub repository.
2. In Netlify, choose **Add new site** → **Import an existing project**, then authorize GitHub and select the repository.
3. Keep the detected build settings (`npm run build` and `dist`) and choose **Deploy site**.

The Netlify rewrite serves the built `app.html` at the site root. The current website is static and does not use the RSVP API. The optional Express `/api/rsvp` endpoint in `server.js` is not deployed by this static-site configuration.

## Personalizing the invitation

## Where the website gets its content

- `app.html` is the page shell loaded by Vite and the production server. It loads `src/main.jsx`, which mounts the React app.
- `src/config.js` contains the wedding names, family details, dates, event schedule, venue, phone numbers, music path, and map link.
- `src/InvitationMarkup.jsx` defines the page sections and the shared bride-and-groom photo.
- `src/components.jsx` renders the event cards. The family and gallery sections are currently disabled and are not rendered on the page.
- `public/assets/` contains the photos and music served at `/assets/...`.
- `src/styles.css` controls the page's appearance and responsive layouts.

`archive-invitation.html` is an old standalone version kept for reference. It is not the page loaded by the current Vite app. `index.html` is also not the configured production build entry; edit the React sources above for changes to the live website.

To personalize the invitation, edit `src/config.js` for wedding details and `src/InvitationMarkup.jsx` for page content and the couple photo. The gallery component and photo list remain in `src/components.jsx` if you want to enable the gallery again later.

Before publishing:

- Put your photos in `public/assets/` and update their paths in `src/InvitationMarkup.jsx` (couple photo) or `src/components.jsx` (gallery).
- Replace each event's `[समय जोड़ें]` / `[Add time]` with its confirmed time.
- Wedding music is stored in `public/assets/prettyjohn1-wedding-wedding-music_35sec-487336.mp3` and configured through `audioPath`. Visitors can start or stop it with the sound button; browsers require a user gesture before playing audio. Set `mapsLink` to the venue's Google Maps URL when available.
- Optionally add a social preview image (`public/assets/wedding-preview.jpg`) and meta tag in `app.html`.

## RSVP API

The website currently has no RSVP page. The optional `POST /api/rsvp` endpoint remains available for a future form; it validates name, guest count, and message length, then appends each response to `data/rsvps.jsonl`. That file is git-ignored; back it up if the responses matter. Set `RSVP_FILE` to store responses elsewhere.
