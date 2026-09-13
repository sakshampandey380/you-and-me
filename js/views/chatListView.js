/* ==========================================================================
   YOU & ME — 3D Chat Application
   Chat List View Controller (Conversations in Sidebar)
   ========================================================================== */

import { chatService } from '../services/chat.js';
import { userService } from '../services/user.js';
import { auth } from '../services/auth.js';

export class ChatListView {
  constructor(containerId, onSelectConversation) {
    this.container = document.getElementById(containerId);
    this.onSelectConversation = onSelectConversation;
    this.activeConvId = null;
    this.typingMap = new Map(); // convId -> typingUserName
  }

  setTyping(convId, userName) {
    if (userName) {
      this.typingMap.set(convId, userName);
    } else {
      this.typingMap.delete(convId);
    }
    this.render();
  }

  setActive(convId) {
    this.activeConvId = convId;
    this.render();
  }

  render(filter = '') {
    if (!this.container) return;

    const convs = chatService.getConversations();
    const current = auth.getCurrentUser();

    if (convs.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">✨</div>
          <div class="empty-state-title">No Chats Yet</div>
          <div class="empty-state-text">Your conversations are waiting. Connect with friends to start chatting!</div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = '';
    const q = filter.toLowerCase().trim();

    convs.forEach(conv => {
      const partner = userService.getUserById(conv.otherParticipantId);
      if (!partner) return;

      if (q && !partner.name.toLowerCase().includes(q) && !partner.username.toLowerCase().includes(q)) {
        return;
      }

      const item = document.createElement('div');
      item.className = `chat-list-item card-3d ${conv.conversationId === this.activeConvId ? 'active' : ''}`;

      // Format last message preview
      let lastMsgText = "No messages yet";
      let lastMsgClass = "";

      if (this.typingMap.has(conv.conversationId)) {
        lastMsgText = "typing...";
        lastMsgClass = "typing";
      } else if (conv.lastMessage) {
        if (conv.lastMessage.type === 'image') {
          lastMsgText = "📷 Photo";
        } else if (conv.lastMessage.type === 'video') {
          lastMsgText = "🎥 Video";
        } else if (conv.lastMessage.type === 'file') {
          lastMsgText = "📎 Document";
        } else if (conv.lastMessage.type === 'deleted') {
          lastMsgText = "🚫 Message deleted";
        } else {
          lastMsgText = conv.lastMessage.text || "";
        }
      }

      // Format time
      let timeStr = "";
      if (conv.lastMessage) {
        const d = new Date(conv.lastMessage.timestamp);
        timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      const isOnline = partner.onlineStatus === 'online';

      item.innerHTML = `
        <div class="avatar-wrap">
          <img src="${partner.profilePicture}" class="avatar-img" alt="${partner.name}" />
          <span class="avatar-status ${isOnline ? 'online' : ''}"></span>
        </div>
        <div class="chat-item-info">
          <div class="chat-item-header">
            <span class="chat-item-name">${partner.name}</span>
            <span class="chat-item-time">${timeStr}</span>
          </div>
          <div class="chat-item-bottom">
            <span class="chat-item-lastmsg ${lastMsgClass}">${lastMsgText}</span>
            ${conv.unreadCount > 0 ? `<span class="badge-count">${conv.unreadCount}</span>` : ''}
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        if (this.onSelectConversation) {
          this.onSelectConversation(conv.conversationId);
        }
      });

      this.container.appendChild(item);
    });
  }
}
