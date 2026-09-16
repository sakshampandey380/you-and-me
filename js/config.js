/* ==========================================================================
   YOU & ME — 3D Chat Application
   Configuration & Initial Seed Data
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

export const APP_CONFIG = {
  name: "You & Me",
  tagline: "Connect. Chat. Share. Together.",
  creatorSignature: "Made by Saksham ❤️",
  version: "2.0.0",
  dataVersion: "2.0",
  storagePrefix: "ym_3d_v2_",
  uniqueIdPrefix: "SK-",
  defaultAvatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%238a3ffc'/><stop offset='100%' stop-color='%23ff3366'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23g)'/><circle cx='50' cy='38' r='18' fill='%23ffffff' opacity='0.9'/><path d='M20,84 C20,64 35,58 50,58 C65,58 80,64 80,84 Z' fill='%23ffffff' opacity='0.9'/></svg>"
};

export const INITIAL_DEMO_USERS = [];

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
