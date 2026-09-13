/* ==========================================================================
   YOU & ME — 3D Chat Application
   Chat Service (Conversations, Messages, Media, Reactions, Replies, Search)
   ========================================================================== */

import { storage } from './storage.js';
import { auth } from './auth.js';
import { sound } from './sound.js';

class ChatService {
  _getConversations() {
    return storage.get('conversations') || [];
  }

  _saveConversations(convs) {
    storage.set('conversations', convs);
  }

  _resolveId(id) {
    const current = auth.getCurrentUser();
    if (id === "CURRENT_USER" && current) return current.userId;
    return id;
  }

  getConversations() {
    const current = auth.getCurrentUser();
    if (!current) return [];

    const convs = this._getConversations();
    return convs
      .filter(c => c.participants.map(p => this._resolveId(p)).includes(current.userId))
      .map(c => {
        const otherId = c.participants.map(p => this._resolveId(p)).find(id => id !== current.userId);
        const lastMsg = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
        return {
          ...c,
          otherParticipantId: otherId,
          lastMessage: lastMsg
        };
      })
      .sort((a, b) => {
        const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : new Date(a.createdAt).getTime();
        const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : new Date(b.createdAt).getTime();
        return timeB - timeA;
      });
  }

  getConversationById(convId) {
    const current = auth.getCurrentUser();
    if (!current) return null;

    const convs = this._getConversations();
    const conv = convs.find(c => c.conversationId === convId);
    if (!conv) return null;

    const otherId = conv.participants.map(p => this._resolveId(p)).find(id => id !== current.userId);
    return {
      ...conv,
      otherParticipantId: otherId
    };
  }

  getOrCreateConversation(targetUserId) {
    const current = auth.getCurrentUser();
    if (!current) throw new Error("Please log in first.");

    const convs = this._getConversations();
    let conv = convs.find(c => {
      const parts = c.participants.map(p => this._resolveId(p));
      return parts.includes(current.userId) && parts.includes(targetUserId);
    });

    if (!conv) {
      conv = {
        conversationId: "conv-" + Date.now(),
        participants: [current.userId, targetUserId],
        createdAt: new Date().toISOString(),
        unreadCount: 0,
        messages: []
      };
      convs.unshift(conv);
      this._saveConversations(convs);
    }

    return {
      ...conv,
      otherParticipantId: targetUserId
    };
  }

  sendMessage(convId, { type = "text", text = "", mediaUrl = null, fileName = null, fileSize = null, replyTo = null }) {
    const current = auth.getCurrentUser();
    if (!current) throw new Error("Please log in first.");

    const convs = this._getConversations();
    const conv = convs.find(c => c.conversationId === convId);
    if (!conv) throw new Error("Conversation not found.");

    const messageId = "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);

    const newMsg = {
      id: messageId,
      senderId: current.userId,
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
    this._saveConversations(convs);

    sound.playMessageSent();
    return newMsg;
  }

  editMessage(convId, messageId, newText) {
    const current = auth.getCurrentUser();
    if (!current) return null;

    const convs = this._getConversations();
    const conv = convs.find(c => c.conversationId === convId);
    if (!conv) return null;

    const msg = conv.messages.find(m => m.id === messageId);
    if (msg && (this._resolveId(msg.senderId) === current.userId)) {
      msg.text = newText.trim();
      msg.edited = true;
      msg.editedAt = new Date().toISOString();
      this._saveConversations(convs);
      return msg;
    }
    return null;
  }

  deleteMessage(convId, messageId, mode = "everyone") {
    const current = auth.getCurrentUser();
    if (!current) return false;

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
      if (!msg.deletedFor.includes(current.userId)) {
        msg.deletedFor.push(current.userId);
      }
    }

    this._saveConversations(convs);
    return true;
  }

  toggleReaction(convId, messageId, emoji) {
    const current = auth.getCurrentUser();
    if (!current) return null;

    const convs = this._getConversations();
    const conv = convs.find(c => c.conversationId === convId);
    if (!conv) return null;

    const msg = conv.messages.find(m => m.id === messageId);
    if (!msg) return null;

    msg.reactions = msg.reactions || [];
    let existingReaction = msg.reactions.find(r => r.emoji === emoji);

    if (existingReaction) {
      const userIndex = existingReaction.userIds.map(id => this._resolveId(id)).indexOf(current.userId);
      if (userIndex !== -1) {
        // Remove reaction
        existingReaction.userIds.splice(userIndex, 1);
        if (existingReaction.userIds.length === 0) {
          msg.reactions = msg.reactions.filter(r => r.emoji !== emoji);
        }
      } else {
        // Add reaction
        existingReaction.userIds.push(current.userId);
      }
    } else {
      // New emoji reaction
      msg.reactions.push({
        emoji: emoji,
        userIds: [current.userId]
      });
    }

    this._saveConversations(convs);
    return msg.reactions;
  }

  markAsRead(convId) {
    const current = auth.getCurrentUser();
    if (!current) return;

    const convs = this._getConversations();
    const conv = convs.find(c => c.conversationId === convId);
    if (!conv) return;

    conv.unreadCount = 0;
    conv.messages.forEach(m => {
      if (this._resolveId(m.senderId) !== current.userId && m.status !== "read") {
        m.status = "read";
      }
    });

    this._saveConversations(convs);
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
