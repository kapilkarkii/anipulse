# AniPulse

AniPulse is a private, local-first React anime progress tracker. It records your current episode, watch status, completion statistics, and the next scheduled release without requiring an account.

## Features

- Warm editorial interface with a library sidebar and featured watchlist artwork
- Mark the next episode watched directly from the featured panel
- Switch between poster grid and compact list views
- Sort by recently added, title, or watch progress
- Responsive layouts, keyboard focus indicators, and reduced-motion support

- Track watching, completed, planned, and paused anime
- Increment or correct episode progress in one click
- Countdown to the next manually entered release
- Search and filter a personal library
- Search a live anime catalog with real poster artwork
- Browser alerts for releases within 24 hours when the app is open
- Offline support through a service worker
- Responsive interface for desktop and mobile
- LocalStorage persistence—data stays on the device

## Tech stack

- React
- Vite
- Component-based JavaScript (JSX)
- CSS
- LocalStorage
- Service Worker / Web App Manifest
- Kitsu catalog with Jikan fallback

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite. To verify the production build, run `npm run build` followed by `npm run preview`.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository named `anipulse`.
2. Open **Settings → Pages**.
3. Under **Source**, choose **GitHub Actions**.
4. The included workflow builds and deploys the `dist` directory after every push to `main`.

## Product roadmap

- Anime metadata and airing schedule provider integration
- Account sync with a hosted database
- Reliable server-side push and email reminders
- Import/export and device migration
- Catch-up planner based on the next release
- Streaming-region and subtitle/dub release preferences

## Data-provider note

Do not commit API tokens to this repository. Review a provider's current API terms before integration. In particular, AniList's API terms restrict competing tracker applications. AnimeSchedule requires an application token, attribution, and compliance with its API terms.

## License

MIT
