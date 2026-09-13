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
    this._migrateLegacyStorage();

    // Seed users if empty
    if (!this.get('users')) {
      this.set('users', INITIAL_DEMO_USERS);
    }

    // Seed friendships (empty clean state)
    if (!this.get('friendships')) {
      this.set('friendships', []);
    }

    // Seed conversations if empty (empty clean state)
    if (!this.get('conversations')) {
      this.set('conversations', []);
    }

    // Seed notifications if empty (empty clean state)
    if (!this.get('notifications')) {
      this.set('notifications', []);
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

  _migrateLegacyStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        ['ym_3d_conversations', 'ym_3d_friendships', 'ym_3d_notifications'].forEach(k => {
          localStorage.removeItem(k);
        });
      }
    } catch (e) {
      // Ignore
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
