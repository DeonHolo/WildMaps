<div align="center">
  <h1>WildMaps</h1>
  
  <p>
    <strong>An interactive, AI-powered campus exploration game built for CIT-U.</strong>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#how-to-play">How to Play</a> •
    <a href="#installation">Installation</a>
  </p>
</div>

---

## ✨ Overview

**WildMaps** is a gamified Progressive Web App (PWA) designed to encourage students to explore the CIT-U campus. By combining interactive maps with on-device Machine Learning (TensorFlow.js), players can physically visit campus landmarks, scan them using their device's camera, and unlock location-based badges and ranks.

Developed with a striking **Neo-Brutalist** design aesthetic, fluid animations, and custom audio feedback, WildMaps delivers a highly polished, app-like experience directly in the mobile browser.

## 🚀 Features

- **📷 AI-Powered Scanning Engine**: Uses `@tensorflow/tfjs` and a **Custom Google Teachable Machine Model** to recognize campus landmarks through the device camera entirely on-device (zero server-side processing for maximum privacy).
- **🗺️ Interactive Campus Map**: Custom interactive map implementation using `react-zoom-pan-pinch` for smooth panning and zooming.
- **🏆 Gamified Progression System**: Players earn ranks (from *Novice Tourist* to *Grandmaster Guide*), unlock badges, and track their discovery timestamps.
- **🎨 Neo-Brutalist UI & Animations**: Distinctive, high-contrast UI paired with fluid, physical gesture animations using `GSAP` and `Framer Motion`.
- **🎵 Bespoke Audio Engine**: Custom Web Audio API implementation for subtle, non-intrusive UI sound effects (clicks, success chimes, scanning feedback).
- **📱 PWA Ready**: Fully installable as a Progressive Web App for an immersive, full-screen offline-capable experience.

## 💻 Tech Stack

**Frontend Framework:**
- React 19
- TypeScript
- Vite

**Styling & UI:**
- TailwindCSS v4
- Lucide React (Icons)
- clsx & tailwind-merge

**Animations & Audio:**
- GSAP (GreenSock)
- Motion
- React Confetti
- Custom Web Audio API Synthesizer

**Machine Learning & APIs:**
- TensorFlow.js
- Custom Google Teachable Machine Model
- Web Share API
- LocalStorage Data Persistence

---

## 🎮 How to Play

1. **Open the Map**: Locate the hidden landmark zones on the CIT-U campus map.
2. **Go to the Location**: Physically walk to the real-world location.
3. **Scan the Landmark**: Open the camera tab and point it at the landmark. The AI model will verify your location.
4. **Collect Badges**: Earn badges for every landmark found and level up your Explorer Rank!

---

## 🛠️ Installation & Setup

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/wildmaps.git
   cd wildmaps
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

<div align="center">
  <p>Built with ❤️ by Deon Holo</p>
</div>
