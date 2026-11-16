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

## Personalizing the invitation

## Where the website gets its content

- `app.html` is the page shell loaded by Vite and the production server. It loads `src/main.jsx`, which mounts the React app.
- `src/config.js` contains the wedding names, family details, dates, event schedule, venue, phone numbers, music path, and map link.
- `src/InvitationMarkup.jsx` defines the page sections and the shared bride-and-groom photo.
- `src/components.jsx` renders the event cards, family details, and the five-photo gallery.
- `public/assets/` contains the photos and music served at `/assets/...`.
- `src/styles.css` controls the page's appearance and responsive layouts.

`archive-invitation.html` is an old standalone version kept for reference. It is not the page loaded by the current Vite app. `index.html` is also not the configured production build entry; edit the React sources above for changes to the live website.

To personalize the invitation, edit `src/config.js` for wedding details, `src/InvitationMarkup.jsx` for page content and the couple photo, and `src/components.jsx` for gallery photos and reusable sections.

Before publishing:

- Put your photos in `public/assets/` and update their paths in `src/InvitationMarkup.jsx` (couple photo) or `src/components.jsx` (gallery).
- Replace each event's `[समय जोड़ें]` / `[Add time]` with its confirmed time.
- Wedding music is stored in `public/assets/prettyjohn1-wedding-wedding-music_35sec-487336.mp3` and configured through `audioPath`. Visitors can start or stop it with the sound button; browsers require a user gesture before playing audio. Set `mapsLink` to the venue's Google Maps URL when available.
- Optionally add a social preview image (`public/assets/wedding-preview.jpg`) and meta tag in `app.html`.

## RSVP API

The website currently has no RSVP page. The optional `POST /api/rsvp` endpoint remains available for a future form; it validates name, guest count, and message length, then appends each response to `data/rsvps.jsonl`. That file is git-ignored; back it up if the responses matter. Set `RSVP_FILE` to store responses elsewhere.
