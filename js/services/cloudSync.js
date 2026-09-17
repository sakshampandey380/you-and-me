/* ==========================================================================
   YOU & ME — 3D Chat Application
   Multi-Device Cloud Synchronization Engine
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { APP_CONFIG } from '../config.js';
import { storage } from './storage.js';
import { auth } from './auth.js';
import { toast } from '../components/toast.js';

class CloudSyncService {
  constructor() {
    this.isSyncing = false;
    this.lastSyncTime = null;
    this.pollInterval = null;
    this.syncEndpoint = this._resolveSyncEndpoint();
    this.init();
  }

  _resolveSyncEndpoint() {
    // 1. If explicit cloud sync URL configured in config.js
    if (APP_CONFIG.cloudSyncUrl) {
      return APP_CONFIG.cloudSyncUrl;
    }

    // 2. If running on Vercel deployment
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      if (window.location.origin.includes('vercel.app')) {
        return `${window.location.origin}/api/sync`;
      }
    }

    // 3. Fallback when testing locally on file:// or localhost: connect to live Vercel backend
    return 'https://you-and-me-zeta.vercel.app/api/sync';
  }

  init() {
    if (typeof window === 'undefined') return;

    // Check URL parameters for direct profile connections (e.g. ?connect=SK-XXXXX)
    this._handleUrlConnect();

    // Pull latest users on initial load
    setTimeout(() => {
      this.pullUsers();
      // Also broadcast current user if logged in
      const current = auth.getCurrentUser();
      if (current) {
        this.pushUser(current);
      }
    }, 1200);

    // Sync automatically on tab focus or visibility change
    window.addEventListener('focus', () => this.pullUsers());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.pullUsers();
      }
    });

    // Auto-poll cloud registry every 8 seconds
    this.pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.pullUsers();
      }
    }, 8000);
  }

  /**
   * Push a registered or updated user to the cloud registry
   */
  async pushUser(user) {
    if (!user || (!user.uid && !user.userId)) return;

    try {
      const endpoint = this._resolveSyncEndpoint();
      const payload = {
        uid: user.uid || user.userId,
        userId: user.uid || user.userId,
        name: user.name || user.displayName,
        username: user.username,
        email: user.email,
        dob: user.dob || user.birthday || '',
        language: user.language || 'English',
        bio: user.bio,
        status: user.status,
        avatar: user.avatar || user.profilePicture || APP_CONFIG.defaultAvatar
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        this.lastSyncTime = Date.now();
      }
    } catch (err) {
      // Offline fallback: purely silent, user is already saved locally
      console.warn('[CloudSync] Could not push user to cloud:', err.message);
    }
  }

  /**
   * Pull all registered users from the cloud and merge into LocalStorage
   */
  async pullUsers() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const endpoint = this._resolveSyncEndpoint();
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.users)) {
          this._mergeUsers(data.users);
          this.lastSyncTime = Date.now();
        }
      }
    } catch (err) {
      console.warn('[CloudSync] Could not pull users from cloud:', err.message);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Merge cloud users into local database without duplicate entries
   */
  _mergeUsers(cloudUsers) {
    if (!cloudUsers || cloudUsers.length === 0) return;

    const localUsers = storage.getUsers();
    let hasChanges = false;

    cloudUsers.forEach(cu => {
      if (!cu) return;
      const cUid = String(cu.uid || cu.userId || '').toUpperCase();
      const cUser = String(cu.username || '').toLowerCase();
      if (!cUid) return;

      const existingIndex = localUsers.findIndex(lu => {
        const lUid = String(lu.uid || lu.userId || '').toUpperCase();
        const lUser = String(lu.username || '').toLowerCase();
        return (lUid && lUid === cUid) || (lUser && lUser === cUser);
      });

      if (existingIndex === -1) {
        // New user found from other device!
        localUsers.push({
          uid: cUid,
          userId: cUid,
          name: cu.name || 'User',
          displayName: cu.displayName || cu.name || 'User',
          username: cu.username,
          email: cu.email || '',
          avatar: cu.avatar || cu.profilePicture || APP_CONFIG.defaultAvatar,
          profilePicture: cu.profilePicture || cu.avatar || APP_CONFIG.defaultAvatar,
          dob: cu.dob || cu.birthday || '',
          birthday: cu.birthday || cu.dob || '',
          language: cu.language || 'English',
          bio: cu.bio || 'Hey there! I am using You & Me 🚀',
          status: cu.status || 'Available for conversations ✨',
          onlineStatus: cu.onlineStatus || 'online',
          lastSeen: cu.lastSeen || 'Just now'
        });
        hasChanges = true;
      }
    });

    if (hasChanges) {
      storage.saveUsers(localUsers);
      window.dispatchEvent(new CustomEvent('ym:friends_updated'));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_users' } }));
    }
  }

  /**
   * Live lookup if a search query is not found in local cache
   */
  async searchOnline(query) {
    if (!query) return [];
    await this.pullUsers();
    return storage.getUsers();
  }

  /**
   * Handle deep-link connect parameter e.g. ?connect=SK-EDIRAV or ?u=ram123
   */
  _handleUrlConnect() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const targetId = urlParams.get('connect') || urlParams.get('user') || urlParams.get('u');
      if (targetId) {
        setTimeout(async () => {
          await this.pullUsers();
          const users = storage.getUsers();
          const cleanId = targetId.toLowerCase().trim();
          const matched = users.find(u => {
            const uId = String(u.uid || u.userId || '').toLowerCase();
            const uUser = String(u.username || '').toLowerCase();
            return uId === cleanId || uUser === cleanId;
          });
          if (matched) {
            toast.info(`Found user @${matched.username} from connect link! ✨`);
            if (window.ymApp) {
              window.ymApp.switchView('friends');
              if (window.ymApp.friendsView) {
                window.ymApp.friendsView.currentSubTab = 'search';
                window.ymApp.friendsView.render(matched.username);
              }
            }
          }
        }, 1500);
      }
    } catch (e) {}
  }

  /**
   * Get shareable connect link for current logged in user
   */
  getShareableLink() {
    const user = auth.getCurrentUser();
    if (!user) return null;
    const base = (typeof window !== 'undefined' && window.location.origin.includes('vercel.app'))
      ? window.location.origin
      : 'https://you-and-me-zeta.vercel.app';
    const uid = user.uid || user.userId;
    return `${base}/?connect=${encodeURIComponent(uid)}`;
  }
}

export const cloudSync = new CloudSyncService();
