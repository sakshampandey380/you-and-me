/* ==========================================================================
   YOU & ME — 3D Chat Application
   Centralized Storage Service & LocalStorage User Database
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { APP_CONFIG } from '../config.js';

export const APP_DATA_VERSION = "2.0";

class StorageService {
  constructor() {
    this.prefix = APP_CONFIG.storagePrefix;
    this.memoryStore = {};
    this.dataVersion = APP_DATA_VERSION;
    this.init();
  }

  init() {
    this._runDataMigration();

    // Ensure central database structures exist
    if (!this.get('app_users')) {
      this.set('app_users', []);
    }
    if (!this.get('app_friendships')) {
      this.set('app_friendships', []);
    }
    if (!this.get('app_friend_requests')) {
      this.set('app_friend_requests', []);
    }
    if (!this.get('app_conversations')) {
      this.set('app_conversations', []);
    }
    if (!this.get('app_notifications')) {
      this.set('app_notifications', []);
    }
    if (!this.get('app_settings')) {
      this.set('app_settings', {
        theme: "dark",
        depthIntensity: 1,
        soundEnabled: true,
        enterToSend: true,
        privacyLastSeen: true,
        privacyOnline: true,
        language: "English"
      });
    }

    // Cross-tab sync listener via Storage events
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key) {
          const rawKey = e.key.startsWith(this.prefix) ? e.key.replace(this.prefix, '') : e.key;
          const canonical = this._normalizeKey(rawKey);
          window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: canonical } }));
          if (canonical === 'app_users' || canonical === 'app_friendships' || canonical === 'app_friend_requests') {
            window.dispatchEvent(new CustomEvent('ym:friends_updated'));
          }
        }
      });
    }

    // Real-Time Cross-Window Broadcast Bus
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastBus = new BroadcastChannel('ym_storage_bus');
        this.broadcastBus.onmessage = (e) => {
          if (e.data && e.data.type === 'STORAGE_SET') {
            const { key, value } = e.data;
            const canonical = this._normalizeKey(key);
            this.memoryStore[canonical] = value;
            try {
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem(canonical, JSON.stringify(value));
              }
            } catch (err) {}
            window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: canonical } }));
            if (canonical === 'app_users' || canonical === 'app_friendships' || canonical === 'app_friend_requests') {
              window.dispatchEvent(new CustomEvent('ym:friends_updated'));
            }
          }
        };
      } catch (e) {}
    }
  }

  _runDataMigration() {
    try {
      if (typeof localStorage === 'undefined') return;

      const storedVersion = localStorage.getItem('app_data_version') || localStorage.getItem(this.prefix + 'data_version');

      // First run of Version 2.0: Clean purge of old demo accounts & old mock data
      if (storedVersion !== APP_DATA_VERSION) {
        // List of legacy demo keys to purge
        const legacyKeys = [
          'ym_3d_conversations',
          'ym_3d_friendships',
          'ym_3d_notifications',
          'ym_temp_session',
          this.prefix + 'active_session',
          this.prefix + 'conversations',
          this.prefix + 'friendships',
          this.prefix + 'notifications',
          this.prefix + 'users',
          'active_session',
          'app_current_user'
        ];

        legacyKeys.forEach(k => {
          try { localStorage.removeItem(k); } catch (e) {}
        });

        // Initialize fresh v2.0 database structures
        localStorage.setItem('app_data_version', APP_DATA_VERSION);
        localStorage.setItem('app_users', JSON.stringify([]));
        localStorage.setItem('app_friendships', JSON.stringify([]));
        localStorage.setItem('app_friend_requests', JSON.stringify([]));
        localStorage.setItem('app_conversations', JSON.stringify([]));
        localStorage.setItem('app_notifications', JSON.stringify([]));
        return;
      }

      // Hard check: Ensure NO hardcoded demo users (alex, emma, arjun, sophia, daniel, YM-482913, etc.) exist in app_users
      const DEMO_USER_IDS = ['YM-482913', 'YM-773104', 'YM-519280', 'YM-628491', 'YM-304918'];
      const DEMO_USERNAMES = ['alex', 'emma', 'arjun', 'sophia', 'daniel'];

      const rawUsers = localStorage.getItem('app_users') || localStorage.getItem(this.prefix + 'users');
      if (rawUsers) {
        try {
          const parsedUsers = JSON.parse(rawUsers);
          if (Array.isArray(parsedUsers)) {
            const cleanUsers = parsedUsers.filter(u => {
              if (!u) return false;
              const uid = String(u.uid || u.userId || '').toUpperCase();
              const uname = String(u.username || '').toLowerCase();
              if (DEMO_USER_IDS.includes(uid)) return false;
              if (DEMO_USERNAMES.includes(uname)) return false;
              if (String(u.name || '').toLowerCase().startsWith('member (ym-')) return false;
              return true;
            });
            if (cleanUsers.length !== parsedUsers.length) {
              localStorage.setItem('app_users', JSON.stringify(cleanUsers));
            }
          }
        } catch (e) {}
      }
    } catch (e) {
      console.warn('[Storage] Migration warning:', e);
    }
  }

  _normalizeKey(key) {
    const map = {
      'users': 'app_users',
      'friendships': 'app_friendships',
      'friend_requests': 'app_friend_requests',
      'conversations': 'app_conversations',
      'notifications': 'app_notifications',
      'active_session': 'app_current_user',
      'current_user': 'app_current_user',
      'settings': 'app_settings',
      'data_version': 'app_data_version'
    };
    return map[key] || key;
  }

  get(key) {
    const canonical = this._normalizeKey(key);
    try {
      if (typeof localStorage !== 'undefined') {
        // Try canonical key first, then fallback to prefixed key
        let raw = localStorage.getItem(canonical);
        if (raw === null && this.prefix) {
          raw = localStorage.getItem(this.prefix + key);
        }
        if (raw !== null) {
          const parsed = JSON.parse(raw);
          this.memoryStore[canonical] = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn(`[Storage] Read error for ${key}:`, e);
    }
    return this.memoryStore[canonical] ? JSON.parse(JSON.stringify(this.memoryStore[canonical])) : null;
  }

  set(key, value) {
    const canonical = this._normalizeKey(key);
    this.memoryStore[canonical] = value;
    const serialized = JSON.stringify(value);

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(canonical, serialized);
        // Also keep prefixed key in sync for backward compatibility
        if (this.prefix && canonical !== key) {
          try { localStorage.setItem(this.prefix + key, serialized); } catch (e) {}
        }
      }
    } catch (e) {
      console.error(`[Storage] Write error for ${key}:`, e);
      if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
        throw new Error("This file is too large to store locally.");
      }
      throw e;
    }

    // Broadcast across windows/tabs
    if (this.broadcastBus) {
      try {
        this.broadcastBus.postMessage({ type: 'STORAGE_SET', key: canonical, value });
      } catch (e) {}
    }

    return true;
  }

  remove(key) {
    const canonical = this._normalizeKey(key);
    delete this.memoryStore[canonical];
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(canonical);
        if (this.prefix) {
          localStorage.removeItem(this.prefix + key);
        }
      }
    } catch (e) {}
    return true;
  }

  // High-level User Database helper methods
  getUsers() {
    return this.get('app_users') || [];
  }

  saveUsers(users) {
    return this.set('app_users', users);
  }

  getCurrentUser() {
    return this.get('app_current_user');
  }

  getUserByUid(uid) {
    if (!uid) return null;
    const clean = String(uid).trim().toUpperCase();
    const cleanDigits = clean.replace(/[^0-9]/g, '');
    const users = this.getUsers();

    return users.find(u => {
      if (!u) return false;
      const targetUid = String(u.uid || u.userId || '').toUpperCase();
      const targetDigits = targetUid.replace(/[^0-9]/g, '');
      return (
        targetUid === clean ||
        targetUid === ('SK-' + clean) ||
        targetUid === ('YM-' + clean) ||
        (cleanDigits.length >= 6 && targetDigits === cleanDigits)
      );
    }) || null;
  }

  getFriends(uid) {
    const targetUid = uid || (this.getCurrentUser() ? this.getCurrentUser().uid || this.getCurrentUser().userId : null);
    if (!targetUid) return [];

    const friendships = this.get('app_friendships') || [];
    const friendUids = [];

    friendships.forEach(f => {
      if (f.status === 'accepted') {
        const u1 = f.user1 || f.user1Id;
        const u2 = f.user2 || f.user2Id;
        if (u1 === targetUid) friendUids.push(u2);
        else if (u2 === targetUid) friendUids.push(u1);
      }
    });

    return friendUids.map(id => this.getUserByUid(id)).filter(Boolean);
  }

  getFriendRequests(uid) {
    const targetUid = uid || (this.getCurrentUser() ? this.getCurrentUser().uid || this.getCurrentUser().userId : null);
    if (!targetUid) return [];

    const requests = this.get('app_friend_requests') || [];
    return requests.filter(r => (r.to === targetUid || r.receiverId === targetUid) && r.status === 'pending');
  }

  clearAll() {
    this.memoryStore = {};
    try {
      if (typeof localStorage !== 'undefined') {
        ['app_users', 'app_friendships', 'app_friend_requests', 'app_conversations', 'app_notifications', 'app_current_user', 'app_settings'].forEach(k => {
          localStorage.removeItem(k);
          localStorage.removeItem(this.prefix + k);
        });
      }
    } catch (e) {}
    this.init();
    return true;
  }
}

export const storage = new StorageService();
