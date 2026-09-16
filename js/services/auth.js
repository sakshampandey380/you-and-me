/* ==========================================================================
   YOU & ME — 3D Chat Application
   Authentication Service (Registration, Login, Session & Unique UID Generation)
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { APP_CONFIG } from '../config.js';
import { storage } from './storage.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this._loadSession();
  }

  _loadSession() {
    let sessionUserId = null;

    try {
      if (typeof sessionStorage !== 'undefined') {
        const temp = sessionStorage.getItem('ym_temp_session');
        if (temp) {
          const parsed = JSON.parse(temp);
          if (parsed && (parsed.uid || parsed.userId)) {
            sessionUserId = parsed.uid || parsed.userId;
          }
        }
      }
    } catch (e) {}

    if (!sessionUserId) {
      const active = storage.get('app_current_user');
      if (active && (active.uid || active.userId)) {
        sessionUserId = active.uid || active.userId;
      }
    }

    if (sessionUserId) {
      const user = storage.getUserByUid(sessionUserId);
      if (user) {
        this.currentUser = user;
      }
    }
  }

  generateUserId() {
    // Generates format: SK-XXXXXX (guaranteed unique in app_users)
    const users = storage.getUsers();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newId = '';
    let isUnique = false;

    while (!isUnique) {
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newId = `${APP_CONFIG.uniqueIdPrefix}${code}`;

      // Verify no existing user has this UID
      const exists = users.some(u => {
        if (!u) return false;
        const existing = String(u.uid || u.userId || '').toUpperCase();
        return existing === newId.toUpperCase();
      });

      if (!exists) {
        isUnique = true;
      }
    }

    return newId;
  }

  registerUser({ name, username, email, password, dob = '', phone = '', language = 'English', profilePicture }) {
    const users = storage.getUsers();

    const cleanUsername = String(username || '').trim().toLowerCase().replace(/^@+/, '').replace(/[^a-z0-9_]/g, '');
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!cleanUsername) {
      throw new Error("Please enter a valid username.");
    }

    if (users.some(u => String(u.username || '').toLowerCase() === cleanUsername)) {
      throw new Error("Username is already taken. Please choose another.");
    }

    if (users.some(u => String(u.email || '').toLowerCase() === cleanEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const trimmedName = String(name || '').trim();
    const cleanDob = String(dob || '').trim();
    const cleanPhone = String(phone || '').trim();
    const uid = this.generateUserId();
    const avatar = profilePicture || APP_CONFIG.defaultAvatar;

    const newUser = {
      uid: uid,
      userId: uid, // Alias for backward compatibility
      name: trimmedName,
      displayName: trimmedName,
      username: cleanUsername,
      email: cleanEmail,
      phone: cleanPhone,
      password: password,
      dob: cleanDob,
      birthday: cleanDob,
      avatar: avatar,
      profilePicture: avatar,
      language: language || "English",
      bio: "Hey there! I am using You & Me 🚀",
      status: "Available for conversations ✨",
      onlineStatus: "online",
      lastSeen: "Just now",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storage.saveUsers(users);

    // Auto login new user
    this._setSession(newUser, true);

    // Broadcast registration across application
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:user_registered', { detail: newUser }));
      window.dispatchEvent(new CustomEvent('ym:friends_updated'));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_users' } }));
    }

    return newUser;
  }

  loginUser(identifier, password, rememberMe = true) {
    const users = storage.getUsers();
    const raw = String(identifier || '').trim();
    const cleanLower = raw.toLowerCase();
    const cleanUser = cleanLower.replace(/^@+/, '');
    const cleanDigits = cleanLower.replace(/[^0-9]/g, '');

    const user = users.find(u => {
      if (!u) return false;
      const uEmail = String(u.email || '').toLowerCase();
      const uUser = String(u.username || '').toLowerCase();
      const uId = String(u.uid || u.userId || '').toLowerCase();
      const uDigits = uId.replace(/[^0-9]/g, '');
      const uPhone = String(u.phone || '').toLowerCase();

      return (
        uEmail === cleanLower ||
        uUser === cleanUser ||
        uId === cleanLower ||
        uId === ('sk-' + cleanLower) ||
        uId === ('ym-' + cleanLower) ||
        (cleanDigits.length >= 6 && uDigits === cleanDigits) ||
        (cleanDigits.length >= 6 && uPhone && uPhone.replace(/[^0-9]/g, '') === cleanDigits)
      );
    });

    if (!user) {
      throw new Error("No account found with this username, email or ID.");
    }

    if (user.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    user.onlineStatus = "online";
    user.lastSeen = "Just now";
    storage.saveUsers(users);

    this._setSession(user, rememberMe);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:auth_changed', { detail: user }));
      window.dispatchEvent(new CustomEvent('ym:friends_updated'));
    }

    return user;
  }

  _setSession(user, remember = true) {
    this.currentUser = user;
    const sessionPayload = {
      uid: user.uid || user.userId,
      userId: user.uid || user.userId,
      token: "ym_auth_" + Date.now()
    };

    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('ym_temp_session', JSON.stringify(sessionPayload));
      }
    } catch (e) {}

    if (remember) {
      storage.set('app_current_user', sessionPayload);
    }
  }

  setCurrentUser(user) {
    if (!user) return;
    this._setSession(user, true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:auth_changed', { detail: user }));
      window.dispatchEvent(new CustomEvent('ym:friends_updated'));
    }
  }

  getCurrentUser() {
    if (!this.currentUser) {
      this._loadSession();
    }
    return this.currentUser;
  }

  updateCurrentUser(updates) {
    if (!this.currentUser) return null;
    const users = storage.getUsers();
    const currentUid = this.currentUser.uid || this.currentUser.userId;
    const index = users.findIndex(u => (u.uid || u.userId) === currentUid);

    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.currentUser = users[index];
      storage.saveUsers(users);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ym:profile_updated', { detail: this.currentUser }));
        window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_users' } }));
      }

      return this.currentUser;
    }
    return null;
  }

  logout() {
    if (this.currentUser) {
      const users = storage.getUsers();
      const currentUid = this.currentUser.uid || this.currentUser.userId;
      const user = users.find(u => (u.uid || u.userId) === currentUid);
      if (user) {
        user.onlineStatus = "offline";
        user.lastSeen = "Just now";
        storage.saveUsers(users);
      }
    }

    this.currentUser = null;
    storage.remove('app_current_user');
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('ym_temp_session');
      }
    } catch (e) {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:auth_changed', { detail: null }));
    }
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }
}

export const auth = new AuthService();
