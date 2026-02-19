# Windows Disk Images for v86 Emulator

This directory holds bootable Windows disk images used by the v86 browser-based x86 emulator.

## Required Image: `win98-gta2.img`

A flat (raw) hard disk image containing a minimal Windows 98 SE installation with GTA 2 pre-installed.

### Specifications

| Property | Value |
|---|---|
| Format | Raw / flat disk image (`.img`) |
| Target size | 150–200 MB (smaller is better) |
| OS | Windows 98 Second Edition |
| Pre-installed game | Grand Theft Auto 2 (freeware) |
| Resolution | 800×600, 256-color or 16-bit |
| Boot behavior | Should boot to desktop; GTA 2 launchable from desktop shortcut or Start Menu |

### How to Create the Image

1. **Install QEMU** (or another x86 virtualizer):
   ```bash
   # Ubuntu/Debian
   sudo apt install qemu-system-x86

   # macOS (Homebrew)
   brew install qemu
   ```

2. **Create a blank disk image** (256 MB is a good starting size):
   ```bash
   qemu-img create -f raw win98-gta2.img 256M
   ```

3. **Install Windows 98 SE** using a legitimate CD image:
   ```bash
   qemu-system-i386 -hda win98-gta2.img -cdrom win98se.iso -boot d -m 128
   ```
   - Use 128 MB RAM, Sound Blaster 16 compatible audio
   - Install minimal components (skip optional accessories, tools, etc.)
   - Set display to 800×600

4. **Install GTA 2 freeware**:
   - GTA 2 was officially released as freeware by Rockstar Games via their "Rockstar Classics" program
   - The freeware installer can be found on archive.org:
     - Search for "GTA2 freeware Rockstar" on https://archive.org
     - Original URL (defunct): https://www.rockstargames.com/classics/
   - Mount the GTA 2 installer ISO or files as a secondary drive in QEMU:
     ```bash
     qemu-system-i386 -hda win98-gta2.img -cdrom gta2-setup.iso -m 128
     ```
   - Install GTA 2 and create a desktop shortcut
   - Test that the game launches successfully

5. **Strip unnecessary files** to reduce image size:
   - Remove Windows help files, wallpapers, screensavers
   - Clear Temp folders
   - Remove setup/install caches
   - Run Disk Cleanup if available
   - Delete `WIN386.SWP` (swap file)

6. **Compact the image**:
   - Inside Windows, use a tool to zero-fill free space (e.g., `sdelete` or manually write zeros)
   - Then shrink the image:
     ```bash
     qemu-img convert -f raw -O raw win98-gta2.img win98-gta2-compact.img
     ```

7. **Place the final image** in this directory:
   ```
   public/games/win-images/win98-gta2.img
   ```

### GitHub File Size Limits

GitHub has a 100 MB per-file limit. If your image exceeds this:

**Option A — Git LFS:**
```bash
git lfs install
git lfs track "public/games/win-images/*.img"
git add .gitattributes
git add public/games/win-images/win98-gta2.img
git commit -m "Add Win98 + GTA2 disk image via LFS"
```

**Option B — External hosting:**
Host the image on a CDN, cloud storage, or other file host and update the image URL in `src/pages/arcade/win-play/[game].astro`. The v86 emulator supports loading disk images from arbitrary URLs:
```javascript
hda: { url: "https://your-cdn.example.com/win98-gta2.img", size: IMAGE_SIZE_BYTES }
```

When using an external URL, ensure the server sends proper CORS headers (`Access-Control-Allow-Origin: *`).

### v86 Compatibility Notes

- v86 expects **raw/flat disk images** (not VMDK, VDI, QCOW2, etc.)
- The emulator maps the image as the primary hard drive (HDA)
- v86 supports `async: true` for the disk image, which enables lazy-loading (chunks are fetched on demand rather than downloading the entire image upfront). This requires the server to support HTTP Range requests.
- Windows 98 SE works best with v86; Windows 95 also works but has fewer driver options
- Set memory to 128 MB in the emulator config for best Win98 compatibility

### Testing the Image

You can test the image locally with v86's demo page or with QEMU:
```bash
qemu-system-i386 -hda win98-gta2.img -m 128
```

The image should:
1. Boot to Windows 98 desktop without user intervention
2. Have a GTA 2 shortcut on the desktop or in the Start Menu
3. Launch GTA 2 successfully when the shortcut is double-clicked
