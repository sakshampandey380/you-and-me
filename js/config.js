/* ==========================================================================
   YOU & ME — 3D Chat Application
   Configuration & Initial Demo Seed Data
   "Connect. Chat. Share. Together." | Made by Sakcham ❤️
   ========================================================================== */

export const APP_CONFIG = {
  name: "You & Me",
  tagline: "Connect. Chat. Share. Together.",
  creatorSignature: "Made by Sakcham ❤️",
  version: "2.0.0",
  storagePrefix: "ym_3d_v2_",
  uniqueIdPrefix: "YM-",
  defaultAvatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%238a3ffc'/><stop offset='100%' stop-color='%23ff3366'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23g)'/><circle cx='50' cy='38' r='18' fill='%23ffffff' opacity='0.9'/><path d='M20,84 C20,64 35,58 50,58 C65,58 80,64 80,84 Z' fill='%23ffffff' opacity='0.9'/></svg>"
};

export const INITIAL_DEMO_USERS = [
  {
    userId: "YM-482913",
    name: "Alex Rivera",
    username: "alex",
    email: "alex@youandme.app",
    password: "password123",
    bio: "Passionate photographer & stargazer ✨ Building the future of 3D spaces.",
    status: "Exploring new horizons 🌌",
    onlineStatus: "online",
    lastSeen: "Just now",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-01-10T10:00:00Z"
  },
  {
    userId: "YM-773104",
    name: "Emma Watson",
    username: "emma",
    email: "emma@youandme.app",
    password: "password123",
    bio: "Coffee enthusiast, UI designer & book lover ☕📖 Always here for deep talks.",
    status: "Lost in a good melody 🎧",
    onlineStatus: "online",
    lastSeen: "Just now",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-01-15T12:30:00Z"
  },
  {
    userId: "YM-519280",
    name: "Arjun Sharma",
    username: "arjun",
    email: "arjun@youandme.app",
    password: "password123",
    bio: "Tech explorer, rock climber & coder 🏔️ Let's connect and create together.",
    status: "Coding with passion 💻",
    onlineStatus: "offline",
    lastSeen: "15m ago",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-02-01T08:15:00Z"
  },
  {
    userId: "YM-628491",
    name: "Sophia Chen",
    username: "sophia",
    email: "sophia@youandme.app",
    password: "password123",
    bio: "Digital artist & sound designer 🎨 Dreaming in pastel gradients.",
    status: "Crafting 3D worlds 🔮",
    onlineStatus: "online",
    lastSeen: "Just now",
    profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-02-14T14:00:00Z"
  },
  {
    userId: "YM-304918",
    name: "Daniel Brooks",
    username: "daniel",
    email: "daniel@youandme.app",
    password: "password123",
    bio: "Filmmaker & world traveler 🎥 Looking for stories that inspire.",
    status: "Editing on the go ✈️",
    onlineStatus: "offline",
    lastSeen: "2 hours ago",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-03-01T16:45:00Z"
  }
];

export const INITIAL_DEMO_CONVERSATIONS = [];

export const EMOJI_CATEGORIES = [
  {
    name: "Love & Romance",
    emojis: ["❤️", "💖", "💕", "💞", "💓", "💗", "💘", "💝", "💟", "💌", "🥰", "😘", "😍", "🌹", "✨", "💫", "🕊️", "💍"]
  },
  {
    name: "Smileys & Expressions",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😋", "😛", "😜", "🤪", "😎", "🤩", "🥳", "😏", "🥺", "😢", "😭", "😤", "😠", "🤯", "😳", "🤗", "🤔", "🤫", "😴"]
  },
  {
    name: "Gestures & Hands",
    emojis: ["👍", "👎", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✌️", "🤞", "🤟", "🤘", "👌", "🤌", "🤏", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤙", "💪"]
  },
  {
    name: "Vibes & Atmosphere",
    emojis: ["🔥", "⭐", "🌟", "🎉", "🎊", "🎈", "🍾", "🥂", "☕", "🍕", "🍰", "🍩", "🏖️", "🚀", "🌈", "☀️", "🌙", "🌌", "🎵", "🎶"]
  }
];
