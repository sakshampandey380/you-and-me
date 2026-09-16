/* ==========================================================================
   YOU & ME — 3D Chat Application
   Friend System Service (Requests, Mutual Connections, Persistence)
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { storage } from './storage.js';
import { auth } from './auth.js';
import { userService } from './user.js';
import { notificationService } from './notification.js';
import { chatService } from './chat.js';

class FriendService {
  _getFriendships() {
    return storage.get('app_friendships') || [];
  }

  _saveFriendships(list) {
    storage.set('app_friendships', list);
  }

  _getRequests() {
    return storage.get('app_friend_requests') || [];
  }

  _saveRequests(list) {
    storage.set('app_friend_requests', list);
  }

  _getCurrentUid() {
    const current = auth.getCurrentUser();
    return current ? (current.uid || current.userId) : null;
  }

  getFriendshipStatus(targetUserId) {
    const currentUid = this._getCurrentUid();
    if (!currentUid || !targetUserId) return 'none';
    if (currentUid.toUpperCase() === String(targetUserId).toUpperCase()) return 'self';

    // 1. Check accepted friendships
    const friendships = this._getFriendships();
    const isFriend = friendships.some(f => {
      if (f.status !== 'accepted') return false;
      const u1 = String(f.user1 || f.user1Id || '').toUpperCase();
      const u2 = String(f.user2 || f.user2Id || '').toUpperCase();
      const target = String(targetUserId).toUpperCase();
      const me = currentUid.toUpperCase();
      return (u1 === me && u2 === target) || (u2 === me && u1 === target);
    });

    if (isFriend) return 'friends';

    // 2. Check pending requests
    const requests = this._getRequests();
    const target = String(targetUserId).toUpperCase();
    const me = currentUid.toUpperCase();

    const req = requests.find(r => {
      if (r.status !== 'pending') return false;
      const from = String(r.from || r.senderId || '').toUpperCase();
      const to = String(r.to || r.receiverId || '').toUpperCase();
      return (from === me && to === target) || (from === target && to === me);
    });

    if (req) {
      const from = String(req.from || req.senderId || '').toUpperCase();
      return from === me ? 'request_sent' : 'request_received';
    }

    return 'none';
  }

  sendFriendRequest(targetUserId) {
    const current = auth.getCurrentUser();
    if (!current) throw new Error("Please log in first.");

    const currentUid = current.uid || current.userId;
    if (String(currentUid).toUpperCase() === String(targetUserId).toUpperCase()) {
      throw new Error("You cannot add yourself as a friend.");
    }

    const targetUser = userService.getUserById(targetUserId);
    if (!targetUser) throw new Error("User not found.");

    const status = this.getFriendshipStatus(targetUserId);
    if (status === 'friends') throw new Error("You are already friends.");
    if (status === 'request_sent') throw new Error("A request has already been sent.");

    // If the other user already sent a request to current user, auto-accept it!
    if (status === 'request_received') {
      const requests = this._getRequests();
      const incoming = requests.find(r => 
        String(r.from || r.senderId || '').toUpperCase() === String(targetUserId).toUpperCase() &&
        String(r.to || r.receiverId || '').toUpperCase() === String(currentUid).toUpperCase()
      );
      if (incoming) {
        return this.acceptFriendRequest(incoming.id || incoming.requestId);
      }
    }

    const requests = this._getRequests();
    const reqId = "fr-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    const newRequest = {
      id: reqId,
      requestId: reqId,
      from: currentUid,
      to: targetUser.uid || targetUser.userId,
      senderId: currentUid,
      receiverId: targetUser.uid || targetUser.userId,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    requests.push(newRequest);
    this._saveRequests(requests);

    // Deliver persistent notification to the recipient
    notificationService.addNotification({
      type: 'friend_request',
      title: 'New Friend Request 💌',
      message: `${current.displayName || current.name} (@${current.username}) sent you a friend request.`,
      fromUserId: currentUid,
      toUserId: targetUser.uid || targetUser.userId,
      requestId: reqId
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:friends_updated'));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_friend_requests' } }));
    }

    return newRequest;
  }

  acceptFriendRequest(requestId) {
    const current = auth.getCurrentUser();
    if (!current) throw new Error("Please log in first.");

    const currentUid = current.uid || current.userId;
    const requests = this._getRequests();
    const reqIndex = requests.findIndex(r => (r.id === requestId || r.requestId === requestId));

    if (reqIndex === -1) {
      throw new Error("Friend request not found.");
    }

    const request = requests[reqIndex];
    const senderId = request.from || request.senderId;
    const receiverId = request.to || request.receiverId;
    const otherUserId = String(senderId).toUpperCase() === String(currentUid).toUpperCase() ? receiverId : senderId;

    // Remove pending request
    requests.splice(reqIndex, 1);
    this._saveRequests(requests);

    // Add mutual friendship
    const friendships = this._getFriendships();
    const exists = friendships.some(f => {
      const u1 = String(f.user1 || f.user1Id || '').toUpperCase();
      const u2 = String(f.user2 || f.user2Id || '').toUpperCase();
      const me = String(currentUid).toUpperCase();
      const them = String(otherUserId).toUpperCase();
      return (u1 === me && u2 === them) || (u2 === me && u1 === them);
    });

    let newFriendship = null;
    if (!exists) {
      newFriendship = {
        id: "fs-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        user1: currentUid,
        user2: otherUserId,
        user1Id: currentUid,
        user2Id: otherUserId,
        status: "accepted",
        createdAt: new Date().toISOString()
      };
      friendships.push(newFriendship);
      this._saveFriendships(friendships);
    }

    // Clear recipient's pending notification
    notificationService.removeNotificationByRequestId(requestId);

    // Notify sender that their request was accepted
    notificationService.addNotification({
      type: 'friend_accepted',
      title: 'Friend Request Accepted! ✨',
      message: `${current.displayName || current.name} accepted your friend request! You can now chat in 3D.`,
      fromUserId: currentUid,
      toUserId: otherUserId,
      requestId: requestId
    });

    // Create / unlock conversation between both users
    const conv = chatService.getOrCreateConversation(otherUserId);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:friends_updated'));
      window.dispatchEvent(new CustomEvent('ym:conversation_unlocked', { detail: { conversationId: conv.conversationId, partnerId: otherUserId } }));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_friendships' } }));
    }

    return { success: true, conversation: conv };
  }

  rejectFriendRequest(requestId) {
    const requests = this._getRequests();
    const filtered = requests.filter(r => (r.id !== requestId && r.requestId !== requestId));
    this._saveRequests(filtered);

    // Clear notification
    notificationService.removeNotificationByRequestId(requestId);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:friends_updated'));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_friend_requests' } }));
    }

    return true;
  }

  cancelSentRequest(targetUserId) {
    const currentUid = this._getCurrentUid();
    if (!currentUid || !targetUserId) return false;

    const requests = this._getRequests();
    let canceledReqId = null;
    const me = String(currentUid).toUpperCase();
    const target = String(targetUserId).toUpperCase();

    const filtered = requests.filter(r => {
      const from = String(r.from || r.senderId || '').toUpperCase();
      const to = String(r.to || r.receiverId || '').toUpperCase();
      const match = (from === me && to === target) && r.status === 'pending';
      if (match) canceledReqId = r.id || r.requestId;
      return !match;
    });

    this._saveRequests(filtered);

    if (canceledReqId) {
      notificationService.removeNotificationByRequestId(canceledReqId);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:friends_updated'));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_friend_requests' } }));
    }

    return true;
  }

  removeFriend(friendUserId) {
    const currentUid = this._getCurrentUid();
    if (!currentUid || !friendUserId) return false;

    const friendships = this._getFriendships();
    const me = String(currentUid).toUpperCase();
    const target = String(friendUserId).toUpperCase();

    const filtered = friendships.filter(f => {
      const u1 = String(f.user1 || f.user1Id || '').toUpperCase();
      const u2 = String(f.user2 || f.user2Id || '').toUpperCase();
      return !((u1 === me && u2 === target) || (u2 === me && u1 === target));
    });

    this._saveFriendships(filtered);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:friends_updated'));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_friendships' } }));
    }

    return true;
  }

  getFriendsList() {
    const currentUid = this._getCurrentUid();
    if (!currentUid) return [];

    const friendships = this._getFriendships();
    const me = String(currentUid).toUpperCase();
    const friendUids = [];

    friendships.forEach(f => {
      if (f.status === 'accepted') {
        const u1 = String(f.user1 || f.user1Id || '');
        const u2 = String(f.user2 || f.user2Id || '');
        if (u1.toUpperCase() === me && u2) friendUids.push(u2);
        else if (u2.toUpperCase() === me && u1) friendUids.push(u1);
      }
    });

    return friendUids
      .map(id => userService.getUserById(id))
      .filter(Boolean);
  }

  getIncomingRequests() {
    const currentUid = this._getCurrentUid();
    if (!currentUid) return [];

    const requests = this._getRequests();
    const me = String(currentUid).toUpperCase();

    return requests
      .filter(r => r.status === 'pending' && String(r.to || r.receiverId || '').toUpperCase() === me)
      .map(r => ({
        requestId: r.id || r.requestId,
        sender: userService.getUserById(r.from || r.senderId),
        createdAt: r.createdAt
      }))
      .filter(item => item.sender !== null);
  }

  getSentRequests() {
    const currentUid = this._getCurrentUid();
    if (!currentUid) return [];

    const requests = this._getRequests();
    const me = String(currentUid).toUpperCase();

    return requests
      .filter(r => r.status === 'pending' && String(r.from || r.senderId || '').toUpperCase() === me)
      .map(r => ({
        requestId: r.id || r.requestId,
        recipient: userService.getUserById(r.to || r.receiverId),
        createdAt: r.createdAt
      }))
      .filter(item => item.recipient !== null);
  }
}

export const friendService = new FriendService();
