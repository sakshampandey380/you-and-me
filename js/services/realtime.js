/* ==========================================================================
   YOU & ME — 3D Chat Application
   Realtime Service (WebSocket Ready Event Hub & Interactive Simulation Engine)
   ========================================================================== */

import { auth } from './auth.js';
import { chatService } from './chat.js';
import { userService } from './user.js';
import { notificationService } from './notification.js';
import { sound } from './sound.js';

class RealtimeService {
  constructor() {
    this.listeners = new Map();
    this.activeConversationId = null;
    this.socket = null; // Ready for ws:// or wss:// in production
    this.isWsConnected = false;
  }

  // Subscribe to realtime events
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

  // Real WebSocket connect method (ready for backend server)
  connectWebSocket(url) {
    if (!url) return;
    try {
      this.socket = new WebSocket(url);
      this.socket.onopen = () => {
        this.isWsConnected = true;
        this.emit('connection:ready', { status: 'connected' });
      };
      this.socket.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);
          this.emit(type, payload);
        } catch (e) {
          console.error("Invalid WS message format", e);
        }
      };
      this.socket.onclose = () => {
        this.isWsConnected = false;
        this.emit('connection:closed', {});
      };
    } catch (e) {
      console.warn("WebSocket not available, falling back to simulated realtime engine", e);
    }
  }

  // Simulate Partner Interactive Responses
  handleUserSentMessage(convId, sentMessage) {
    const conv = chatService.getConversationById(convId);
    if (!conv) return;

    const partnerId = conv.otherParticipantId;
    const partner = userService.getUserById(partnerId);
    if (!partner) return;

    // 1. Simulate Delivered transition after 700ms
    setTimeout(() => {
      sentMessage.status = "delivered";
      this.emit('message:status_update', { messageId: sentMessage.id, status: 'delivered' });
    }, 700);

    // 2. Simulate Read transition after 1400ms
    setTimeout(() => {
      sentMessage.status = "read";
      this.emit('message:status_update', { messageId: sentMessage.id, status: 'read' });
    }, 1400);

    // 3. Simulate Partner Typing indicator
    const typingDelay = 1800 + Math.random() * 800;
    setTimeout(() => {
      // Only show typing if this conversation is active
      this.emit('typing:start', { conversationId: convId, userId: partnerId, userName: partner.name });

      // 4. Partner sends realistic contextual reply after typing
      const replyDelay = 2200 + Math.random() * 1400;
      setTimeout(() => {
        this.emit('typing:stop', { conversationId: convId, userId: partnerId });

        const replyText = this._generatePartnerResponse(partner.name, sentMessage.text);
        const replyMsg = {
          id: "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
          senderId: partnerId,
          type: "text",
          text: replyText,
          timestamp: new Date().toISOString(),
          status: "read",
          reactions: []
        };

        conv.messages.push(replyMsg);
        chatService._saveConversations(chatService._getConversations());

        this.emit('message:received', { conversationId: convId, message: replyMsg });

        if (this.activeConversationId === convId) {
          sound.playMessageReceived();
        } else {
          conv.unreadCount = (conv.unreadCount || 0) + 1;
          chatService._saveConversations(chatService._getConversations());
          notificationService.addNotification({
            type: 'message',
            title: partner.name,
            message: replyText,
            fromUserId: partnerId
          });
        }
      }, replyDelay);
    }, typingDelay);
  }

  _generatePartnerResponse(name, incomingText) {
    const text = (incomingText || "").toLowerCase();
    
    if (text.includes("hey") || text.includes("hello") || text.includes("hi")) {
      return `Hey! Wonderful to hear from you! How is your day going? ✨`;
    }
    if (text.includes("how are you") || text.includes("how r u")) {
      return `I'm doing fantastic! The 3D atmosphere here in You & Me is so mesmerizing 🌟 What about you?`;
    }
    if (text.includes("love") || text.includes("heart") || text.includes("you & me")) {
      return `You & Me has the best romantic 3D vibes! Love the flying hearts and spatial depth ❤️`;
    }
    if (text.includes("photo") || text.includes("pic") || text.includes("image")) {
      return `That looks incredible! The 3D viewer makes it pop out so vividly 📸`;
    }
    if (text.includes("bye") || text.includes("night")) {
      return `Goodnight! Sweet dreams, talk to you soon! 🌙💫`;
    }

    const responses = [
      `I completely agree! The depth and smooth glass look unreal ✨`,
      `That sounds so nice! Tell me more about it 😊`,
      `Absolutely! That made my day ❤️`,
      `Haha that's amazing! Have you tested the reactions bar yet? 🔥`,
      `I love how fluid and fast this chat feels! 🚀`,
      `Always here for you! Let's make today unforgettable 💫`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const realtime = new RealtimeService();
