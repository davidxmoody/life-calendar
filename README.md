# Life calendar

This is a Progressive Web App built to visualise health/habit data and display personal journal entries.

This project was originally based on [an old blog post](https://waitbutwhy.com/2014/05/life-weeks.html) about visualising the amount of time you have left in your life. It has since evolved into an app I use daily.

This screenshot shows the number of git commits I've made (in public GitHub repos) in my lifetime.

![](screenshot.png)

## Architecture

### Server

- Lightweight Express server (runs on my laptop on a static local IP address)
- `/sync` endpoint to return all files modified since a given timestamp
- Includes simple auth system

### PWA

- Built with TypeScript, React, Vite, Tailwind CSS and shadcn/ui
- Uses Service Workers for a fully offline app
- Uses IndexedDB (with Dexie) to cache and search data locally
- Uses Jotai for state management
- Uses React Virtuoso for an infinite scroll timeline

### Calendar

- Manually rendered on canvas for performance
- Responds to viewport size to align squares perfectly on pixel boundaries
- Displays "layers" of health/habit data (see [this repo](https://github.com/davidxmoody/self-tracking) for scripts that generate the layers)
- Later weeks fade out relative to the chance of living to that age
- Searching for text generates a temporary layer highlighting matches

## Project history

This project has acted as my playground for learning new web tech. I've rewritten it many times from the ground up. Here's a brief timeline of the major changes:

- **Dec 2015** - Started as a static HTML page rendering a grid of weeks, then converted to React and added era colouring and life-expectancy data.
- **Jan-Mar 2016** - Added Bootstrap for layout, then replaced it with CSS Modules.
- **Jun 2016** - Built an Express/Nunjucks server for server-side rendering.
- **Sep-Nov 2016** - Experimented with Elm as an alternative frontend.
- **Jan 2017** - Added life-expectancy probability calculations to fade future weeks.
- **May-Jul 2017** - Switched to Create React App. Experimented with canvas rendering and zooming animations.
- **Oct 2018** - Rewrote the frontend in TypeScript. Built an Express server to serve Markdown diary data.
- **Dec 2018** - Briefly experimented with SQLite.
- **Jun-Aug 2019** - Rewrote the client to use React Hooks. Added Material UI and the Wouter routing library.
- **Aug-Sep 2019** - Built the data layers system for visualising health/habit data on the calendar.
- **Jul 2020** - Added react-query for server state management.
- **Dec 2020** - Rewrote as a Progressive Web App with Service Workers, IndexedDB (via idb) and incremental sync from local server.
- **Jan 2021** - Added Chakra UI as the component library. Reimplemented the calendar as a canvas-rendered component for performance.
- **Feb 2021** - Added full-text search functionality.
- **Jul 2021** - Replaced Zustand with Jotai for state management (using React Suspense and async atoms).
- **Mar-Apr 2022** - Experimented with a React Native mobile app with SQLite storage.
- **May 2022** - Added token-based authentication for the sync server.
- **Oct-Dec 2022** - Added search highlighting, layer grouping, health data import scripts and performance optimisations.
- **2023** - Added more health data import scripts.
- **Feb-May 2024** - Extracted all data import/generation scripts to a separate repo. Migrated era and layer data to TSV format.
- **Feb 2026** - Used Claude Code to make significant refactors: migrated from Chakra UI to Tailwind CSS and shadcn/ui, migrated from Create React App to Vite, migrated from idb to Dexie, migrated from Moment.js to date-fns, added an infinite-scroll timeline with React Virtuoso and redesigned the layout to a three-column view.
