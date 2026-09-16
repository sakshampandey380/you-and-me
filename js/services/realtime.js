/* ==========================================================================
   YOU & ME — 3D Chat Application
   Realtime Service (Event Hub & Live Delivery Simulation)
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { chatService } from './chat.js';
import { storage } from './storage.js';
import { auth } from './auth.js';

class RealtimeService {
  constructor() {
    this.listeners = new Map();
    this.activeConversationId = null;
    this._initStorageListeners();
  }

  _initStorageListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('ym:storage_changed', (e) => {
        if (e.detail && e.detail.key === 'app_conversations') {
          this._handleExternalConversationsUpdate();
        }
      });
    }
  }

  _handleExternalConversationsUpdate() {
    if (!this.activeConversationId) return;
    const conv = chatService.getConversationById(this.activeConversationId);
    if (!conv || !conv.messages) return;

    const current = auth.getCurrentUser();
    const currentUid = current ? String(current.uid || current.userId || '').toUpperCase() : '';
    const lastMsg = conv.messages[conv.messages.length - 1];

    if (lastMsg && String(lastMsg.senderId).toUpperCase() !== currentUid) {
      this.emit('message:received', { conversationId: this.activeConversationId, message: lastMsg });
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
    this.listeners.set(event, callbacks);
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(payload));
    }
  }

  setActiveConversation(convId) {
    this.activeConversationId = convId;
  }

  handleUserSentMessage(convId, sentMessage) {
    if (!convId || !sentMessage) return;

    // Simulate realistic network delivery transition
    setTimeout(() => {
      sentMessage.status = "delivered";
      this.emit('message:status_update', { messageId: sentMessage.id, status: 'delivered' });
    }, 600);
  }
}

export const realtime = new RealtimeService();
