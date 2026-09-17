/* ==========================================================================
   YOU & ME — 3D Chat Application
   Chat Service (UID-Based Conversations, Messages, Media, Reactions)
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { storage } from './storage.js';
import { auth } from './auth.js';
import { sound } from './sound.js';
import { notificationService } from './notification.js';
import { cloudSync } from './cloudSync.js';

class ChatService {
  _getConversations() {
    return storage.get('app_conversations') || [];
  }

  _saveConversations(convs) {
    return storage.set('app_conversations', convs);
  }

  _getCurrentUid() {
    const current = auth.getCurrentUser();
    return current ? String(current.uid || current.userId || '') : null;
  }

  getConversations() {
    const currentUid = this._getCurrentUid();
    if (!currentUid) return [];

    const convs = this._getConversations();
    const me = currentUid.toUpperCase();
    const friendships = storage.get('app_friendships') || [];

    const isFriend = (targetId) => {
      const target = String(targetId).toUpperCase();
      return friendships.some(f => {
        if (f.status !== 'accepted') return false;
        const u1 = String(f.user1 || f.user1Id || '').toUpperCase();
        const u2 = String(f.user2 || f.user2Id || '').toUpperCase();
        return (u1 === me && u2 === target) || (u2 === me && u1 === target);
      });
    };

    return convs
      .filter(c => {
        if (!c || !Array.isArray(c.participants)) return false;
        const otherId = c.participants.find(p => String(p).toUpperCase() !== me);
        if (!otherId) return false;
        return isFriend(otherId);
      })
      .map(c => {
        const otherId = c.participants.find(p => String(p).toUpperCase() !== me);
        const lastMsg = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
        return {
          ...c,
          otherParticipantId: otherId,
          lastMessage: lastMsg
        };
      })
      .sort((a, b) => {
        const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : new Date(a.createdAt || 0).getTime();
        const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
  }

  getConversationById(convId) {
    const currentUid = this._getCurrentUid();
    if (!currentUid || !convId) return null;

    const convs = this._getConversations();
    const conv = convs.find(c => c.conversationId === convId);
    if (!conv) return null;

    const me = currentUid.toUpperCase();
    const otherId = conv.participants.find(p => String(p).toUpperCase() !== me);
    return {
      ...conv,
      otherParticipantId: otherId
    };
  }

  getOrCreateConversation(targetUserId) {
    const currentUid = this._getCurrentUid();
    if (!currentUid) throw new Error("Please log in first.");

    const convs = this._getConversations();
    const me = currentUid.toUpperCase();
    const target = String(targetUserId).toUpperCase();

    let conv = convs.find(c => {
      if (!c || !Array.isArray(c.participants)) return false;
      const parts = c.participants.map(p => String(p).toUpperCase());
      return parts.includes(me) && parts.includes(target);
    });

    if (!conv) {
      // Deterministic conversation ID based on sorted UIDs
      const sortedUids = [currentUid, String(targetUserId)].sort();
      const stableConvId = `conv-${sortedUids[0]}_${sortedUids[1]}`;

      // Double check if existing by stable ID
      conv = convs.find(c => c.conversationId === stableConvId);

      if (!conv) {
        conv = {
          conversationId: stableConvId,
          participants: [currentUid, String(targetUserId)],
          createdAt: new Date().toISOString(),
          unreadCount: 0,
          messages: []
        };
        convs.unshift(conv);
        this._saveConversations(convs);
      }
    }

    return {
      ...conv,
      otherParticipantId: String(targetUserId)
    };
  }

  sendMessage(convId, { type = "text", text = "", mediaUrl = null, fileName = null, fileSize = null, replyTo = null }) {
    const current = auth.getCurrentUser();
    if (!current) throw new Error("Please log in first.");

    const currentUid = current.uid || current.userId;
    const convs = this._getConversations();
    const conv = convs.find(c => c.conversationId === convId);
    if (!conv) throw new Error("Conversation not found.");

    const otherParticipantId = conv.participants.find(p => String(p).toUpperCase() !== String(currentUid).toUpperCase());

    // Verify mutual accepted friendship
    if (otherParticipantId) {
      const friendships = storage.get('app_friendships') || [];
      const me = String(currentUid).toUpperCase();
      const them = String(otherParticipantId).toUpperCase();
      const isFriend = friendships.some(f => {
        if (f.status !== 'accepted') return false;
        const u1 = String(f.user1 || f.user1Id || '').toUpperCase();
        const u2 = String(f.user2 || f.user2Id || '').toUpperCase();
        return (u1 === me && u2 === them) || (u2 === me && u1 === them);
      });

      if (!isFriend) {
        throw new Error("Chat is locked until your friend request is accepted.");
      }
    }

    const messageId = "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);

    const newMsg = {
      id: messageId,
      conversationId: convId,
      senderId: currentUid,
      receiverId: otherParticipantId || null,
      type: type, // 'text' | 'image' | 'video' | 'file'
      text: text ? text.trim() : "",
      mediaUrl: mediaUrl || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
      replyTo: replyTo || null, // { id, senderName, text }
      timestamp: new Date().toISOString(),
      status: "sent",
      reactions: []
    };

    conv.messages.push(newMsg);

    // Save with quota handling
    try {
      this._saveConversations(convs);
    } catch (err) {
      // Rollback message from in-memory array if write failed
      conv.messages.pop();
      throw new Error("This file is too large to store locally.");
    }

    try {
      sound.playMessageSent();
    } catch (e) {}

    // Push immediately to cloud sync so other device receives it in real-time!
    if (otherParticipantId) {
      cloudSync.sendMessage(newMsg, otherParticipantId);
    }

    // Deliver notification to partner if they are not in the conversation
    if (otherParticipantId) {
      let previewText = newMsg.text;
      if (type === 'image') previewText = 'Sent a photo 📷';
      else if (type === 'video') previewText = 'Sent a video 🎥';
      else if (type === 'file') previewText = `Sent a file: ${fileName || 'document'} 📎`;

      notificationService.addNotification({
        type: 'message',
        title: current.displayName || current.name,
        message: previewText || 'Sent you a message',
        fromUserId: currentUid,
        toUserId: otherParticipantId
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_conversations' } }));
    }

    return newMsg;
  }

  editMessage(convId, messageId, newText) {
    const currentUid = this._getCurrentUid();
    if (!currentUid) return null;

    const convs = this._getConversations();
    const conv = convs.find(c => c.conversationId === convId);
    if (!conv) return null;

    const msg = conv.messages.find(m => m.id === messageId);
    if (msg && String(msg.senderId).toUpperCase() === currentUid.toUpperCase()) {
      msg.text = newText.trim();
      msg.edited = true;
      msg.editedAt = new Date().toISOString();
      this._saveConversations(convs);
      return msg;
    }
    return null;
  }

  deleteMessage(convId, messageId, mode = "everyone") {
    const currentUid = this._getCurrentUid();
    if (!currentUid) return false;

    const convs = this._getConversations();
    const conv = convs.find(c => c.conversationId === convId);
    if (!conv) return false;

    const msg = conv.messages.find(m => m.id === messageId);
    if (!msg) return false;

    if (mode === "everyone") {
      msg.type = "deleted";
      msg.text = "This message was deleted";
      msg.mediaUrl = null;
      msg.deleted = true;
    } else {
      // Delete for me only
      msg.deletedFor = msg.deletedFor || [];
      if (!msg.deletedFor.includes(currentUid)) {
        msg.deletedFor.push(currentUid);
      }
    }

    this._saveConversations(convs);
    return true;
  }

  toggleReaction(convId, messageId, emoji) {
    const currentUid = this._getCurrentUid();
    if (!currentUid) return null;

    const convs = this._getConversations();
    const conv = convs.find(c => c.conversationId === convId);
    if (!conv) return null;

    const msg = conv.messages.find(m => m.id === messageId);
    if (!msg) return null;

    msg.reactions = msg.reactions || [];
    let existingReaction = msg.reactions.find(r => r.emoji === emoji);

    if (existingReaction) {
      const userIndex = existingReaction.userIds.map(id => String(id).toUpperCase()).indexOf(currentUid.toUpperCase());
      if (userIndex !== -1) {
        existingReaction.userIds.splice(userIndex, 1);
        if (existingReaction.userIds.length === 0) {
          msg.reactions = msg.reactions.filter(r => r.emoji !== emoji);
        }
      } else {
        existingReaction.userIds.push(currentUid);
      }
    } else {
      msg.reactions.push({
        emoji: emoji,
        userIds: [currentUid]
      });
    }

    this._saveConversations(convs);
    return msg.reactions;
  }

  markAsRead(convId) {
    const currentUid = this._getCurrentUid();
    if (!currentUid) return;

    const convs = this._getConversations();
    const conv = convs.find(c => c.conversationId === convId);
    if (!conv) return;

    conv.unreadCount = 0;
    const me = currentUid.toUpperCase();
    let changed = false;
    const readMsgIds = [];

    conv.messages.forEach(m => {
      if (String(m.senderId).toUpperCase() !== me && m.status !== "read") {
        m.status = "read";
        readMsgIds.push(m.id);
        changed = true;
      }
    });

    if (changed) {
      this._saveConversations(convs);
      cloudSync.markMessagesRead(readMsgIds, convId);
    }
  }

  searchInConversation(convId, query) {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    const conv = this.getConversationById(convId);
    if (!conv || !conv.messages) return [];

    return conv.messages.filter(m => 
      m.type !== 'deleted' && m.text && m.text.toLowerCase().includes(q)
    );
  }
}

export const chatService = new ChatService();
