/* ==========================================================================
   YOU & ME — 3D Chat Application
   Chat List View Controller (Conversations in Sidebar)
   ========================================================================== */

import { APP_CONFIG } from '../config.js';
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

    const q = filter.toLowerCase().trim();

    if (convs.length === 0 && !q) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">✨</div>
          <div class="empty-state-title">No Chats Yet</div>
          <div class="empty-state-text">Your conversations will appear here. Find friends to start chatting in 3D!</div>
          <button class="btn-3d btn-primary" id="btn-empty-find-friends" style="margin-top: 10px; font-size: 13px; padding: 8px 18px;">
            Find Friends
          </button>
        </div>
      `;
      return;
    }

    this.container.innerHTML = '';
    let renderedCount = 0;

    convs.forEach(conv => {
      const partner = userService.getUserById(conv.otherParticipantId);
      if (!partner) return;

      if (q) {
        const cleanUserQ = q.replace(/^@+/, '');
        const cleanIdQ = q.replace(/[^a-z0-9]/gi, '');
        const partnerName = (partner.name || '').toLowerCase();
        const partnerUser = (partner.username || '').toLowerCase();
        const partnerRawId = (partner.userId || '').toLowerCase();
        const partnerCleanId = partnerRawId.replace(/[^a-z0-9]/gi, '');
        const partnerNumId = partnerRawId.replace(/^[^\d]+/, '');

        const matchName = partnerName.includes(q);
        const matchUser = cleanUserQ ? partnerUser.includes(cleanUserQ) : false;
        const matchId = cleanIdQ.length >= 2 && (partnerCleanId.includes(cleanIdQ) || partnerNumId.includes(cleanIdQ) || partnerRawId.includes(q));

        if (!matchName && !matchUser && !matchId) {
          return;
        }
      }

      renderedCount++;

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
          <div class="chat-item-sub">
            <span class="chat-item-user">@${partner.username}</span>
            <span class="chat-item-id-pill" title="User ID: ${partner.userId}">${partner.userId}</span>
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

    if (q) {
      const current = auth.getCurrentUser();
      const currentUid = current ? String(current.uid || current.userId || '').toUpperCase() : '';
      const matchedUsers = userService.searchUsers(q, { limit: 10, excludeSelf: true });
      // Filter out users who already have an active conversation displayed above
      const convPartnerIds = convs.map(c => String(c.otherParticipantId || '').toUpperCase());
      const otherMatchedUsers = matchedUsers.filter(u => !convPartnerIds.includes(String(u.uid || u.userId || '').toUpperCase()));

      if (otherMatchedUsers.length > 0) {
        const divider = document.createElement('div');
        divider.style.cssText = 'font-size: 11px; font-weight: 700; color: var(--color-romantic-rose); padding: 12px 6px 4px 6px; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; justify-content: space-between;';
        divider.innerHTML = `<span>Registered Users (${otherMatchedUsers.length})</span><span style="font-size: 10px; color: var(--text-muted);">Click to chat</span>`;
        this.container.appendChild(divider);

        otherMatchedUsers.forEach(u => {
          const isSelf = current && current.userId === u.userId;
          const userItem = document.createElement('div');
          userItem.className = 'chat-list-item card-3d';
          const avatar = u.profilePicture || APP_CONFIG.defaultAvatar;
          const isOnline = u.onlineStatus === 'online';

          userItem.innerHTML = `
            <div class="avatar-wrap">
              <img src="${avatar}" class="avatar-img" alt="${u.name}" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
              <span class="avatar-status ${isOnline ? 'online' : ''}"></span>
            </div>
            <div class="chat-item-info">
              <div class="chat-item-header">
                <span class="chat-item-name">${u.name} ${isSelf ? '<span style="font-size: 10px; padding: 1px 6px; border-radius: 6px; background: rgba(0, 230, 118, 0.2); color: var(--color-success);">You</span>' : ''}</span>
              </div>
              <div class="chat-item-sub">
                <span class="chat-item-user">@${u.username}</span>
                <span class="chat-item-id-pill" title="User ID: ${u.userId}">🆔 ${u.userId}</span>
              </div>
            </div>
            <div style="margin-left: auto;">
              ${isSelf 
                ? '<span style="font-size: 11px; color: var(--text-muted);">Profile</span>' 
                : '<button type="button" class="btn-3d btn-primary" style="padding: 5px 12px; font-size: 11.5px;">💬 Chat</button>'
              }
            </div>
          `;

          userItem.addEventListener('click', () => {
            if (isSelf) {
              if (window.ymApp) window.ymApp.switchView('profile');
              return;
            }
            const conv = chatService.getOrCreateConversation(u.userId);
            if (this.onSelectConversation) {
              this.onSelectConversation(conv.conversationId);
            }
          });

          this.container.appendChild(userItem);
        });
      }

      if (renderedCount === 0 && otherMatchedUsers.length === 0) {
        this.container.innerHTML = `
          <div class="empty-state" style="padding: 24px 14px;">
            <div class="empty-state-icon" style="width: 48px; height: 48px; font-size: 22px;">🔍</div>
            <div class="empty-state-title" style="font-size: 15px;">No user found</div>
            <div class="empty-state-text" style="font-size: 12.5px;">
              No registered user found for "<strong>${q}</strong>". Check the spelling of username, name, or User ID.
            </div>
          </div>
        `;
      }
    }
  }
}
