# Windows Disk Images for v86 Emulator

This directory holds bootable Windows disk images used by the v86 browser-based x86 emulator.

## Status

**The disk image `win98-gta2.img` has not been created yet.** It must be built manually on a machine with a graphical desktop (the Windows 98 installer requires interactive GUI input and cannot be automated headlessly).

Git LFS is configured (see `.gitattributes` in the repo root) to track `*.img` and `*.img.zst` files in this directory.

## Required Image: `win98-gta2.img`

A flat (raw) hard disk image containing a minimal Windows 98 SE installation with GTA 2 pre-installed.

### Specifications

| Property | Value |
|---|---|
| Format | Raw / flat disk image (`.img`) |
| Target size | 150–300 MB (smaller is better) |
| OS | Windows 98 Second Edition |
| Pre-installed game | Grand Theft Auto 2 (freeware) |
| Resolution | 800×600, 256-color or 16-bit |
| Boot behavior | Should boot to desktop; GTA 2 launchable from desktop shortcut or Start Menu |

### How to Create the Image

> **Requirements:** A machine with a graphical desktop environment, QEMU installed, and a Windows 98 SE ISO.

#### 1. Install QEMU

```bash
# Ubuntu/Debian
sudo apt install qemu-system-x86 qemu-utils

# macOS (Homebrew)
brew install qemu

# Windows (via MSYS2 or Chocolatey)
choco install qemu
```

#### 2. Create a blank disk image (256 MB)

```bash
qemu-img create -f raw win98-gta2.img 256M
```

#### 3. Install Windows 98 SE

You need a Windows 98 SE ISO. Sources:
- WinWorldPC: https://winworldpc.com/product/windows-98/98-second-edition
- Archive.org: search "Windows 98 SE ISO"

Run the installer in QEMU (requires a graphical desktop for the interactive setup):
```bash
qemu-system-i386 -m 128 -M pc,acpi=off -hda win98-gta2.img -cdrom win98se.iso -boot d -device sb16
```

Follow the v86 project's Windows 9x installation guide for troubleshooting:
https://github.com/copy/v86/blob/master/docs/windows-9x.md

Key notes:
- Use 128 MB RAM
- Disable ACPI (`-M pc,acpi=off`) for v86 compatibility
- Install minimal components (skip optional accessories, tools, etc.)
- Set display to 800×600

#### 4. Optimize the Windows 98 installation

After installing Windows 98, boot the image and:
- Disable screen saver (Display Properties → Screen Saver → None)
- Disable Active Desktop
- Set desktop wallpaper to solid black
- Remove unnecessary startup programs (Start → Run → `msconfig`)
- Delete Windows help files, wallpapers, screensavers from `C:\WINDOWS\`
- Delete `C:\WINDOWS\WIN386.SWP` (swap file) — it gets recreated on boot
- Clear `C:\WINDOWS\TEMP\`

#### 5. Install GTA 2 freeware

GTA 2 was officially released as freeware by Rockstar Games via their "Rockstar Classics" program.

Source the freeware installer:
- Archive.org: search "GTA2 freeware Rockstar" at https://archive.org
- Original URL (now defunct): https://www.rockstargames.com/classics/

Transfer the installer into the VM using a secondary ISO:
```bash
# Create an ISO with the GTA 2 installer
genisoimage -o gta2-installer.iso -J -r /path/to/gta2-setup-files/

# Boot the VM with the installer ISO as a CD-ROM
qemu-system-i386 -m 128 -M pc,acpi=off -hda win98-gta2.img -cdrom gta2-installer.iso -device sb16
```

Inside the VM:
- Run the GTA 2 installer from the CD-ROM drive
- Create a desktop shortcut to `GTA2.exe`
- (Optional) Add a shortcut to the Startup folder for auto-launch
- Test that the game launches successfully

#### 6. Compact the image

Inside the VM, zero-fill free space (makes compression much more effective).

From the host system after shutting down the VM:
```bash
# Mount the image and zero-fill free space from Linux
sudo modprobe nbd max_part=8
sudo qemu-nbd --connect=/dev/nbd0 win98-gta2.img
sudo zerofree /dev/nbd0p1   # install zerofree: sudo apt install zerofree
sudo qemu-nbd --disconnect /dev/nbd0
```

Alternatively, inside Windows 98, download and use SDelete from Sysinternals:
```bat
sdelete -z C:
```

#### 7. Compress with Zstandard (optional, recommended)

```bash
zstd --ultra -22 win98-gta2.img -o win98-gta2.img.zst
```

Note: If using a `.zst` compressed image, the player template currently downloads and decompresses the full image. Update the `diskImage` field in `src/data/win-games.json` to use the `.zst` filename.

#### 8. Place the final image

Copy the image to this directory:
```
public/games/win-images/win98-gta2.img
```

Then commit with Git LFS (already configured in `.gitattributes`):
```bash
git add public/games/win-images/win98-gta2.img
git commit -m "Add Win98 + GTA2 disk image via LFS"
```

### Alternative: External Hosting

If the image is too large for Git LFS or GitHub Pages, host it externally:

1. Upload to a CDN (Cloudflare R2, AWS S3, etc.)
2. Ensure CORS is enabled: `Access-Control-Allow-Origin: *`
3. Update `src/data/win-games.json` — set the `diskImageUrl` field:
   ```json
   {
     "diskImageUrl": "https://your-cdn.example.com/win98-gta2.img",
     "diskImageSize": 268435456
   }
   ```
4. The player template automatically uses `diskImageUrl` when set

### v86 Compatibility Notes

- v86 expects **raw/flat disk images** (not VMDK, VDI, QCOW2, etc.)
- The emulator maps the image as the primary hard drive (HDA)
- Windows 98 SE works best with v86; Windows 95 also works but has fewer driver options
- Set memory to 128 MB in the emulator config for best Win98 compatibility
- Use `-M pc,acpi=off` during QEMU installation for v86 compatibility
- See the full v86 Windows 9x guide: https://github.com/copy/v86/blob/master/docs/windows-9x.md

### Testing the Image

Test locally with QEMU before deploying:
```bash
qemu-system-i386 -m 128 -M pc,acpi=off -hda win98-gta2.img
```

The image should:
1. Boot to Windows 98 desktop without user intervention
2. Have a GTA 2 shortcut on the desktop or in the Start Menu
3. Launch GTA 2 successfully when the shortcut is double-clicked

Test in the browser:
```bash
cd /path/to/repo
npm run dev
# Navigate to http://localhost:4321/arcade/win-play/gta2
```
