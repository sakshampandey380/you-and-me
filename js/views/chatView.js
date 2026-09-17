/* ==========================================================================
   YOU & ME — 3D Chat Application
   Chat View Controller (Active Conversation, 3D Bubbles, Composer, Media, Translation)
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { chatService } from '../services/chat.js';
import { userService } from '../services/user.js';
import { auth } from '../services/auth.js';
import { realtime } from '../services/realtime.js';
import { translationService } from '../services/translation.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';
import { mediaViewer } from '../components/mediaViewer.js';
import { mediaPreview } from '../components/mediaPreview.js';
import { EmojiPicker } from '../components/emojiPicker.js';
import { storage } from '../services/storage.js';

export class ChatView {
  constructor() {
    this.currentConvId = null;
    this.replyTargetMessage = null; // { id, senderName, text }
    this.activeContextMenu = null;
    this.emojiPicker = null;
    this.translatedMessages = new Map(); // msgId -> { text, originalText, targetLang }

    this.container = document.getElementById('chat-screen');
    this.messagesContainer = document.getElementById('chat-messages');
    this.composerTextarea = document.getElementById('composer-textarea');
    this.replyPreviewBar = document.getElementById('reply-preview-bar');
    this.typingRow = document.getElementById('chat-typing-row');
    this.searchBar = document.getElementById('chat-search-bar');

    this._initEmojiPicker();
    this._bindEvents();
  }

  _initEmojiPicker() {
    this.emojiPicker = new EmojiPicker((emoji) => {
      if (this.composerTextarea) {
        this.composerTextarea.value += emoji;
        this.composerTextarea.focus();
        this._autoGrowTextarea();
      }
    });
  }

  openConversation(convId) {
    this.currentConvId = convId;
    realtime.setActiveConversation(convId);
    chatService.markAsRead(convId);

    const conv = chatService.getConversationById(convId);
    if (!conv) return;

    const partner = userService.getUserById(conv.otherParticipantId);
    if (!partner) return;

    // Update Header
    const avatarEl = document.getElementById('chat-header-avatar');
    if (avatarEl) avatarEl.src = partner.profilePicture || partner.avatar;
    const nameEl = document.getElementById('chat-header-name');
    if (nameEl) nameEl.textContent = partner.name;
    const statusEl = document.getElementById('chat-header-status');
    if (statusEl) {
      statusEl.textContent = partner.onlineStatus === 'online' ? 'Online' : `Last seen ${partner.lastSeen || 'recently'}`;
      statusEl.className = `chat-header-status ${partner.onlineStatus === 'online' ? 'online' : ''}`;
    }

    this.cancelReply();
    this.closeSearch();
    this.renderMessages();

    // Mobile layout shift
    document.querySelector('.app-sidebar')?.classList.add('chat-open');
    document.querySelector('.app-main-view')?.classList.add('chat-open');
    document.querySelector('.app-dashboard')?.classList.add('in-chat');

    this.scrollToBottom();
  }

  closeSearch() {
    if (this.searchBar) {
      this.searchBar.classList.remove('active');
      this.searchBar.style.display = 'none';
    }
    const searchInput = document.getElementById('chat-search-input');
    if (searchInput) {
      searchInput.value = '';
    }
  }

  toggleSearch() {
    if (!this.searchBar) return;
    const isVisible = this.searchBar.classList.contains('active') || this.searchBar.style.display === 'flex';
    const searchInput = document.getElementById('chat-search-input');

    if (isVisible) {
      this.closeSearch();
      this.renderMessages('');
    } else {
      this.searchBar.classList.add('active');
      this.searchBar.style.display = 'flex';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
    }
  }

  closeConversation() {
    this.currentConvId = null;
    realtime.setActiveConversation(null);
    document.querySelector('.app-sidebar')?.classList.remove('chat-open');
    document.querySelector('.app-main-view')?.classList.remove('chat-open');
    document.querySelector('.app-dashboard')?.classList.remove('in-chat');

    const chatScreen = document.getElementById('chat-screen');
    const welcomePlaceholder = document.getElementById('chat-welcome-placeholder');
    if (chatScreen) chatScreen.style.display = 'none';
    if (welcomePlaceholder && window.ymApp && window.ymApp.currentView === 'chats') {
      welcomePlaceholder.style.display = 'flex';
    }
  }

  renderMessages(searchQuery = '') {
    if (!this.messagesContainer || !this.currentConvId) return;

    const conv = chatService.getConversationById(this.currentConvId);
    if (!conv) return;

    const current = auth.getCurrentUser();
    const currentUid = current ? String(current.uid || current.userId || '').toUpperCase() : '';
    this.messagesContainer.innerHTML = '';

    let lastSenderId = null;
    let lastDateStr = null;

    conv.messages.forEach(msg => {
      // Check if deleted for me
      if (msg.deletedFor && msg.deletedFor.map(id => String(id).toUpperCase()).includes(currentUid)) {
        return;
      }

      // Filter by in-chat search query if searching
      if (searchQuery) {
        const textToMatch = String(msg.text || '').toLowerCase();
        const fileNameToMatch = String(msg.fileName || '').toLowerCase();
        const q = searchQuery.toLowerCase();
        if (!textToMatch.includes(q) && !fileNameToMatch.includes(q)) {
          return;
        }
      }

      // Date Separator
      const msgDate = new Date(msg.timestamp);
      const dateStr = this._formatDateSeparator(msgDate);
      if (dateStr !== lastDateStr) {
        const sep = document.createElement('div');
        sep.className = 'date-separator';
        sep.textContent = dateStr;
        this.messagesContainer.appendChild(sep);
        lastDateStr = dateStr;
      }

      const isOutgoing = String(msg.senderId).toUpperCase() === currentUid;
      const isConsecutive = lastSenderId === msg.senderId;
      lastSenderId = msg.senderId;

      const row = document.createElement('div');
      row.className = `message-row ${isOutgoing ? 'outgoing' : 'incoming'} ${isConsecutive ? 'consecutive' : ''} anim-message-enter`;
      row.dataset.msgId = msg.id;

      // Inner bubble content
      let contentHtml = '';

      // Quoted Reply Preview
      if (msg.replyTo) {
        contentHtml += `
          <div class="quoted-message-box" data-reply-to-id="${msg.replyTo.id}">
            <div class="quoted-sender">${msg.replyTo.senderName}</div>
            <div class="quoted-text">${this._escapeHtml(msg.replyTo.text)}</div>
          </div>
        `;
      }

      // Render Body by Type
      if (msg.type === 'deleted') {
        contentHtml += `<div style="font-style:italic; opacity:0.6;">🚫 This message was deleted</div>`;
      } else if (msg.type === 'image') {
        contentHtml += `
          <div class="message-image-wrap" data-img-url="${msg.mediaUrl}">
            <img src="${msg.mediaUrl}" alt="Photo message" />
          </div>
          ${msg.text ? `<div style="margin-top:6px;">${this._formatFormattedText(msg.text, searchQuery)}</div>` : ''}
        `;
      } else if (msg.type === 'video') {
        contentHtml += `
          <div class="message-video-wrap">
            <video src="${msg.mediaUrl}" controls style="max-width: 100%; border-radius: 12px;"></video>
          </div>
          ${msg.text ? `<div style="margin-top:6px;">${this._formatFormattedText(msg.text, searchQuery)}</div>` : ''}
        `;
      } else if (msg.type === 'file') {
        contentHtml += `
          <a href="${msg.mediaUrl}" download="${msg.fileName || 'file'}" class="message-file-wrap" style="color:inherit; text-decoration:none;">
            <div class="message-file-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <div class="message-file-details">
              <div class="message-file-name">${this._escapeHtml(msg.fileName || 'Document')}</div>
              <div class="message-file-size">${this._escapeHtml(msg.fileSize || 'File')}</div>
            </div>
          </a>
          ${msg.text ? `<div style="margin-top:4px;">${this._formatFormattedText(msg.text, searchQuery)}</div>` : ''}
        `;
      } else {
        // Text or large emoji
        const isEmojiOnly = this._isOnlyEmojis(msg.text);
        if (isEmojiOnly) {
          row.classList.add('emoji-row');
          contentHtml += `<div class="message-bubble emoji-only">${msg.text}</div>`;
        } else {
          // Check if this message was translated
          const translation = this.translatedMessages.get(msg.id);
          const activeText = translation ? translation.text : msg.text;
          const formatted = this._formatFormattedText(activeText, searchQuery);

          contentHtml += `<div>${formatted}</div>`;

          if (translation) {
            contentHtml += `
              <div class="translation-toggle-bar" data-msg-id="${msg.id}" style="font-size: 11px; color: var(--color-cyan-accent); margin-top: 5px; cursor: pointer; display: flex; align-items: center; gap: 4px; user-select: none;">
                <span>🌐 Translated to ${translation.targetLang}</span>
                <span style="opacity: 0.8; text-decoration: underline;">(Show Original)</span>
              </div>
            `;
          } else if (!isOutgoing && msg.text && msg.text.length > 1) {
            // Quick subtle translation action on incoming text
            contentHtml += `
              <div class="quick-translate-btn" data-msg-id="${msg.id}" style="font-size: 10.5px; opacity: 0.6; margin-top: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; user-select: none;">
                <span>🌐 Translate</span>
              </div>
            `;
          }
        }
      }

      // Metadata (Time & Read Status)
      const timeStr = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let statusIcon = '';
      if (isOutgoing && msg.type !== 'deleted') {
        if (msg.status === 'read') {
          statusIcon = `<span class="message-status-icon read" title="Read">✓✓</span>`;
        } else if (msg.status === 'delivered') {
          statusIcon = `<span class="message-status-icon" title="Delivered">✓✓</span>`;
        } else {
          statusIcon = `<span class="message-status-icon" title="Sent">✓</span>`;
        }
      }

      const metaHtml = `
        <div class="message-meta">
          ${msg.edited ? '<span style="font-size:10px; opacity:0.8; margin-right:4px;">Edited</span>' : ''}
          <span>${timeStr}</span>
          ${statusIcon}
        </div>
      `;

      // Assemble bubble
      if (!row.classList.contains('emoji-row')) {
        row.innerHTML = `<div class="message-bubble">${contentHtml}${metaHtml}</div>`;
      } else {
        row.innerHTML += metaHtml;
      }

      // Reactions under bubble
      if (msg.reactions && msg.reactions.length > 0) {
        const reactionsBar = document.createElement('div');
        reactionsBar.className = 'message-reactions';
        msg.reactions.forEach(r => {
          const isReactedByMe = r.userIds.map(id => String(id).toUpperCase()).includes(currentUid);
          const pill = document.createElement('span');
          pill.className = `reaction-pill ${isReactedByMe ? 'reacted-by-me' : ''}`;
          pill.innerHTML = `${r.emoji} <span style="font-size:11px; opacity:0.85;">${r.userIds.length}</span>`;
          pill.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleReaction(msg.id, r.emoji);
          });
          reactionsBar.appendChild(pill);
        });
        row.appendChild(reactionsBar);
      }

      // Bubble interactions: Click on image opens lightbox
      const imgWrap = row.querySelector('.message-image-wrap');
      if (imgWrap) {
        imgWrap.addEventListener('click', (e) => {
          e.stopPropagation();
          mediaViewer.open(imgWrap.dataset.imgUrl, 'image', msg.text || 'photo');
        });
      }

      // Click quoted message scrolls to original
      const quotedBox = row.querySelector('.quoted-message-box');
      if (quotedBox) {
        quotedBox.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetId = quotedBox.dataset.replyToId;
          const targetRow = this.messagesContainer.querySelector(`[data-msg-id="${targetId}"]`);
          if (targetRow) {
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetRow.classList.add('highlight-pulse');
            setTimeout(() => targetRow.classList.remove('highlight-pulse'), 1200);
          }
        });
      }

      // Quick Translate trigger
      const quickTransBtn = row.querySelector('.quick-translate-btn');
      if (quickTransBtn) {
        quickTransBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.translateMessage(msg.id, msg.text);
        });
      }

      // Toggle back to original translation trigger
      const transToggleBar = row.querySelector('.translation-toggle-bar');
      if (transToggleBar) {
        transToggleBar.addEventListener('click', (e) => {
          e.stopPropagation();
          this.translatedMessages.delete(msg.id);
          this.renderMessages(searchQuery);
        });
      }

      // Context menu
      const bubble = row.querySelector('.message-bubble');
      if (bubble) {
        bubble.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this._showContextMenu(e, msg, isOutgoing);
        });

        // Long-press for mobile
        let pressTimer;
        bubble.addEventListener('touchstart', (e) => {
          pressTimer = setTimeout(() => {
            const touch = e.touches[0];
            this._showContextMenu({ clientX: touch.clientX, clientY: touch.clientY }, msg, isOutgoing);
          }, 500);
        }, { passive: true });

        bubble.addEventListener('touchend', () => clearTimeout(pressTimer));
        bubble.addEventListener('touchmove', () => clearTimeout(pressTimer));
      }

      this.messagesContainer.appendChild(row);
    });

    if (searchQuery && this.messagesContainer.children.length === 0) {
      this.messagesContainer.innerHTML = `
        <div class="empty-state" style="padding: 40px 20px;">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">No messages found</div>
          <div class="empty-state-text">No messages matching "<strong>${this._escapeHtml(searchQuery)}</strong>" in this chat.</div>
        </div>
      `;
    }
  }

  async translateMessage(msgId, text) {
    if (!msgId || !text) return;

    try {
      const userLang = translationService.getUserPreferredLanguage();
      const targetLang = userLang || 'English';
      const result = await translationService.translate(text, targetLang);

      if (result.isTranslated) {
        this.translatedMessages.set(msgId, {
          text: result.text,
          originalText: text,
          targetLang: result.targetLang
        });
        this.renderMessages();
        toast.info(`Translated to ${result.targetLang} 🌐`);
      } else {
        toast.info("Message is already in the preferred language.");
      }
    } catch (e) {
      toast.error("Translation unavailable.");
    }
  }

  _formatFormattedText(text, searchQuery = '') {
    if (!text) return '';
    let escaped = this._escapeHtml(text);

    // Inline formatting (Requirement 26)
    // 1. Bold: *text* or **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/(^|[^*])\*(?!\s)([^*]+)(?!\s)\*(?=[^*]|$)/g, '$1<strong>$2</strong>');
    // 2. Italic: _text_
    escaped = escaped.replace(/(^|[^_])_(?!\s)([^_]+)(?!\s)_(?=[^_]|$)/g, '$1<em>$2</em>');
    // 3. Strikethrough: ~text~
    escaped = escaped.replace(/(^|[^~])~(?!\s)([^~]+)(?!\s)~(?=[^~]|$)/g, '$1<del>$2</del>');
    // 4. Code: `code`
    escaped = escaped.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.25); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:0.9em;">$1</code>');
    // 5. Autolink URLs
    escaped = escaped.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:var(--color-cyan-accent); text-decoration:underline;">$1</a>');

    // Highlight search if searching
    if (searchQuery) {
      const cleanQ = this._escapeHtml(searchQuery);
      try {
        const regex = new RegExp(`(${cleanQ})`, 'gi');
        escaped = escaped.replace(regex, `<mark style="background:var(--color-romantic-pink); color:#fff; border-radius:3px; padding:0 2px;">$1</mark>`);
      } catch (e) {}
    }

    return escaped;
  }

  _showContextMenu(e, msg, isOutgoing) {
    this._closeContextMenu();

    const menu = document.createElement('div');
    menu.className = 'message-context-menu card-3d';

    const reactions = ['❤️', '😂', '👍', '😮', '😢', '🔥', '👏'];

    menu.innerHTML = `
      <div class="quick-reactions-dock">
        ${reactions.map(r => `<button class="quick-react-btn" data-emoji="${r}">${r}</button>`).join('')}
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" data-action="reply">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
        Reply
      </div>
      ${msg.text ? `
        <div class="context-menu-item" data-action="translate">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          Translate (Hindi/English)
        </div>
        <div class="context-menu-item" data-action="copy">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy Text
        </div>
      ` : ''}
      <div class="context-menu-item danger" data-action="delete-me">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        Delete for me
      </div>
      ${isOutgoing && msg.type !== 'deleted' ? `
        <div class="context-menu-item danger" data-action="delete-everyone">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete for everyone
        </div>
      ` : ''}
    `;

    // Position menu safely
    const x = Math.min(window.innerWidth - 200, Math.max(10, e.clientX || 50));
    const y = Math.min(window.innerHeight - 260, Math.max(10, e.clientY || 50));
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    // Bind Quick Reacts
    menu.querySelectorAll('.quick-react-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.toggleReaction(msg.id, btn.dataset.emoji);
        this._closeContextMenu();
      });
    });

    // Bind actions
    menu.querySelector('[data-action="reply"]')?.addEventListener('click', () => {
      this.startReply(msg);
      this._closeContextMenu();
    });

    menu.querySelector('[data-action="translate"]')?.addEventListener('click', () => {
      this.translateMessage(msg.id, msg.text);
      this._closeContextMenu();
    });

    menu.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
      if (msg.text) {
        navigator.clipboard.writeText(msg.text);
        toast.success("Copied to clipboard!");
      }
      this._closeContextMenu();
    });

    menu.querySelector('[data-action="delete-me"]')?.addEventListener('click', async () => {
      const ok = await modal.confirm({
        title: "Delete Message?",
        message: "This will delete this message for you only.",
        confirmText: "Delete",
        isDanger: true
      });
      if (ok) {
        chatService.deleteMessage(this.currentConvId, msg.id, 'me');
        this.renderMessages();
      }
      this._closeContextMenu();
    });

    menu.querySelector('[data-action="delete-everyone"]')?.addEventListener('click', async () => {
      const ok = await modal.confirm({
        title: "Delete for Everyone?",
        message: "This message will be deleted for everyone in this conversation.",
        confirmText: "Delete for Everyone",
        isDanger: true
      });
      if (ok) {
        chatService.deleteMessage(this.currentConvId, msg.id, 'everyone');
        this.renderMessages();
      }
      this._closeContextMenu();
    });

    document.body.appendChild(menu);
    this.activeContextMenu = menu;

    setTimeout(() => {
      document.addEventListener('click', () => this._closeContextMenu(), { once: true });
    }, 10);
  }

  _closeContextMenu() {
    if (this.activeContextMenu) {
      if (this.activeContextMenu.parentElement) {
        this.activeContextMenu.parentElement.removeChild(this.activeContextMenu);
      }
      this.activeContextMenu = null;
    }
  }

  toggleReaction(msgId, emoji) {
    chatService.toggleReaction(this.currentConvId, msgId, emoji);
    this.renderMessages();
  }

  startReply(msg) {
    const current = auth.getCurrentUser();
    const currentUid = current ? String(current.uid || current.userId || '') : '';
    const isMe = String(msg.senderId).toUpperCase() === currentUid.toUpperCase();
    const senderName = isMe ? "You" : (document.getElementById('chat-header-name')?.textContent || "Friend");

    this.replyTargetMessage = {
      id: msg.id,
      senderName: senderName,
      text: msg.text || (msg.type === 'image' ? 'Photo' : msg.type === 'video' ? 'Video' : 'Attachment')
    };

    document.getElementById('reply-preview-sender').textContent = `Replying to ${senderName}`;
    document.getElementById('reply-preview-text').textContent = this.replyTargetMessage.text;
    this.replyPreviewBar.classList.add('active');
    this.composerTextarea.focus();
  }

  cancelReply() {
    this.replyTargetMessage = null;
    if (this.replyPreviewBar) this.replyPreviewBar.classList.remove('active');
  }

  showTyping(userName) {
    if (!this.typingRow) return;
    this.typingRow.style.display = 'flex';
    document.getElementById('typing-user-label').textContent = `${userName} is typing`;
    this.scrollToBottom();
  }

  hideTyping() {
    if (this.typingRow) this.typingRow.style.display = 'none';
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }
    }, 50);
  }

  _bindEvents() {
    // Back Button (Mobile)
    document.getElementById('chat-back-btn')?.addEventListener('click', () => {
      this.closeConversation();
      if (window.ymApp) {
        window.ymApp.switchView('chats');
      }
    });

    // Cancel Reply Button
    document.getElementById('cancel-reply-btn')?.addEventListener('click', () => {
      this.cancelReply();
    });

    // In-Chat Search Bar Toggle & Live Filtering
    const searchToggleBtn = document.getElementById('chat-search-toggle-btn');
    const searchInput = document.getElementById('chat-search-input');
    const searchCloseBtn = document.getElementById('chat-search-close-btn');

    if (searchToggleBtn) {
      searchToggleBtn.addEventListener('click', () => {
        this.toggleSearch();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderMessages(e.target.value.trim());
      });
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeSearch();
          this.renderMessages('');
        }
      });
    }

    if (searchCloseBtn) {
      searchCloseBtn.addEventListener('click', () => {
        this.closeSearch();
        this.renderMessages('');
      });
    }

    // Send Button
    document.getElementById('composer-send-btn')?.addEventListener('click', () => {
      this.sendCurrentTextMessage();
    });

    // Composer Input & Keydown
    if (this.composerTextarea) {
      this.composerTextarea.addEventListener('input', () => this._autoGrowTextarea());
      this.composerTextarea.addEventListener('keydown', (e) => {
        const settings = storage.get('app_settings') || {};
        const enterToSend = settings.enterToSend !== false;

        if (enterToSend && e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendCurrentTextMessage();
        }
      });
    }

    // Emoji Picker Toggle Button
    const emojiBtn = document.getElementById('composer-emoji-btn');
    if (emojiBtn) {
      emojiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emojiPicker.toggle(emojiBtn);
      });
    }

    // Attachments Handling
    const fileInput = document.getElementById('chat-file-input');
    const attachBtn = document.getElementById('composer-attach-btn');

    if (attachBtn && fileInput) {
      attachBtn.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Size check: 1.8MB limit for local storage
        if (file.size > 1.8 * 1024 * 1024) {
          toast.error("This file is too large to store locally.");
          fileInput.value = '';
          return;
        }

        let type = 'file';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';

        const reader = new FileReader();
        reader.onload = async (evt) => {
          const dataUrl = evt.target.result;
          const result = await mediaPreview.show({ file, dataUrl, type });
          if (result.confirmed) {
            try {
              const sentMsg = chatService.sendMessage(this.currentConvId, {
                type: type,
                text: result.caption || '',
                mediaUrl: dataUrl,
                fileName: file.name,
                fileSize: `${(file.size / 1024).toFixed(1)} KB`,
                replyTo: this.replyTargetMessage
              });
              this.cancelReply();
              this.renderMessages();
              this.scrollToBottom();
              realtime.handleUserSentMessage(this.currentConvId, sentMsg);
            } catch (err) {
              toast.error(err.message || "This file is too large to store locally.");
            }
          }
          fileInput.value = '';
        };
        reader.readAsDataURL(file);
      });
    }

    // In-Chat Search Button
    document.getElementById('chat-search-toggle-btn')?.addEventListener('click', () => {
      this.toggleSearch();
    });

    document.getElementById('chat-search-close-btn')?.addEventListener('click', () => {
      this.closeSearch();
    });

    document.getElementById('chat-search-input')?.addEventListener('input', (e) => {
      this.renderMessages(e.target.value.trim());
    });

    // Voice Call feature indicator
    document.getElementById('chat-call-btn')?.addEventListener('click', () => {
      toast.info("📞 Secure 3D voice call feature ready for WebRTC connection!");
    });
  }

  sendCurrentTextMessage() {
    if (!this.composerTextarea || !this.currentConvId) return;

    const text = this.composerTextarea.value.trim();
    if (!text) return;

    try {
      const sentMsg = chatService.sendMessage(this.currentConvId, {
        type: "text",
        text: text,
        replyTo: this.replyTargetMessage
      });

      this.composerTextarea.value = '';
      this._autoGrowTextarea();
      this.cancelReply();
      this.renderMessages();
      this.scrollToBottom();

      realtime.handleUserSentMessage(this.currentConvId, sentMsg);
    } catch (err) {
      toast.error(err.message || "Failed to send message.");
    }
  }

  _autoGrowTextarea() {
    if (!this.composerTextarea) return;
    this.composerTextarea.style.height = 'auto';
    this.composerTextarea.style.height = Math.min(this.composerTextarea.scrollHeight, 120) + 'px';
  }

  _formatDateSeparator(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  _isOnlyEmojis(text) {
    if (!text) return false;
    const clean = text.trim();
    if (clean.length > 8) return false;
    const emojiRegex = /^(?:[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\u{FE0F})+$/u;
    return emojiRegex.test(clean);
  }

  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
