/* ==========================================================================
   YOU & ME — 3D Chat Application
   User Management & Global Search Service
   ========================================================================== */

import { storage } from './storage.js';
import { auth } from './auth.js';

class UserService {
  getUserById(userId) {
    if (!userId) return null;
    const current = auth.getCurrentUser();
    if (userId === "CURRENT_USER" && current) {
      return current;
    }
    const users = storage.get('users') || [];
    return users.find(u => u.userId === userId) || null;
  }

  getAllUsers() {
    return storage.get('users') || [];
  }

  searchUsers(query) {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    const current = auth.getCurrentUser();
    const currentId = current ? current.userId : null;

    const users = this.getAllUsers();

    return users.filter(u => {
      if (currentId && u.userId === currentId) return false;
      const matchName = u.name.toLowerCase().includes(q);
      const matchUser = u.username.toLowerCase().includes(q);
      const matchId = u.userId.toLowerCase().includes(q);
      return matchName || matchUser || matchId;
    });
  }

  updateProfile(profileData) {
    return auth.updateCurrentUser(profileData);
  }
}

export const userService = new UserService();
