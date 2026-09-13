/* ==========================================================================
   YOU & ME — 3D Chat Application
   Configuration & Initial Demo Seed Data
   "Connect. Chat. Share. Together." | Made by Sakcham ❤️
   ========================================================================== */

export const APP_CONFIG = {
  name: "You & Me",
  tagline: "Connect. Chat. Share. Together.",
  creatorSignature: "Made by Sakcham ❤️",
  version: "1.0.0",
  storagePrefix: "ym_3d_",
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

export const INITIAL_DEMO_CONVERSATIONS = [
  {
    conversationId: "conv-alex",
    participants: ["CURRENT_USER", "YM-482913"],
    createdAt: "2026-09-10T10:00:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "msg-101",
        senderId: "YM-482913",
        type: "text",
        text: "Hey! Welcome to You & Me 🚀 The 3D atmosphere here feels unbelievable!",
        timestamp: "2026-09-13T18:20:00Z",
        status: "read",
        reactions: [{ emoji: "❤️", userIds: ["CURRENT_USER"] }]
      },
      {
        id: "msg-102",
        senderId: "CURRENT_USER",
        type: "text",
        text: "I love the floating particles and depth! How are you doing today?",
        timestamp: "2026-09-13T18:22:00Z",
        status: "read",
        reactions: [{ emoji: "🔥", userIds: ["YM-482913"] }]
      },
      {
        id: "msg-103",
        senderId: "YM-482913",
        type: "image",
        mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
        caption: "Check out the starry night view from the hill tonight! 🌌",
        timestamp: "2026-09-13T18:24:00Z",
        status: "read",
        reactions: [{ emoji: "😮", userIds: ["CURRENT_USER"] }, { emoji: "❤️", userIds: ["CURRENT_USER"] }]
      },
      {
        id: "msg-104",
        senderId: "YM-482913",
        type: "text",
        text: "Let me know what you think of the new 3D theme! ✨",
        timestamp: "2026-09-13T18:25:00Z",
        status: "delivered",
        reactions: []
      }
    ]
  },
  {
    conversationId: "conv-emma",
    participants: ["CURRENT_USER", "YM-773104"],
    createdAt: "2026-09-11T14:00:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "msg-201",
        senderId: "YM-773104",
        type: "text",
        text: "Hey there! Are we still catching up this evening? ☕",
        timestamp: "2026-09-13T16:10:00Z",
        status: "read",
        reactions: [{ emoji: "👍", userIds: ["CURRENT_USER"] }]
      },
      {
        id: "msg-202",
        senderId: "CURRENT_USER",
        type: "text",
        text: "Yes, definitely! Let's meet at 7 PM.",
        timestamp: "2026-09-13T16:15:00Z",
        status: "read",
        reactions: []
      },
      {
        id: "msg-203",
        senderId: "YM-773104",
        type: "text",
        text: "Perfect! See you soon 🥰",
        timestamp: "2026-09-13T16:16:00Z",
        status: "read",
        reactions: [{ emoji: "❤️", userIds: ["CURRENT_USER"] }]
      }
    ]
  }
];

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
