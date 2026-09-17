/* ==========================================================================
   YOU & ME — 3D Chat Application
   Multi-Device Cloud Synchronization Engine
   (Real-Time Cross-Device Sync for Users, Requests, Notifications & Messages)
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { APP_CONFIG } from '../config.js';
import { storage } from './storage.js';
import { auth } from './auth.js';
import { sound } from './sound.js';
import { toast } from '../components/toast.js';

class CloudSyncService {
  constructor() {
    this.isSyncing = false;
    this.lastSyncTime = null;
    this.pollInterval = null;
    this.activeConvId = null;
    this.syncEndpoint = this._resolveSyncEndpoint();
    this.knownIncomingReqIds = new Set();
    this.knownAcceptedReqIds = new Set();
    this.knownMessageIds = new Set();
    this.init();
  }

  _resolveSyncEndpoint() {
    if (APP_CONFIG.cloudSyncUrl) {
      return APP_CONFIG.cloudSyncUrl;
    }

    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      if (window.location.origin.includes('vercel.app')) {
        return `${window.location.origin}/api/sync`;
      }
    }

    return 'https://you-and-me-zeta.vercel.app/api/sync';
  }

  init() {
    if (typeof window === 'undefined') return;

    this._handleUrlConnect();

    // Cache initial local state to detect incoming updates
    this._primeKnownState();

    // Pull immediately on startup
    setTimeout(() => {
      this.syncAll();
      const current = auth.getCurrentUser();
      if (current) {
        this.pushUser(current);
      }
    }, 600);

    // Sync on window focus and visibility change
    window.addEventListener('focus', () => this.syncAll());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.syncAll();
      }
    });

    // High frequency real-time polling loop (every 1.8 seconds)
    this.pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.syncAll();
      }
    }, 1800);
  }

  _primeKnownState() {
    try {
      const reqs = storage.get('app_friend_requests') || [];
      reqs.forEach(r => {
        const id = r.id || r.requestId;
        if (id) {
          this.knownIncomingReqIds.add(id);
          if (r.status === 'accepted') this.knownAcceptedReqIds.add(id);
        }
      });

      const convs = storage.get('app_conversations') || [];
      convs.forEach(c => {
        if (c.messages) {
          c.messages.forEach(m => {
            if (m.id) this.knownMessageIds.add(m.id);
          });
        }
      });
    } catch (e) {}
  }

  setActiveConversation(convId) {
    this.activeConvId = convId;
    if (convId) {
      // Trigger sync immediately when entering a chat
      this.syncAll();
    }
  }

  // --------------------------------------------------------------------------
  // MASTER SYNC PULL (Zero-Refresh Real-Time Sync)
  // --------------------------------------------------------------------------
  async syncAll() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const current = auth.getCurrentUser();
      const currentUid = current ? String(current.uid || current.userId || '').toUpperCase() : '';
      const endpoint = this._resolveSyncEndpoint();

      const url = new URL(endpoint);
      if (currentUid) url.searchParams.set('uid', currentUid);
      if (this.activeConvId) url.searchParams.set('convId', this.activeConvId);

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) return;
      const data = await res.json();
      if (!data) return;

      let hasFriendChanges = false;
      let hasNotifChanges = false;
      let hasConvChanges = false;
      let messageStatusChanged = false;

      // 1. Merge Users
      if (Array.isArray(data.users)) {
        this._mergeUsers(data.users);
      }

      if (currentUid) {
        // 2. Merge Friend Requests
        if (Array.isArray(data.friendRequests)) {
          const localReqs = storage.get('app_friend_requests') || [];
          const reqMap = new Map();

          localReqs.forEach(r => {
            const id = r.id || r.requestId;
            if (id) reqMap.set(id, r);
          });

          data.friendRequests.forEach(cr => {
            const id = cr.id || cr.requestId;
            if (!id) return;

            const existing = reqMap.get(id);
            const isToMe = String(cr.to || cr.receiverId).toUpperCase() === currentUid;
            const isFromMe = String(cr.from || cr.senderId).toUpperCase() === currentUid;

            // New incoming request arrived!
            if (!existing && isToMe && cr.status === 'pending' && !this.knownIncomingReqIds.has(id)) {
              this.knownIncomingReqIds.add(id);
              hasFriendChanges = true;
              hasNotifChanges = true;
              try {
                sound.playNotification();
                const senderName = cr.sender ? (cr.sender.name || cr.sender.displayName) : 'Someone';
                toast.info(`New Friend Request from ${senderName}! 💌`);
              } catch (e) {}
            }

            // A request sent by me was accepted by partner!
            if (isFromMe && cr.status === 'accepted' && (!existing || existing.status !== 'accepted') && !this.knownAcceptedReqIds.has(id)) {
              this.knownAcceptedReqIds.add(id);
              hasFriendChanges = true;
              hasNotifChanges = true;
              hasConvChanges = true;
              try {
                sound.playNotification();
                const receiverName = cr.receiver ? (cr.receiver.name || cr.receiver.displayName) : 'Your friend';
                toast.success(`${receiverName} accepted your friend request! ✨ You can now chat.`);
              } catch (e) {}
            }

            if (!existing || existing.status !== cr.status || existing.updatedAt !== cr.updatedAt) {
              reqMap.set(id, cr);
              hasFriendChanges = true;
            }
          });

          if (hasFriendChanges) {
            storage.set('app_friend_requests', Array.from(reqMap.values()));
          }
        }

        // 3. Merge Friendships
        if (Array.isArray(data.friendships)) {
          const localFriendships = storage.get('app_friendships') || [];
          const fsMap = new Map();
          localFriendships.forEach(f => fsMap.set(f.id, f));

          data.friendships.forEach(cf => {
            if (cf && cf.id && !fsMap.has(cf.id)) {
              fsMap.set(cf.id, cf);
              hasFriendChanges = true;
              hasConvChanges = true;
            }
          });

          if (hasFriendChanges) {
            storage.set('app_friendships', Array.from(fsMap.values()));
          }
        }

        // 4. Merge Notifications
        if (Array.isArray(data.notifications)) {
          const localNotifs = storage.get('app_notifications') || [];
          const notifMap = new Map();
          localNotifs.forEach(n => notifMap.set(n.id || n.notificationId, n));

          data.notifications.forEach(cn => {
            const id = cn.id || cn.notificationId;
            if (id && !notifMap.has(id)) {
              notifMap.set(id, cn);
              hasNotifChanges = true;
            }
          });

          if (hasNotifChanges) {
            storage.set('app_notifications', Array.from(notifMap.values()));
          }
        }

        // 5. Merge Messages & Manage Delivery Status (✓ -> ✓✓ -> Blue ✓✓)
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          const convs = storage.get('app_conversations') || [];
          const pendingDeliveredIds = [];
          const pendingReadIds = [];

          data.messages.forEach(cm => {
            if (!cm || !cm.id || !cm.conversationId) return;

            const isFromOther = String(cm.senderId).toUpperCase() !== currentUid;
            let conv = convs.find(c => c.conversationId === cm.conversationId);

            if (!conv) {
              // Create conversation container locally if missing
              conv = {
                conversationId: cm.conversationId,
                participants: [currentUid, isFromOther ? cm.senderId : cm.receiverId],
                createdAt: cm.timestamp || new Date().toISOString(),
                unreadCount: 0,
                messages: []
              };
              convs.unshift(conv);
              hasConvChanges = true;
            }

            conv.messages = conv.messages || [];
            let localMsg = conv.messages.find(m => m.id === cm.id);

            if (!localMsg) {
              // Newly received message!
              conv.messages.push(cm);
              this.knownMessageIds.add(cm.id);
              hasConvChanges = true;

              if (isFromOther) {
                // If I just received it, mark delivered (double checkmark)
                pendingDeliveredIds.push(cm.id);

                // If I am currently in this chat, mark read (glowing cyan checkmark)
                if (this.activeConvId === cm.conversationId) {
                  cm.status = 'read';
                  pendingReadIds.push(cm.id);
                } else {
                  cm.status = 'delivered';
                  conv.unreadCount = (conv.unreadCount || 0) + 1;
                }

                try {
                  sound.playMessageReceived();
                } catch (e) {}

                // Notify live chat screen
                window.dispatchEvent(new CustomEvent('ym:message_received', {
                  detail: { conversationId: cm.conversationId, message: cm }
                }));
              }
            } else {
              // Existing message: check status transition (sent -> delivered -> read)
              if (localMsg.status !== cm.status) {
                localMsg.status = cm.status;
                messageStatusChanged = true;
                hasConvChanges = true;
              }

              // If partner sent it and I'm currently viewing this conversation, mark read
              if (isFromOther && this.activeConvId === cm.conversationId && localMsg.status !== 'read') {
                localMsg.status = 'read';
                pendingReadIds.push(cm.id);
                messageStatusChanged = true;
                hasConvChanges = true;
              }
            }
          });

          if (hasConvChanges) {
            storage.set('app_conversations', convs);
          }

          // Acknowledge delivery / read back to cloud
          if (pendingDeliveredIds.length > 0) {
            this.markMessagesDelivered(pendingDeliveredIds);
          }
          if (pendingReadIds.length > 0) {
            this.markMessagesRead(pendingReadIds, this.activeConvId);
          }
        }
      }

      // Dispatch UI update events
      if (hasFriendChanges) {
        window.dispatchEvent(new CustomEvent('ym:friends_updated'));
      }
      if (hasNotifChanges) {
        window.dispatchEvent(new CustomEvent('ym:notifications_updated'));
      }
      if (hasConvChanges || messageStatusChanged) {
        window.dispatchEvent(new CustomEvent('ym:conversations_updated'));
        window.dispatchEvent(new CustomEvent('ym:message_status_update'));
      }

      this.lastSyncTime = Date.now();
    } catch (err) {
      console.warn('[CloudSync] syncAll failed:', err.message);
    } finally {
      this.isSyncing = false;
    }
  }

  // --------------------------------------------------------------------------
  // USER SYNC
  // --------------------------------------------------------------------------
  async pushUser(user) {
    if (!user || (!user.uid && !user.userId)) return;
    try {
      const endpoint = this._resolveSyncEndpoint();
      const payload = {
        action: 'sync_user',
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

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {}
  }

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
    }
  }

  // --------------------------------------------------------------------------
  // FRIEND REQUEST ACTIONS (Instant Cloud Push)
  // --------------------------------------------------------------------------
  async sendFriendRequest(request) {
    if (!request) return;
    try {
      const endpoint = this._resolveSyncEndpoint();
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_friend_request',
          request: request
        })
      });
      // Immediate resync
      this.syncAll();
    } catch (e) {
      console.warn('[CloudSync] sendFriendRequest push failed:', e.message);
    }
  }

  async acceptFriendRequest(requestId) {
    if (!requestId) return;
    try {
      const current = auth.getCurrentUser();
      const currentUid = current ? (current.uid || current.userId) : '';
      const endpoint = this._resolveSyncEndpoint();
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accept_friend_request',
          requestId: requestId,
          accepterUid: currentUid
        })
      });
      this.syncAll();
    } catch (e) {
      console.warn('[CloudSync] acceptFriendRequest push failed:', e.message);
    }
  }

  async declineFriendRequest(requestId) {
    if (!requestId) return;
    try {
      const endpoint = this._resolveSyncEndpoint();
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'decline_friend_request',
          requestId: requestId
        })
      });
      this.syncAll();
    } catch (e) {
      console.warn('[CloudSync] declineFriendRequest push failed:', e.message);
    }
  }

  async cancelFriendRequest(requestId, toUid = null) {
    try {
      const current = auth.getCurrentUser();
      const currentUid = current ? (current.uid || current.userId) : '';
      const endpoint = this._resolveSyncEndpoint();
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel_friend_request',
          requestId: requestId,
          fromUid: currentUid,
          toUid: toUid
        })
      });
      this.syncAll();
    } catch (e) {
      console.warn('[CloudSync] cancelFriendRequest push failed:', e.message);
    }
  }

  // --------------------------------------------------------------------------
  // CHAT MESSAGE ACTIONS (Instant Cloud Push & Delivery Tracking)
  // --------------------------------------------------------------------------
  async sendMessage(message, receiverId) {
    if (!message) return;
    try {
      const endpoint = this._resolveSyncEndpoint();
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          message: message,
          receiverId: receiverId
        })
      });
      // Trigger instant pull to verify server receipt
      setTimeout(() => this.syncAll(), 400);
    } catch (e) {
      console.warn('[CloudSync] sendMessage push failed:', e.message);
    }
  }

  async markMessagesDelivered(messageIds) {
    if (!messageIds || messageIds.length === 0) return;
    try {
      const endpoint = this._resolveSyncEndpoint();
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_delivered',
          messageIds: messageIds
        })
      });
    } catch (e) {}
  }

  async markMessagesRead(messageIds, convId = null) {
    try {
      const current = auth.getCurrentUser();
      const currentUid = current ? (current.uid || current.userId) : '';
      const endpoint = this._resolveSyncEndpoint();
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_read',
          messageIds: messageIds,
          conversationId: convId,
          readerUid: currentUid
        })
      });
    } catch (e) {}
  }

  pullUsers() {
    return this.syncAll();
  }

  _handleUrlConnect() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const targetId = urlParams.get('connect') || urlParams.get('user') || urlParams.get('u');
      if (targetId) {
        setTimeout(async () => {
          await this.syncAll();
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
        }, 1200);
      }
    } catch (e) {}
  }

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
