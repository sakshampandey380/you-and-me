/* ==========================================================================
   YOU & ME — 3D Chat Application
   Real-Time User Search Suggestions Dropdown Component
   ========================================================================== */

import { APP_CONFIG } from '../config.js';
import { userService } from '../services/user.js';
import { friendService } from '../services/friend.js';
import { chatService } from '../services/chat.js';
import { toast } from './toast.js';

export class SearchSuggestions {
  constructor({ inputId, containerId, onOpenConversation, onOpenFriendsView, onOpenProfileView }) {
    this.inputId = inputId;
    this.containerId = containerId;
    this.input = document.getElementById(inputId);
    this.container = document.getElementById(containerId);
    this.onOpenConversation = onOpenConversation;
    this.onOpenFriendsView = onOpenFriendsView;
    this.onOpenProfileView = onOpenProfileView;
    this.isOpen = false;
    this.selectedIndex = -1;
    this.currentResults = [];
    this.debounceTimer = null;

    this._ensureElements();
    this._init();
  }

  _ensureElements() {
    if (!this.input && this.inputId) {
      this.input = document.getElementById(this.inputId);
    }
    if (!this.container && this.containerId) {
      this.container = document.getElementById(this.containerId);
    }
  }

  _init() {
    this._ensureElements();
    if (!this.input) return;

    // Input listener
    this.input.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.search(e.target.value);
      }, 150);
    });

    // Focus listener to show instant suggestions
    this.input.addEventListener('focus', () => {
      this.search(this.input.value);
    });

    // Keyboard navigation
    this.input.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigate(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigate(-1);
      } else if (e.key === 'Enter') {
        if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
          e.preventDefault();
          this.selectUser(this.currentResults[this.selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      }
    });

    // Click outside dismissal
    document.addEventListener('click', (e) => {
      if (!this.isOpen) return;
      this._ensureElements();
      const clickedInside = (this.container && this.container.contains(e.target)) ||
                            (this.input && this.input.contains(e.target));
      if (!clickedInside) {
        this.close();
      }
    });
  }

  search(query) {
    this._ensureElements();
    if (!this.container) return;

    const q = (query || '').trim();
    if (!q) {
      // Show registered users (excluding self)
      this.currentResults = userService.getSuggestedUsers(12, false).filter(u => !u.isSelf);
      this.render(this.currentResults, '', true);
      return;
    }

    // Include self when searching so user can see their own account with [You] badge if searched
    this.currentResults = userService.searchUsers(q, { limit: 12, excludeSelf: false });
    this.render(this.currentResults, q, false);
  }

  navigate(dir) {
    if (!this.currentResults || this.currentResults.length === 0) return;
    this.selectedIndex = Math.max(-1, Math.min(this.currentResults.length - 1, this.selectedIndex + dir));
    this._highlightSelected();
  }

  _highlightSelected() {
    this._ensureElements();
    if (!this.container) return;
    const items = this.container.querySelectorAll('.suggestion-item');
    items.forEach((el, idx) => {
      el.classList.toggle('selected', idx === this.selectedIndex);
      if (idx === this.selectedIndex) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  render(results, query, isSuggestions = false) {
    this.selectedIndex = -1;
    this._ensureElements();
    if (!this.container) return;

    if (!results || results.length === 0) {
      this.container.innerHTML = `
        <div class="suggestions-empty-state">
          <div class="suggestions-empty-icon">🔍</div>
          <div class="suggestions-empty-title">No user found</div>
          <div class="suggestions-empty-subtitle">
            No matches for <strong>"${this._escapeHtml(query)}"</strong>.
            <div class="suggestions-search-tip">
              💡 <strong>Best ways to search:</strong><br/>
              • By <strong>Full Name</strong> (e.g. <em>John Doe</em>)<br/>
              • By <strong>Username</strong> with or without @ (e.g. <em>@john</em> or <em>john</em>)<br/>
              • By <strong>User ID</strong> (e.g. <em>YM-123456</em> or <em>123456</em>)<br/>
              • By <strong>Birthday / DOB</strong> (e.g. <em>YYYY-MM-DD</em> or <em>DD/MM</em>)
            </div>
          </div>
        </div>
      `;
      this.open();
      return;
    }

    const headerTitle = isSuggestions
      ? `<span>✨ People You May Know</span>`
      : `<span>Matches (${results.length})</span>`;

    const html = `
      <div class="suggestions-header">
        ${headerTitle}
        <span class="suggestions-hint">Search by Name, @Username, User ID, or DOB</span>
      </div>
      <div class="suggestions-list" role="listbox">
        ${results.map((u, idx) => this._renderItem(u, query, idx)).join('')}
      </div>
      <div class="suggestions-footer">
        <button type="button" class="btn-goto-find-friends-global" id="btn-suggestions-more">
          Browse all users in Find Friends &rarr;
        </button>
      </div>
    `;

    this.container.innerHTML = html;
    this._bindItemEvents();
    this.open();
  }

  _renderItem(u, query, index) {
    const status = friendService.getFriendshipStatus(u.userId);
    let actionBtn = '';
    let badgeClass = 'status-none';
    let badgeText = 'User';

    if (u.isSelf) {
      actionBtn = `
        <button type="button" class="btn-3d btn-glass btn-suggestion-self" data-user-id="${u.userId}" title="Your Profile" style="padding: 6px 12px; font-size: 11.5px; opacity: 0.9;">
          👤 You
        </button>
      `;
      badgeClass = 'status-friend';
      badgeText = 'Your Account';
    } else if (status === 'friends') {
      actionBtn = `
        <button type="button" class="btn-3d btn-primary btn-suggestion-chat" data-user-id="${u.userId}" title="Open chat">
          💬 Friends
        </button>
      `;
      badgeClass = 'status-friend';
      badgeText = 'Friends ✓';
    } else if (status === 'request_sent') {
      actionBtn = `
        <button type="button" class="btn-3d btn-glass btn-suggestion-cancel" data-user-id="${u.userId}" title="Click to cancel request">
          Request Sent
        </button>
      `;
      badgeClass = 'status-pending';
      badgeText = 'Request Sent';
    } else if (status === 'request_received') {
      actionBtn = `
        <button type="button" class="btn-3d btn-primary btn-suggestion-respond" data-user-id="${u.userId}" title="Accept connection">
          Accept Request
        </button>
      `;
      badgeClass = 'status-incoming';
      badgeText = 'Pending';
    } else {
      actionBtn = `
        <button type="button" class="btn-3d btn-primary btn-suggestion-add" data-user-id="${u.userId}" title="Send friend request">
          ➕ Add Friend
        </button>
      `;
      badgeClass = 'status-none';
      badgeText = 'Registered User';
    }

    const isOnline = u.onlineStatus === 'online';
    const avatarImg = u.profilePicture || APP_CONFIG.defaultAvatar;
    const displayName = u.displayName || u.name;

    // Highlight query matches
    const nameDisplay = this._highlightMatch(displayName, query);
    const usernameDisplay = this._highlightMatch('@' + u.username, query.replace(/^@+/, ''));
    const idDisplay = this._highlightMatch(u.userId, query.replace(/[^a-z0-9]/gi, ''));
    const dobValue = u.dob || u.birthday || '';
    const dobDisplay = dobValue ? `<span class="user-dob-badge" style="font-size: 10.5px; color: var(--text-muted); margin-left: 6px;">🎂 ${this._highlightMatch(dobValue, query)}</span>` : '';

    return `
      <div class="suggestion-item card-3d" data-index="${index}" data-user-id="${u.userId}">
        <div class="avatar-wrap">
          <img src="${avatarImg}" class="avatar-img avatar-sm" alt="${displayName}" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
          <span class="avatar-status ${isOnline ? 'online' : ''}"></span>
        </div>
        <div class="suggestion-info">
          <div class="suggestion-top-row">
            <span class="suggestion-name">${nameDisplay}</span>
            <span class="suggestion-badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="suggestion-mid-row">
            <span class="suggestion-username">${usernameDisplay}</span>
            <span class="user-id-badge" title="User ID: Click to copy" data-copy-id="${u.userId}">
              🆔 ${idDisplay}
            </span>
            ${dobDisplay}
          </div>
        </div>
        <div class="suggestion-actions">
          ${actionBtn}
        </div>
      </div>
    `;
  }

  _bindItemEvents() {
    // Clicking on whole item row (excluding buttons)
    this.container.querySelectorAll('.suggestion-item').forEach(el => {
      el.addEventListener('click', (e) => {
        // If clicking action button or copy badge, let dedicated handlers handle it
        if (e.target.closest('.suggestion-actions') || e.target.closest('[data-copy-id]')) return;
        const userId = el.dataset.userId;
        const user = userService.getUserById(userId);
        if (user) {
          this.selectUser(user);
        }
      });
    });

    // Copy User ID badge click
    this.container.querySelectorAll('[data-copy-id]').forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const idToCopy = badge.dataset.copyId;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(idToCopy).then(() => {
            toast.success(`Copied ID: ${idToCopy} 📋`);
          }).catch(() => {
            toast.info(`ID: ${idToCopy}`);
          });
        } else {
          toast.info(`ID: ${idToCopy}`);
        }
      });
    });

    // Chat button click
    this.container.querySelectorAll('.btn-suggestion-chat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const userId = btn.dataset.userId;
        const conv = chatService.getOrCreateConversation(userId);
        this.close();
        if (this.onOpenConversation) {
          this.onOpenConversation(conv.conversationId);
        }
      });
    });

    // Add Friend button click
    this.container.querySelectorAll('.btn-suggestion-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const userId = btn.dataset.userId;
        try {
          const user = userService.getUserById(userId);
          friendService.sendFriendRequest(userId);
          const name = user ? `${user.name} (${user.userId})` : userId;
          toast.success(`Friend request sent to ${name}! 💌`);
          window.dispatchEvent(new CustomEvent('ym:friends_updated'));
          this.search(this.input.value);
        } catch (err) {
          toast.error(err.message);
        }
      });
    });

    // Cancel Sent Request
    this.container.querySelectorAll('.btn-suggestion-cancel').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const userId = btn.dataset.userId;
        friendService.cancelSentRequest(userId);
        toast.info("Request canceled.");
        window.dispatchEvent(new CustomEvent('ym:friends_updated'));
        this.search(this.input.value);
      });
    });

    // Respond / Accept button
    this.container.querySelectorAll('.btn-suggestion-respond').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const userId = btn.dataset.userId;
        try {
          const incoming = friendService.getIncomingRequests();
          const req = incoming.find(r => r.sender && r.sender.userId === userId);
          if (req) {
            friendService.acceptFriendRequest(req.requestId);
            toast.success("Friend request accepted! Chat unlocked ✨");
            window.dispatchEvent(new CustomEvent('ym:friends_updated'));
            this.search(this.input.value);
          } else if (this.onOpenFriendsView) {
            this.close();
            this.onOpenFriendsView('requests');
          }
        } catch (err) {
          toast.error(err.message);
        }
      });
    });

    // Self button click
    this.container.querySelectorAll('.btn-suggestion-self').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
        if (this.onOpenProfileView) {
          this.onOpenProfileView();
        } else if (this.onOpenFriendsView) {
          this.onOpenFriendsView('profile');
        }
      });
    });

    // View more in Find Friends
    this.container.querySelector('#btn-suggestions-more')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
      if (this.onOpenFriendsView) {
        this.onOpenFriendsView('search');
      }
    });
  }

  selectUser(user) {
    if (!user) return;
    this.close();

    if (user.isSelf) {
      if (this.onOpenProfileView) {
        this.onOpenProfileView();
      } else if (this.onOpenFriendsView) {
        this.onOpenFriendsView('profile');
      }
      return;
    }

    // Directly open or start conversation with the selected registered user
    const conv = chatService.getOrCreateConversation(user.userId);
    if (this.onOpenConversation) {
      this.onOpenConversation(conv.conversationId);
    }
  }

  _highlightMatch(text, query) {
    if (!text) return '';
    if (!query || !query.trim()) return this._escapeHtml(text);

    const q = query.trim();
    const cleanQ = q.replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanQ) return this._escapeHtml(text);

    try {
      const regex = new RegExp(`(${cleanQ})`, 'gi');
      return this._escapeHtml(text).replace(regex, '<mark class="search-highlight">$1</mark>');
    } catch (e) {
      return this._escapeHtml(text);
    }
  }

  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  open() {
    this.isOpen = true;
    this._ensureElements();
    if (this.container) {
      this.container.style.display = 'flex';
      this.container.classList.add('active');
    }
  }

  close() {
    this.isOpen = false;
    this._ensureElements();
    if (this.container) {
      this.container.style.display = 'none';
      this.container.classList.remove('active');
    }
    this.selectedIndex = -1;
  }
}
