/* ==========================================================================
   YOU & ME — 3D Chat Application
   Storage Service (LocalStorage abstraction with automated demo seed)
   ========================================================================== */

import { APP_CONFIG, INITIAL_DEMO_USERS, INITIAL_DEMO_CONVERSATIONS } from '../config.js';

class StorageService {
  constructor() {
    this.prefix = APP_CONFIG.storagePrefix;
    this.memoryStore = {};
    this.init();
  }

  init() {
    // Seed users if empty
    if (!this.get('users')) {
      this.set('users', INITIAL_DEMO_USERS);
    }

    // Seed friendships (current user initially has Alex and Emma as friends)
    if (!this.get('friendships')) {
      this.set('friendships', [
        { id: "f-1", user1: "CURRENT_USER", user2: "YM-482913", status: "accepted", createdAt: "2026-09-01T10:00:00Z" },
        { id: "f-2", user1: "CURRENT_USER", user2: "YM-773104", status: "accepted", createdAt: "2026-09-05T12:00:00Z" },
        { id: "f-3", user1: "YM-519280", user2: "CURRENT_USER", status: "pending", createdAt: "2026-09-13T14:30:00Z" } // Incoming request from Arjun!
      ]);
    }

    // Seed conversations if empty
    if (!this.get('conversations')) {
      this.set('conversations', INITIAL_DEMO_CONVERSATIONS);
    }

    // Seed notifications if empty
    if (!this.get('notifications')) {
      this.set('notifications', [
        {
          id: "notif-1",
          type: "friend_request",
          title: "New Friend Request",
          message: "Arjun Sharma sent you a friend request.",
          fromUserId: "YM-519280",
          timestamp: "2026-09-13T14:30:00Z",
          read: false
        },
        {
          id: "notif-2",
          type: "reaction",
          title: "New Reaction",
          message: "Emma reacted with ❤️ to your message.",
          fromUserId: "YM-773104",
          timestamp: "2026-09-13T16:16:00Z",
          read: true
        }
      ]);
    }

    // Seed settings if empty
    if (!this.get('settings')) {
      this.set('settings', {
        theme: "dark",
        depthIntensity: 1,
        soundEnabled: true,
        enterToSend: true,
        privacyLastSeen: true,
        privacyOnline: true
      });
    }
  }

  get(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(this.prefix + key);
        if (data) return JSON.parse(data);
      }
    } catch (e) {
      // Fall through to memoryStore
    }
    return this.memoryStore[key] ? JSON.parse(JSON.stringify(this.memoryStore[key])) : null;
  }

  set(key, value) {
    this.memoryStore[key] = value;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
        return true;
      }
    } catch (e) {
      // Silent fallback
    }
    return true;
  }

  remove(key) {
    delete this.memoryStore[key];
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.prefix + key);
        return true;
      }
    } catch (e) {
      // Silent fallback
    }
    return true;
  }

  clearAll() {
    this.memoryStore = {};
    try {
      if (typeof localStorage !== 'undefined') {
        Object.keys(localStorage)
          .filter(k => k.startsWith(this.prefix))
          .forEach(k => localStorage.removeItem(k));
      }
    } catch (e) {}
    this.init();
    return true;
  }
}

export const storage = new StorageService();
