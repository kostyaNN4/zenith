<div align="center">

  <h1>ZENITH · Personal Music Studio</h1>
  <p><strong>Your private local music club & customizable audio studio.</strong></p>
  <p><em>No accounts. No ads. No clouds. Just you, your music, and your own rhythm.</em></p>

</div>

---

## 🎧 About ZENITH

**ZENITH** is a standalone, high-performance desktop music player and live creative workspace designed to run entirely on your device. Built with native web technologies and Electron, ZENITH focuses on absolute privacy, fluid customization, and studio-grade audio processing without relying on online catalogs, streaming subscriptions, or external servers.

---

## ✨ Key Features

### 🔒 100% Local & Private
* **Zero Telemetry & Cloud:** Your music library, metadata, cover art, playlists, and layout arrangements stay safely on your local device (powered by IndexedDB).
* **Wide Format Support:** Seamlessly import and play **MP3, FLAC, WAV, OGG, Opus, M4A, AAC, AIF, and WebM** files or entire folders via drag-and-drop.
* **Automatic Metadata & Cover Parsing:** Automatically reads embedded ID3/FLAC tags and album art.

### 🎛️ Movable Modular Panels & Giga-Custom Studio
* **Free Workspace Canvas:** Drag any panel header to dock it Left, Right, Top, Bottom, or let it float freely as a resizable desktop window.
* **8 Custom Widgets:** Add specialized panels for the Live Spectrum, 8-Band Equalizer, Up-Next Queue, Notepad, Quick Actions, Album Art, or Personal Photos.
* **8 Workspace Presets:** Instantly switch between layouts like *Listening Desk, Studio, Focus, DJ Booth, Vinyl Lounge, and Cockpit Pro*.
* **Advanced Giga-Customization:** Fine-tune window gaps, border thickness, glass blur, and individual 4-corner radiuses, or inject live custom CSS.

### 🔊 Studio Audio Engine
* **8-Band Equalizer & Presets:** Shape your sound with built-in presets (*Flat, Bass, Warm, Vocal, Bright*) or custom filter bands.
* **Professional Audio Tools:** Includes preamp control, stereo balance, mono mode, peak limiter to prevent clipping, and adjustable playback speed (0.5×–2.0×).
* **8 Real-Time Spectrum Visualizers:** Choose from *Rounded Bars, Dot Matrix, Wave, Mirror, Ring, Orbit, Ribbon, or Landscape* with tunable sensitivity and color gradients.

### 🎨 Themes & Custom Backgrounds
* **Fluid Liquid Theme Transition:** Switch smoothly between Light, Dark, or System themes with an expressive wave animation.
* **Custom Backdrops & Photos:** Upload your own background images or animated GIFs for the window or individual panels with adjustable blur and shade control.
* **24 Built-in Palettes & Theme Builder:** Explore geek, neon, and cozy color schemes or create and export your own saved themes.

### 🌐 Over-the-Air (OTA) Auto-Updates & Multi-Language
* **Seamless Updates:** Check for updates and install new versions directly inside the app with a single click via GitHub Releases.
* **Multilingual Changelog:** Built-in localized update modal that automatically pulls release notes matching your chosen language.
* **12 Supported Languages:** Fully localized in English, Russian, Ukrainian, German, French, Spanish, Portuguese, Italian, Polish, Turkish, Japanese, and Chinese.

---

## 🚀 Getting Started

### For Users
1. Download the latest `zenith Setup x.x.x.exe` from the **Releases** section.
2. Run the installer — it will automatically set up the application and create shortcuts.
3. Drop your music files or folders into the window and start listening!

### For Developers (Running from Source)
```bash
# Clone the repository
git clone [https://github.com/kostyaNN4/zenith.git](https://github.com/kostyaNN4/zenith.git)

# Navigate to the project folder
cd zenith

# Install dependencies
npm install

# Run in development mode
npm start

# Build Windows installer (.exe)
npm run dist
