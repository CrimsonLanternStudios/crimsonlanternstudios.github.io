# Crimson Lantern Studios Website

Official website for Crimson Lantern Studios - an indie game development studio.

## 🎮 Games

### Crimson Doom
A custom-built raycasting roguelike game featuring:
- Full 3D raycasting rendering engine
- Player movement (WASD + mouse look)
- Multiple weapons and enemies
- Procedurally generated levels
- Located at: `games/doom/`

### Classic DOOM (JS-DOS Integration)
The legendary 1993 first-person shooter running in your browser via JS-DOS emulator.
- **Location:** `games/classic-doom/`
- **Engine:** [JS-DOS](https://js-dos.com/) v7
- **Game Content:** [Freedoom](https://freedoom.github.io/) (free, open-source DOOM-compatible game)

## 🚀 Setup & Deployment

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CrimsonLanternStudios/crimsonlanternstudios.github.io.git
   cd crimsonlanternstudios.github.io
   ```

2. **Serve locally** (choose one method):
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js (http-server):
   ```bash
   npx http-server -p 8000
   ```
   
   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser:**
   - Main site: `http://localhost:8000`
   - Crimson Doom: `http://localhost:8000/games/doom/`
   - Classic DOOM: `http://localhost:8000/games/classic-doom/`

### GitHub Pages Deployment

This site is designed for GitHub Pages:

1. Push to the `main` branch
2. Enable GitHub Pages in repository Settings → Pages
3. Select "Deploy from a branch" and choose `main`
4. Site will be available at: `https://crimsonlanternstudios.github.io`

### Custom Domain (Optional)

1. Add a `CNAME` file with your domain
2. Configure DNS with your registrar
3. Enable HTTPS in GitHub Pages settings

## 🎮 Classic DOOM Configuration

### How It Works

The Classic DOOM integration uses:
- **JS-DOS v7** - A JavaScript DOS emulator
- **CDN-hosted game bundle** - Prepackaged DOOM shareware from dos.zone
- **No local WAD files needed** - Everything is loaded from CDN

### Adding Custom WAD Files

To use a different WAD file:

1. **Create a JS-DOS bundle:**
   - Visit [JS-DOS Studio](https://dos.zone/studio/)
   - Upload your WAD file and DOOM executable
   - Configure and download the `.jsdos` bundle

2. **Host the bundle:**
   - Place the `.jsdos` file in your repository or CDN
   - Update the URL in `games/classic-doom/index.html`:
   ```javascript
   dosInstance = await Dos(jsdosContainer).run("path/to/your-bundle.jsdos");
   ```

### Using Freedoom (Recommended)

[Freedoom](https://freedoom.github.io/) provides a free, open-source game that's compatible with DOOM engines:

1. Download from: https://freedoom.github.io/download.html
2. Create a JS-DOS bundle with the Freedoom WAD
3. Host and link in your integration

### Browser Compatibility

Tested and working on:
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ✅ Mobile browsers (touch controls available)

### Controls

| Action | Key |
|--------|-----|
| Move Forward/Back | W/S or ↑/↓ |
| Turn Left/Right | ←/→ |
| Strafe | A/D |
| Shoot | Ctrl or Space |
| Use/Open Doors | Space or E |
| Run | Shift |
| Change Weapon | 1-7 |
| Automap | Tab |
| Fullscreen | Alt+F or F11 |
| Mute | Alt+M |

## 📁 Project Structure

```
crimsonlanternstudios.github.io/
├── index.html              # Main website
├── style.css               # Main stylesheet
├── README.md               # This file
├── .nojekyll               # Disable Jekyll processing
└── games/
    ├── doom/               # Crimson Doom (custom game)
    │   ├── index.html
    │   ├── engine.js       # Raycasting engine
    │   ├── game.js         # Game logic
    │   ├── levelgen.js     # Level generation
    │   └── README.md
    └── classic-doom/       # Classic DOOM (JS-DOS)
        └── index.html      # JS-DOS integration
```

## 🔧 Scalability Suggestions

### CDN Hosting
For better performance, consider:
- Hosting game assets on a CDN (Cloudflare, jsDelivr)
- Using asset preloading for faster load times

### Modular Asset Loading
The Classic DOOM integration already uses:
- Lazy loading of the game engine
- CDN-hosted game bundles
- Progressive loading with status updates

### Performance Optimization
- JS-DOS scripts are loaded from CDN
- Game only initializes when Play button is clicked
- Minimal JavaScript on initial page load

## 📜 Legal

- **Crimson Doom:** Original game built by Claude for Crimson Lantern Studios
- **Classic DOOM Integration:** Uses [JS-DOS](https://js-dos.com/) emulator (MIT License)
- **Game Content:** [Freedoom](https://freedoom.github.io/) (GNU GPL)
- **DOOM trademark:** id Software / Bethesda Softworks (not affiliated)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📞 Contact

- **Website:** https://crimsonlanternstudios.github.io
- **Email:** contact@crimsonlanternstudios.com

---

© 2025 Crimson Lantern Studios. All rights reserved.