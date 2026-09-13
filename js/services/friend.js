/* ==========================================================================
   YOU & ME — 3D Chat Application
   Friend System Service (Requests, Connections, Mutuals)
   ========================================================================== */

import { storage } from './storage.js';
import { auth } from './auth.js';
import { userService } from './user.js';

class FriendService {
  _getFriendships() {
    return storage.get('friendships') || [];
  }

  _saveFriendships(list) {
    storage.set('friendships', list);
  }

  _resolveId(id) {
    const current = auth.getCurrentUser();
    if (id === "CURRENT_USER" && current) return current.userId;
    return id;
  }

  getFriendshipStatus(targetUserId) {
    const current = auth.getCurrentUser();
    if (!current || !targetUserId) return 'none';
    if (current.userId === targetUserId) return 'self';

    const list = this._getFriendships();
    const match = list.find(f => 
      (this._resolveId(f.user1) === current.userId && this._resolveId(f.user2) === targetUserId) ||
      (this._resolveId(f.user2) === current.userId && this._resolveId(f.user1) === targetUserId)
    );

    if (!match) return 'none';
    if (match.status === 'accepted') return 'friends';
    if (match.status === 'pending') {
      return this._resolveId(f.user1) === current.userId ? 'request_sent' : 'request_received';
    }
    return 'none';
  }

  sendFriendRequest(targetUserId) {
    const current = auth.getCurrentUser();
    if (!current) throw new Error("Please log in first.");
    if (current.userId === targetUserId) throw new Error("You cannot add yourself as a friend.");

    const list = this._getFriendships();
    const existing = list.find(f => 
      (this._resolveId(f.user1) === current.userId && this._resolveId(f.user2) === targetUserId) ||
      (this._resolveId(f.user2) === current.userId && this._resolveId(f.user1) === targetUserId)
    );

    if (existing) {
      if (existing.status === 'accepted') throw new Error("You are already friends.");
      if (existing.status === 'pending') throw new Error("A request is already pending.");
    }

    const newRequest = {
      id: "fr-" + Date.now(),
      user1: current.userId,
      user2: targetUserId,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    list.push(newRequest);
    this._saveFriendships(list);
    return newRequest;
  }

  acceptFriendRequest(requestId) {
    const current = auth.getCurrentUser();
    if (!current) throw new Error("Please log in first.");

    const list = this._getFriendships();
    const request = list.find(f => f.id === requestId);

    if (!request) throw new Error("Friend request not found.");

    request.status = "accepted";
    request.acceptedAt = new Date().toISOString();
    this._saveFriendships(list);
    return request;
  }

  rejectFriendRequest(requestId) {
    const list = this._getFriendships();
    const filtered = list.filter(f => f.id !== requestId);
    this._saveFriendships(filtered);
    return true;
  }

  cancelSentRequest(targetUserId) {
    const current = auth.getCurrentUser();
    if (!current) return false;

    const list = this._getFriendships();
    const filtered = list.filter(f => {
      const match = (this._resolveId(f.user1) === current.userId && this._resolveId(f.user2) === targetUserId) && f.status === 'pending';
      return !match;
    });

    this._saveFriendships(filtered);
    return true;
  }

  removeFriend(friendUserId) {
    const current = auth.getCurrentUser();
    if (!current) return false;

    const list = this._getFriendships();
    const filtered = list.filter(f => {
      const isMatch = (
        (this._resolveId(f.user1) === current.userId && this._resolveId(f.user2) === friendUserId) ||
        (this._resolveId(f.user2) === current.userId && this._resolveId(f.user1) === friendUserId)
      );
      return !isMatch;
    });

    this._saveFriendships(filtered);
    return true;
  }

  getFriendsList() {
    const current = auth.getCurrentUser();
    if (!current) return [];

    const list = this._getFriendships();
    const friendIds = [];

    list.forEach(f => {
      if (f.status === 'accepted') {
        const u1 = this._resolveId(f.user1);
        const u2 = this._resolveId(f.user2);
        if (u1 === current.userId) friendIds.push(u2);
        else if (u2 === current.userId) friendIds.push(u1);
      }
    });

    return friendIds
      .map(id => userService.getUserById(id))
      .filter(Boolean);
  }

  getIncomingRequests() {
    const current = auth.getCurrentUser();
    if (!current) return [];

    const list = this._getFriendships();
    return list
      .filter(f => f.status === 'pending' && this._resolveId(f.user2) === current.userId)
      .map(f => ({
        requestId: f.id,
        sender: userService.getUserById(this._resolveId(f.user1)),
        createdAt: f.createdAt
      }))
      .filter(item => item.sender !== null);
  }

  getSentRequests() {
    const current = auth.getCurrentUser();
    if (!current) return [];

    const list = this._getFriendships();
    return list
      .filter(f => f.status === 'pending' && this._resolveId(f.user1) === current.userId)
      .map(f => ({
        requestId: f.id,
        recipient: userService.getUserById(this._resolveId(f.user2)),
        createdAt: f.createdAt
      }))
      .filter(item => item.recipient !== null);
  }
}

export const friendService = new FriendService();
