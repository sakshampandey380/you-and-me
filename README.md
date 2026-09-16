# You & Me — 3D Chat Application

## *"Connect. Chat. Share. Together."*

### **Made by Saksham ❤️**

![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![Platform](https://img.shields.io/badge/Architecture-Plain%20JavaScript%20(ES%20Modules)-8a3ffc)
![Theme](https://img.shields.io/badge/3D%20Experience-Dark%20%26%20Light%20Glass-ff3366)

---

## 🌟 Overview

**“You & Me”** is a complete, polished, mobile-first 3D chatting web application built from the ground up using modern **HTML5, CSS3, and Plain Vanilla JavaScript (ES Modules)** — with zero dependencies on React, Vue, Angular, or TypeScript.

It brings a breathtaking romantic and futuristic 3D aesthetic to modern messaging with interactive canvas scenes, floating 3D spheres, parallax depth, glassmorphism, rich media handling, and simulated realtime interaction.

---

## 🚀 Easy Vercel Deployment

Because **You & Me** is built with zero-build plain JavaScript and static assets, it deploys directly onto **Vercel** in seconds:

### Option A: Import via Git (Easiest)

1. Push this folder to a GitHub, GitLab, or Bitbucket repository.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **Import Project** and select your repository.
4. Leave all build settings as default (Framework Preset: **Other**, Build Command: empty).
5. Click **Deploy** — your live 3D chat application will be live immediately!

### Option B: Deploy via Vercel CLI

```bash
# In the project directory:
npx vercel
```

---

## 💻 Running Locally

To run the application locally on any computer:

### Using Python

```bash
python -m http.server 3000
```

Then open `http://localhost:3000` in your browser.

### Using Node.js

```bash
npx serve .
```

### Using VS Code

Right-click `index.html` and select **Open with Live Server**.

---

## ✨ Features

### 1. 3D Romantic Atmosphere & Visual Identity

* **Romantic 3D Auth Scene**: A couple sitting on a park bench under a softly glowing streetlamp, crescent moon, twinkling stars, gentle fireflies, and 3D floating glowing hearts drifting in spatial depth.
* **Continuous 3D Spatial Canvas**: Floating translucent spheres, connected communication network nodes, and responsive mouse/touch parallax.
* **3D Glassmorphism**: Layered glass cards (`backdrop-filter: blur`), dynamic ambient lighting, and subtle 3D hover elevations.
* **Theme System**: Seamless toggle between **Dark 3D Theme** (deep space glass) and **Light 3D Theme** (crystalline frosted glass), with a real-time **3D Depth Intensity Slider**.
* **Creator Signature**: Permanent, elegant **“Made by Saksham ❤️”** glass signature with gently pulsing heart, placed responsively across desktop and mobile screens.

### 2. Authentication & User Model

* **Sign Up**: Full Name, Username, Email, Password, Confirm Password, and custom Profile Picture uploader.
* **Unique User ID**: Automatically generates a unique ID (e.g. `YM-482913`).
* **Log In**: Quick login with email/username/ID, and remember me checkbox.
* **Session Management**: Persistent LocalStorage with session isolation.

### 3. Friends & Connection System

* **Global User Search**: Instant search by Name, Username, or `YM-` User ID.
* **Friend Requests**: Send, cancel, accept, or reject friend requests with live counter badges.
* **Friends List**: View connected friends, start private chats, view profile cards, or remove friends.

### 4. Advanced Messaging & 3D Chat

* **3D Message Bubbles**: Incoming glass bubbles vs outgoing rose-purple glowing bubbles with timestamps, edited tags, and delivery status checkmarks (`✓`, `✓✓`, `✓✓ Read`).
* **Interactive Realtime Simulation**:
  * Automatically updates message delivery progression (`sent` -> `delivered` -> `read`).
  * Active conversation typing indicators with animated bouncing dots.
  * Contextual friendly auto-replies when messaging demo friends.
* **Rich Media Handling**:
  * **Photos/Images**: In-chat rendering with pre-send confirmation preview, caption support, and full-screen 3D lightbox viewer (zoom, download, close).
  * **Videos**: Responsive video player with custom controls and full-screen viewer.
  * **Documents/Files**: PDF, DOCX, ZIP, TXT attachments with file icons, file size, and direct downloads.
* **Emoji Picker**: Categorized emojis (Love & Romance, Smileys, Gestures, Vibes) with instant search. Emoji-only messages get special enlarged 3D visual treatment.
* **Message Context Menu**: Long-press / right-click to access quick reaction dock, Quoted Reply, Copy Text, Delete for me, or Delete for everyone.
* **Reactions**: Add or toggle reactions (`❤️`, `😂`, `👍`, `😮`, `😢`, `🔥`, `👏`) with animated pills.
* **Quoted Replies**: Tap a quoted message to smoothly scroll directly to the original message.
* **In-Chat Search**: Live search with highlighted match navigation.

### 5. Notifications & Sound

* **Web Audio API Sound Engine**: Zero-asset, synthesized futuristic chime notifications for sends, incoming messages, and alerts.
* **Notification Center**: Slide-out tray with unread counters, mark all as read, and toast popups.

### 6. Mobile-First Architecture

* Fluid responsive drawer & mobile bottom navigation bar (`Chats`, `Friends`, `Profile`, `Settings`).
* Thumb-friendly composer that avoids mobile keyboard issues.
* The creator signature adapts responsively to the bottom of scrollable views and is never placed inside the active message input.

---

## 📁 Project Structure

```text
you-and-me/
├── index.html                  # Master Single Page Application structure
├── vercel.json                 # Vercel zero-build static hosting configuration
├── README.md                   # Documentation and deployment guide
├── css/
│   ├── variables.css           # 3D Design tokens, colors, glassmorphism, depths
│   ├── base.css                # Typography, reset, 3D scrollbars
│   ├── animations.css          # Keyframes: pulsing hearts, 3D rotations, floating
│   ├── background3d.css        # Canvas and spatial glow positioning
│   ├── components.css          # 3D buttons, cards, modals, toasts, creator signature
│   ├── auth.css                # 3D login/signup layout and glass card
│   ├── chat.css                # 3D message bubbles, composer, reactions, emoji picker
│   └── responsive.css          # Mobile-first drawer, bottom nav, media queries (320px - 1920px)
└── js/
    ├── config.js               # App constants, branding, demo users seed
    ├── app.js                  # Master application orchestrator and router
    ├── services/
    │   ├── storage.js          # LocalStorage persistence and demo data initialization
    │   ├── sound.js            # Web Audio API futuristic soft chimes
    │   ├── auth.js             # Registration, login, session, unique ID generator
    │   ├── user.js             # User profiles, search by name/handle/ID
    │   ├── friend.js           # Friend requests (send/cancel/accept/reject), friends list
    │   ├── chat.js             # Conversations, messages, media, reactions, replies, search
    │   ├── realtime.js         # Simulated realtime engine (typing, auto-replies, read receipts)
    │   └── notification.js     # Notification center, badge counting, toasts
    ├── components/
    │   ├── romanticScene.js    # Canvas 3D scene: couple on bench under streetlamp with flying hearts
    │   ├── background3d.js     # Canvas 3D background with floating spheres & connecting nodes
    │   ├── ui3d.js             # 3D card tilt & magnetic interactions
    │   ├── toast.js            # 3D glass toast alerts
    │   ├── modal.js            # 3D confirmation dialogs
    │   ├── emojiPicker.js      # Categorized emoji picker with live search
    │   ├── mediaViewer.js      # Fullscreen 3D media lightbox
    │   └── mediaPreview.js     # Pre-send attachment preview modal
    └── views/
        ├── authView.js         # Authentication view controller
        ├── chatView.js         # Active conversation view controller
        ├── chatListView.js     # Conversations list view controller
        ├── friendsView.js      # Friends & requests view controller
        ├── profileView.js      # 3D Profile card view controller
        ├── settingsView.js     # Settings & appearance view controller
        └── notificationsView.js# In-app notifications view controller
```

---

## 🔒 Security & Backend Readiness

* **Zero Vulnerabilities**: Client-side message escaping, safe file type handling, no inline `eval()`.
* **Clean Abstraction**: All services (`AuthService`, `ChatService`, `RealtimeService`, `FriendService`) are structured with pure asynchronous/event-driven contracts, ready to plug directly into WebSocket endpoints (`wss://`) and REST/GraphQL backends without changing the frontend interface.

---

## 💖 Signature

**Made by Saksham ❤️**  
*“Connect. Chat. Share. Together.”*
