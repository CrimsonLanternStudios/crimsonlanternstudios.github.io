# Classic DOOM - JS-DOS Integration

Browser-based DOOM experience powered by JS-DOS emulator.

## 🎮 Features

- **Full DOOM Experience:** Play the classic 1993 FPS in your browser
- **Play Button:** Click to start - game loads on demand
- **Fullscreen Toggle:** Immersive fullscreen gameplay
- **Cross-Browser:** Works on Chrome, Firefox, Edge, Safari
- **Mobile Support:** Touch controls available on mobile devices
- **Gamepad Support:** Connect a controller for console-like experience
- **Volume Control:** Mute/unmute audio
- **Locally Hosted Assets:** All game files are served locally to avoid CORS issues

## 🚀 Quick Start

1. Open `index.html` in a web browser (via local server or GitHub Pages)
2. Click the "PLAY DOOM" button
3. Wait for the DOS emulator to load
4. Play!

## 🔧 Technical Details

### Engine
- **JS-DOS v8** - Production-ready DOS emulator
- All assets hosted locally in the `assets/` folder to avoid CORS issues

### Game Bundle
- Uses a locally hosted `.jsdos` bundle
- Contains DOOM shareware content

### Requirements
- Modern web browser with JavaScript enabled
- No external internet connection required (all assets are local)

## 🎮 Controls

| Action | Keyboard | Notes |
|--------|----------|-------|
| Move Forward/Back | W/S or ↑/↓ | |
| Turn Left/Right | ←/→ | |
| Strafe Left/Right | A/D | |
| Shoot | Ctrl or Space | |
| Use/Open Doors | Space or E | |
| Run | Shift | Hold while moving |
| Change Weapon | 1-7 | |
| Automap | Tab | |
| Fullscreen | Alt+F or F11 | Browser shortcut |
| Mute | Alt+M | |

## 🔄 Swapping WAD Files

### Option 1: Use JS-DOS Studio
1. Visit [JS-DOS Studio](https://dos.zone/studio/)
2. Upload your WAD file and DOOM executable
3. Configure settings and create bundle
4. Download the `.jsdos` file
5. Host it and update the URL in `index.html`

### Option 2: Manual Bundle Creation
1. Install js-dos CLI tools
2. Create a bundle with your WAD:
   ```bash
   jsdos bundle.jsdos --add doom.wad --add doom.exe
   ```
3. Configure `dosbox.conf` inside the bundle
4. Host and use in your integration

### Using Freedoom
[Freedoom](https://freedoom.github.io/) provides free WAD files:
- `freedoom1.wad` - Freedoom: Phase 1
- `freedoom2.wad` - Freedoom: Phase 2

## 📁 File Structure

```
classic-doom/
├── assets/
│   ├── doom.jsdos           # Game bundle (DOOM shareware)
│   ├── js-dos.js            # JS-DOS v8 main script
│   ├── js-dos.css           # JS-DOS v8 styles
│   └── emulators/           # Emulator core files (WASM/JS)
│       ├── emulators.js
│       ├── wdosbox.js
│       ├── wdosbox.wasm
│       ├── wdosbox-x.js
│       ├── wdosbox-x.wasm
│       ├── wlibzip.js
│       └── wlibzip.wasm
├── index.html               # Main game page with JS-DOS integration
└── README.md                # This file
```

## 🌐 Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Recommended | Best performance |
| Firefox | ✅ Supported | Full functionality |
| Edge | ✅ Supported | Full functionality |
| Safari | ✅ Supported | May need user interaction for audio |
| Mobile Chrome | ✅ Supported | Touch controls available |
| Mobile Safari | ✅ Supported | Touch controls available |

## ⚙️ Customization

### Changing the Game Bundle
1. Create a new `.jsdos` bundle using [JS-DOS Studio](https://dos.zone/studio/)
2. Place the bundle in the `assets/` folder
3. Edit `index.html` and modify the bundle path:
```javascript
dosInstance = Dos(jsdosContainer, {
    url: "assets/YOUR_BUNDLE.jsdos",
    pathPrefix: "assets/emulators/",
    noCloud: true,
    // ... other options
});
```

### Styling
All styles are inline in `index.html`. Modify the `<style>` section to customize:
- Colors (uses Crimson Lantern Studios branding)
- Layout and sizing
- Button styles
- Fullscreen behavior

### Adding Save States
JS-DOS v8 supports save states through the cloud feature or local persistence.

## 📜 Legal

- **JS-DOS:** MIT License - https://js-dos.com
- **Freedoom:** GNU GPL - https://freedoom.github.io
- **DOOM trademark:** id Software / Bethesda Softworks
- This project is not affiliated with id Software or Bethesda

## 🐛 Troubleshooting

### Game Won't Load
1. Ensure all files in the `assets/` folder are present
2. Try a different browser
3. Clear browser cache
4. Check browser console for errors
5. If hosting locally, make sure to use a local server (WASM requires proper MIME types)

### No Sound
1. Click inside the game canvas after loading
2. Check the mute button status
3. Ensure browser allows audio autoplay

### Performance Issues
1. Close other browser tabs
2. Use Chrome for best performance
3. Try windowed mode instead of fullscreen

## 🔗 Resources

- [JS-DOS Documentation](https://js-dos.com/overview.html)
- [JS-DOS v8 API](https://js-dos.com/)
- [Freedoom Project](https://freedoom.github.io/)
- [DOOM Wiki](https://doom.fandom.com/)

---

Built for Crimson Lantern Studios
