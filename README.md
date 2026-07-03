# Crimson Lantern Studios Website

Official website for Crimson Lantern Studios — a solo indie game development studio.

Built with [Astro](https://astro.build/) and deployed to GitHub Pages.

## 🚀 Setup & Deployment

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CrimsonLanternStudios/crimsonlanternstudios.github.io.git
   cd crimsonlanternstudios.github.io
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Main site: `http://localhost:4321`
   - Classic DOOM: `http://localhost:4321/games/classic-doom/`

### Build

```bash
npm run build
```

The built site is output to the `dist/` directory.

### Preview

```bash
npm run preview
```

### GitHub Pages Deployment

This site deploys to GitHub Pages via GitHub Actions:

1. Push to the `main` branch
2. The workflow at `.github/workflows/deploy.yml` builds and deploys automatically
3. Site will be available at: `https://crimsonlanternstudios.com`

## 📁 Project Structure

```
crimsonlanternstudios.github.io/
├── astro.config.mjs            # Astro configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── .nojekyll                   # Disable Jekyll processing
├── README.md                   # This file
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deploy workflow
├── public/
│   ├── fonts/                  # Local font hosting (future)
│   └── games/
│       ├── classic-doom/       # Classic DOOM (JS-DOS emulator)
│       │   ├── assets/
│       │   │   ├── js-dos.css
│       │   │   ├── js-dos.js
│       │   │   ├── doom.jsdos
│       │   │   └── emulators/  # WASM and JS emulator files
│       │   └── index.html      # Standalone game page
│       └── window-lock.js      # Window lock utility
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro    # Base HTML layout (nav, footer placeholder)
│   ├── components/             # Astro components (future)
│   ├── pages/
│   │   ├── index.astro         # Home page
│   │   ├── store.astro         # Store page
│   │   ├── arcade/
│   │   │   ├── dos.astro       # DOS Classics hub
│   │   ├── projects.astro      # Projects page
│   │   ├── about.astro         # About page
│   │   └── community.astro     # Community page
│   ├── styles/
│   │   └── global.css          # CSS variables and base styles
│   └── content/
│       └── devlog/             # Markdown posts (future, Decap CMS)
└── dist/                       # Build output (git-ignored)
```

## 💾 Save State / Load State

The arcade emulator supports exporting and importing save states so you can close your browser and resume play later.

### How it works

When a game is running, two buttons appear in the control bar below the emulator:

- **💾 Save State** — Captures the entire DOS filesystem (including in-game save files) and downloads a `.jsdos` file to your machine. The filename includes the game slug and a timestamp, e.g. `betrayal-at-krondor-2025-06-01T12-00-00.jsdos`.
- **📂 Load State** — Opens a file picker. Select a previously exported `.jsdos` file; the emulator will restart and resume from that point.

### Saving

1. Launch the game and play until you want to save.
2. **Use the game's own in-game save system first** (e.g. Betrayal at Krondor's *Save Game* menu) so your progress is written to the DOS filesystem.
3. Click **💾 Save State** — your browser will download a `.jsdos` file automatically.
4. Keep this file somewhere safe on your local machine.

### Loading

1. Navigate to the game page (you do not have to start the game first).
2. Click **📂 Load State** and select your previously exported `.jsdos` file.
3. The emulator will initialise using that bundle, restoring the filesystem exactly as it was when you saved.
4. Launch the game's built-in *Load Game* option to restore your in-game progress.

### Limitations

- Save states are tied to the **JS-DOS version** bundled with this site (v8.3.20). States exported from a significantly different version may not load correctly.
- The `.jsdos` file contains the **full DOS filesystem snapshot** — it may be several megabytes depending on the game.
- Because the emulator captures filesystem state (not live RAM/CPU state), in-game *autosaves* and mid-action states are **not** preserved. Always save inside the game before exporting a state.
- Load State restarts the emulator session; any unsaved progress in the current session will be lost.
- This feature works entirely client-side and requires no account or internet connection beyond the initial page load.

## 📜 Legal

- **Classic DOOM Integration:** Uses [JS-DOS](https://js-dos.com/) emulator (MIT License)
- **Game Content:** [Freedoom](https://freedoom.github.io/) (GNU GPL)
- **DOOM trademark:** id Software / Bethesda Softworks (not affiliated)

## 📞 Contact

- **Website:** https://crimsonlanternstudios.com
- **Email:** contact@crimsonlanternstudios.com

---

© 2025 Crimson Lantern Studios. All rights reserved.
