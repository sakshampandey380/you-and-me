/* ==========================================================================
   YOU & ME — 3D Chat Application
   Authentication Service (Registration, Login, Session & Unique ID Generator)
   ========================================================================== */

import { APP_CONFIG } from '../config.js';
import { storage } from './storage.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this._loadSession();
  }

  _loadSession() {
    const session = storage.get('active_session');
    if (session && session.userId) {
      const users = storage.get('users') || [];
      const user = users.find(u => u.userId === session.userId);
      if (user) {
        this.currentUser = user;
      }
    }
  }

  generateUserId() {
    // Generates format: YM-XXXXXX
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `${APP_CONFIG.uniqueIdPrefix}${randomNum}`;
  }

  registerUser({ name, username, email, password, profilePicture }) {
    const users = storage.get('users') || [];
    
    // Normalize & check uniqueness
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      throw new Error("Username is already taken. Please choose another.");
    }

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      userId: this.generateUserId(),
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: password, // In production, hashed on server
      profilePicture: profilePicture || APP_CONFIG.defaultAvatar,
      bio: "Hey there! I am using You & Me 🚀",
      status: "Available for conversations ✨",
      onlineStatus: "online",
      lastSeen: "Just now",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storage.set('users', users);

    // Auto login
    this._setSession(newUser, true);
    return newUser;
  }

  loginUser(identifier, password, rememberMe = true) {
    const users = storage.get('users') || [];
    const cleanId = identifier.trim().toLowerCase();

    const user = users.find(u => 
      u.email.toLowerCase() === cleanId || 
      u.username.toLowerCase() === cleanId ||
      u.userId.toLowerCase() === cleanId
    );

    if (!user) {
      throw new Error("No account found with this username, email or ID.");
    }

    if (user.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    user.onlineStatus = "online";
    user.lastSeen = "Just now";
    storage.set('users', users);

    this._setSession(user, rememberMe);
    return user;
  }

  _setSession(user, remember) {
    this.currentUser = user;
    if (remember) {
      storage.set('active_session', { userId: user.userId, token: "mock_jwt_ym_" + Date.now() });
    } else {
      sessionStorage.setItem('ym_temp_session', JSON.stringify({ userId: user.userId }));
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
    const users = storage.get('users') || [];
    const index = users.findIndex(u => u.userId === this.currentUser.userId);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.currentUser = users[index];
      storage.set('users', users);
      return this.currentUser;
    }
    return null;
  }

  logout() {
    if (this.currentUser) {
      const users = storage.get('users') || [];
      const user = users.find(u => u.userId === this.currentUser.userId);
      if (user) {
        user.onlineStatus = "offline";
        user.lastSeen = "Just now";
        storage.set('users', users);
      }
    }
    this.currentUser = null;
    storage.remove('active_session');
    sessionStorage.removeItem('ym_temp_session');
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }
}

export const auth = new AuthService();
