/* ==========================================================================
   YOU & ME — 3D Chat Application
   Vercel Serverless Multi-Device Synchronization Endpoint
   (Users, Real-Time Friend Requests, Friendships, Notifications & Live Chat)
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

// Global in-memory data structures preserved across warm serverless invocations
const globalUsers = global._ymUsers || new Map();
global._ymUsers = globalUsers;

const globalRequests = global._ymRequests || new Map();
global._ymRequests = globalRequests;

const globalFriendships = global._ymFriendships || new Map();
global._ymFriendships = globalFriendships;

const globalNotifications = global._ymNotifications || new Map();
global._ymNotifications = globalNotifications;

const globalMessages = global._ymMessages || new Map();
global._ymMessages = globalMessages;

export default async function handler(req, res) {
  // CORS Headers for cross-device & cross-origin access
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // --------------------------------------------------------------------------
  // GET: Fetch synchronized data for the active user
  // --------------------------------------------------------------------------
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, 'http://localhost');
      const uid = (url.searchParams.get('uid') || '').toUpperCase();
      const convId = url.searchParams.get('convId') || '';

      const allUsers = Array.from(globalUsers.values());

      // Filter friend requests involving this user
      const allRequests = Array.from(globalRequests.values());
      const userRequests = uid
        ? allRequests.filter(r => {
            const f = String(r.from || r.senderId || '').toUpperCase();
            const t = String(r.to || r.receiverId || '').toUpperCase();
            return f === uid || t === uid;
          })
        : allRequests;

      // Filter friendships involving this user
      const allFriendships = Array.from(globalFriendships.values());
      const userFriendships = uid
        ? allFriendships.filter(f => {
            const u1 = String(f.user1 || f.user1Id || '').toUpperCase();
            const u2 = String(f.user2 || f.user2Id || '').toUpperCase();
            return u1 === uid || u2 === uid;
          })
        : allFriendships;

      // Filter notifications for this user
      const allNotifications = Array.from(globalNotifications.values());
      const userNotifications = uid
        ? allNotifications.filter(n => {
            const to = String(n.toUserId || n.recipientUid || '').toUpperCase();
            return to === uid;
          })
        : allNotifications;

      // Filter messages involving this user
      const allMessages = Array.from(globalMessages.values());
      const userMessages = uid
        ? allMessages.filter(m => {
            const s = String(m.senderId || '').toUpperCase();
            const r = String(m.receiverId || '').toUpperCase();
            const cMatch = convId && m.conversationId === convId;
            return s === uid || r === uid || cMatch;
          })
        : allMessages;

      return res.status(200).json({
        success: true,
        serverTime: Date.now(),
        users: allUsers,
        friendRequests: userRequests,
        friendships: userFriendships,
        notifications: userNotifications,
        messages: userMessages
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // --------------------------------------------------------------------------
  // POST: Create or update entities (Users, Requests, Accept, Chat Messages)
  // --------------------------------------------------------------------------
  if (req.method === 'POST') {
    try {
      const payload = req.body || {};
      const action = payload.action || (payload.uid ? 'sync_user' : 'unknown');

      // 1. SYNC USER
      if (action === 'sync_user' || (payload.uid && !payload.action)) {
        const user = payload.user || payload;
        if (!user || (!user.uid && !user.userId)) {
          return res.status(400).json({ success: false, message: 'Missing user UID' });
        }

        const uid = String(user.uid || user.userId).toUpperCase();
        const sanitizedUser = {
          uid: uid,
          userId: uid,
          name: user.name || 'User',
          displayName: user.displayName || user.name || 'User',
          username: String(user.username || '').replace(/^@+/, ''),
          email: user.email || '',
          avatar: user.avatar || user.profilePicture || '',
          profilePicture: user.profilePicture || user.avatar || '',
          dob: user.dob || user.birthday || '',
          birthday: user.birthday || user.dob || '',
          language: user.language || 'English',
          bio: user.bio || 'Hey there! I am using You & Me 🚀',
          status: user.status || 'Available for conversations ✨',
          onlineStatus: 'online',
          lastSeen: 'Just now',
          updatedAt: new Date().toISOString()
        };

        globalUsers.set(uid, sanitizedUser);

        return res.status(200).json({
          success: true,
          action: 'sync_user',
          user: sanitizedUser
        });
      }

      // 2. SEND FRIEND REQUEST
      if (action === 'send_friend_request') {
        const reqData = payload.request;
        if (!reqData || !reqData.from || !reqData.to) {
          return res.status(400).json({ success: false, message: 'Invalid friend request payload' });
        }

        const reqId = reqData.id || reqData.requestId || `fr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const sanitizedReq = {
          id: reqId,
          requestId: reqId,
          from: String(reqData.from || reqData.senderId).toUpperCase(),
          to: String(reqData.to || reqData.receiverId).toUpperCase(),
          senderId: String(reqData.from || reqData.senderId).toUpperCase(),
          receiverId: String(reqData.to || reqData.receiverId).toUpperCase(),
          sender: reqData.sender || null,
          receiver: reqData.receiver || null,
          status: 'pending',
          createdAt: reqData.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        globalRequests.set(reqId, sanitizedReq);

        // Auto-create persistent in-app notification for the recipient!
        const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const senderName = sanitizedReq.sender ? (sanitizedReq.sender.displayName || sanitizedReq.sender.name) : 'A community member';
        const senderUser = sanitizedReq.sender ? `@${sanitizedReq.sender.username}` : '';
        const notif = {
          id: notifId,
          notificationId: notifId,
          type: 'friend_request',
          title: 'New Friend Request 💌',
          message: `${senderName} ${senderUser ? `(${senderUser})` : ''} sent you a friend request.`,
          fromUserId: sanitizedReq.senderId,
          senderUid: sanitizedReq.senderId,
          toUserId: sanitizedReq.receiverId,
          recipientUid: sanitizedReq.receiverId,
          requestId: reqId,
          read: false,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        globalNotifications.set(notifId, notif);

        return res.status(200).json({
          success: true,
          action: 'send_friend_request',
          request: sanitizedReq,
          notification: notif
        });
      }

      // 3. ACCEPT FRIEND REQUEST
      if (action === 'accept_friend_request') {
        const reqId = payload.requestId || payload.id;
        const accepterUid = String(payload.accepterUid || '').toUpperCase();
        let targetReq = globalRequests.get(reqId);

        // Fallback: search by request ID
        if (!targetReq) {
          for (const r of globalRequests.values()) {
            if (r.id === reqId || r.requestId === reqId) {
              targetReq = r;
              break;
            }
          }
        }

        if (targetReq) {
          targetReq.status = 'accepted';
          targetReq.updatedAt = new Date().toISOString();
          globalRequests.set(targetReq.id, targetReq);

          // Create mutual friendship
          const fsId = `fs-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const friendship = {
            id: fsId,
            user1: targetReq.senderId,
            user2: targetReq.receiverId,
            user1Id: targetReq.senderId,
            user2Id: targetReq.receiverId,
            status: 'accepted',
            createdAt: new Date().toISOString()
          };
          globalFriendships.set(fsId, friendship);

          // Create acceptance notification for the original sender!
          const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const receiverUser = globalUsers.get(targetReq.receiverId);
          const receiverName = receiverUser ? (receiverUser.displayName || receiverUser.name) : 'Your friend';
          const notif = {
            id: notifId,
            notificationId: notifId,
            type: 'friend_accepted',
            title: 'Friend Request Accepted! ✨',
            message: `${receiverName} accepted your friend request! You can now chat together.`,
            fromUserId: targetReq.receiverId,
            senderUid: targetReq.receiverId,
            toUserId: targetReq.senderId,
            recipientUid: targetReq.senderId,
            requestId: reqId,
            read: false,
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString()
          };
          globalNotifications.set(notifId, notif);

          // Remove the pending request notification for the receiver
          for (const [nid, n] of globalNotifications.entries()) {
            if (n.requestId === reqId && n.type === 'friend_request') {
              globalNotifications.delete(nid);
            }
          }

          return res.status(200).json({
            success: true,
            action: 'accept_friend_request',
            friendship: friendship,
            notification: notif
          });
        }

        return res.status(404).json({ success: false, message: 'Request not found' });
      }

      // 4. DECLINE / REJECT FRIEND REQUEST
      if (action === 'decline_friend_request') {
        const reqId = payload.requestId || payload.id;
        for (const [id, r] of globalRequests.entries()) {
          if (r.id === reqId || r.requestId === reqId) {
            r.status = 'declined';
            globalRequests.set(id, r);
            break;
          }
        }
        // Remove pending notification
        for (const [nid, n] of globalNotifications.entries()) {
          if (n.requestId === reqId) {
            globalNotifications.delete(nid);
          }
        }
        return res.status(200).json({ success: true, action: 'decline_friend_request', requestId: reqId });
      }

      // 5. CANCEL SENT FRIEND REQUEST
      if (action === 'cancel_friend_request') {
        const reqId = payload.requestId || payload.id;
        const fromUid = String(payload.fromUid || '').toUpperCase();
        const toUid = String(payload.toUid || '').toUpperCase();

        for (const [id, r] of globalRequests.entries()) {
          if (r.id === reqId || r.requestId === reqId || (fromUid && toUid && r.senderId === fromUid && r.receiverId === toUid)) {
            globalRequests.delete(id);
          }
        }
        for (const [nid, n] of globalNotifications.entries()) {
          if (n.requestId === reqId || (fromUid && toUid && n.fromUserId === fromUid && n.toUserId === toUid)) {
            globalNotifications.delete(nid);
          }
        }
        return res.status(200).json({ success: true, action: 'cancel_friend_request' });
      }

      // 6. SEND CHAT MESSAGE
      if (action === 'send_message') {
        const msg = payload.message;
        if (!msg || !msg.senderId || !msg.conversationId) {
          return res.status(400).json({ success: false, message: 'Invalid message payload' });
        }

        const msgId = msg.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const sanitizedMsg = {
          id: msgId,
          conversationId: msg.conversationId,
          senderId: String(msg.senderId).toUpperCase(),
          receiverId: String(msg.receiverId || payload.receiverId || '').toUpperCase(),
          type: msg.type || 'text',
          text: msg.text || '',
          mediaUrl: msg.mediaUrl || null,
          fileName: msg.fileName || null,
          fileSize: msg.fileSize || null,
          replyTo: msg.replyTo || null,
          timestamp: msg.timestamp || new Date().toISOString(),
          status: 'sent', // Initially sent with single tick
          reactions: msg.reactions || []
        };

        globalMessages.set(msgId, sanitizedMsg);

        return res.status(200).json({
          success: true,
          action: 'send_message',
          message: sanitizedMsg
        });
      }

      // 7. MARK MESSAGES AS DELIVERED (✓✓)
      if (action === 'mark_delivered') {
        const messageIds = Array.isArray(payload.messageIds) ? payload.messageIds : [payload.messageId];
        const updated = [];

        messageIds.forEach(mid => {
          if (mid && globalMessages.has(mid)) {
            const m = globalMessages.get(mid);
            if (m.status === 'sent') {
              m.status = 'delivered';
              globalMessages.set(mid, m);
              updated.push(mid);
            }
          }
        });

        return res.status(200).json({
          success: true,
          action: 'mark_delivered',
          updatedCount: updated.length,
          messageIds: updated
        });
      }

      // 8. MARK MESSAGES AS READ (glowing cyan ✓✓)
      if (action === 'mark_read') {
        const messageIds = Array.isArray(payload.messageIds) ? payload.messageIds : [payload.messageId];
        const convId = payload.conversationId;
        const readerUid = String(payload.readerUid || '').toUpperCase();
        const updated = [];

        if (convId && readerUid) {
          // Mark all messages in conversation not sent by reader as read
          for (const [mid, m] of globalMessages.entries()) {
            if (m.conversationId === convId && String(m.senderId).toUpperCase() !== readerUid && m.status !== 'read') {
              m.status = 'read';
              globalMessages.set(mid, m);
              updated.push(mid);
            }
          }
        } else if (messageIds.length > 0) {
          messageIds.forEach(mid => {
            if (mid && globalMessages.has(mid)) {
              const m = globalMessages.get(mid);
              m.status = 'read';
              globalMessages.set(mid, m);
              updated.push(mid);
            }
          });
        }

        return res.status(200).json({
          success: true,
          action: 'mark_read',
          updatedCount: updated.length,
          messageIds: updated
        });
      }

      return res.status(400).json({ success: false, message: `Unknown action: ${action}` });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
