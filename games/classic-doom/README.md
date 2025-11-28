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

## 🚀 Quick Start

1. Open `index.html` in a web browser (via local server or GitHub Pages)
2. Click the "PLAY DOOM" button
3. Wait for the DOS emulator to load
4. Play!

## 🔧 Technical Details

### Engine
- **JS-DOS v7** - Production-ready DOS emulator
- Loaded from CDN: `https://v8.js-dos.com/v7/`

### Game Bundle
- Uses a pre-packaged `.jsdos` bundle from dos.zone CDN
- Contains DOOM shareware content

### Requirements
- Modern web browser with JavaScript enabled
- Internet connection (for loading CDN resources)
- ~10MB initial download

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
├── index.html    # Main game page with JS-DOS integration
└── README.md     # This file
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
Edit `index.html` and modify the bundle URL:
```javascript
dosInstance = await Dos(jsdosContainer).run("YOUR_BUNDLE_URL.jsdos");
```

### Styling
All styles are inline in `index.html`. Modify the `<style>` section to customize:
- Colors (uses Crimson Lantern Studios branding)
- Layout and sizing
- Button styles
- Fullscreen behavior

### Adding Save States
JS-DOS v7 supports save states. To enable:
```javascript
// Save
const state = await dosInstance.persist();

// Load
await dosInstance.restore(state);
```

## 📜 Legal

- **JS-DOS:** MIT License - https://js-dos.com
- **Freedoom:** GNU GPL - https://freedoom.github.io
- **DOOM trademark:** id Software / Bethesda Softworks
- This project is not affiliated with id Software or Bethesda

## 🐛 Troubleshooting

### Game Won't Load
1. Check internet connection (CDN resources required)
2. Try a different browser
3. Clear browser cache
4. Check browser console for errors

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
- [JS-DOS v7 API](https://js-dos.com/v7/build/)
- [Freedoom Project](https://freedoom.github.io/)
- [DOOM Wiki](https://doom.fandom.com/)

---

Built for Crimson Lantern Studios
