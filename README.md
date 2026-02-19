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

## 📜 Legal

- **Classic DOOM Integration:** Uses [JS-DOS](https://js-dos.com/) emulator (MIT License)
- **Game Content:** [Freedoom](https://freedoom.github.io/) (GNU GPL)
- **DOOM trademark:** id Software / Bethesda Softworks (not affiliated)

## 📞 Contact

- **Website:** https://crimsonlanternstudios.com
- **Email:** contact@crimsonlanternstudios.com

---

© 2025 Crimson Lantern Studios. All rights reserved.
