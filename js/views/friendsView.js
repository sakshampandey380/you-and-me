/* ==========================================================================
   YOU & ME — 3D Chat Application
   Friends & Requests View Controller
   ========================================================================== */

import { friendService } from '../services/friend.js';
import { userService } from '../services/user.js';
import { chatService } from '../services/chat.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export class FriendsView {
  constructor(onOpenConversation) {
    this.onOpenConversation = onOpenConversation;
    this.container = document.getElementById('friends-view');
    this.currentSubTab = 'my-friends'; // 'my-friends' | 'requests' | 'search'
    this._bindEvents();
  }

  render() {
    if (!this.container) return;
    this._renderSubTabs();
    if (this.currentSubTab === 'my-friends') this._renderFriendsList();
    else if (this.currentSubTab === 'requests') this._renderRequestsList();
    else if (this.currentSubTab === 'search') this._renderSearchTab();
  }

  _bindEvents() {
    document.querySelectorAll('.friends-subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentSubTab = btn.dataset.subtab;
        this.render();
      });
    });
  }

  _renderSubTabs() {
    const incoming = friendService.getIncomingRequests();
    const reqBadge = document.getElementById('requests-badge-count');
    if (reqBadge) {
      reqBadge.textContent = incoming.length;
      reqBadge.style.display = incoming.length > 0 ? 'inline-flex' : 'none';
    }

    document.querySelectorAll('.friends-subtab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.subtab === this.currentSubTab);
    });
  }

  _renderFriendsList() {
    const listContainer = document.getElementById('friends-subview-content');
    if (!listContainer) return;

    const friends = friendService.getFriendsList();

    if (friends.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">👥</div>
          <div class="empty-state-title">Build Your Circle</div>
          <div class="empty-state-text">Search for users and connect with friends to start chatting!</div>
          <button class="btn-3d btn-primary btn-goto-find-friends" style="margin-top: 10px; font-size: 13px; padding: 8px 18px;">
            Find Friends
          </button>
        </div>
      `;
      listContainer.querySelector('.btn-goto-find-friends')?.addEventListener('click', () => {
        this.currentSubTab = 'search';
        this.render();
      });
      return;
    }

    listContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
        ${friends.map(friend => `
          <div class="glass-panel card-3d" style="padding: 18px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div class="avatar-wrap">
                <img src="${friend.profilePicture}" class="avatar-img" alt="${friend.name}" />
                <span class="avatar-status ${friend.onlineStatus === 'online' ? 'online' : ''}"></span>
              </div>
              <div style="overflow: hidden;">
                <div style="font-weight: 700; font-size: 15px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${friend.name}</div>
                <div style="font-size: 12px; color: var(--color-romantic-rose);">@${friend.username} • <span style="opacity: 0.8;">${friend.userId}</span></div>
              </div>
            </div>
            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; height: 38px; overflow: hidden; text-overflow: ellipsis;">
              ${friend.bio || 'Hey there! I am using You & Me 🚀'}
            </div>
            <div style="display: flex; gap: 8px; margin-top: auto;">
              <button class="btn-3d btn-primary btn-msg-friend" data-user-id="${friend.userId}" style="flex: 1; padding: 8px 12px; font-size: 13px;">
                Message
              </button>
              <button class="btn-3d btn-glass btn-remove-friend" data-user-id="${friend.userId}" data-name="${friend.name}" style="padding: 8px 12px; font-size: 13px; color: var(--color-danger);">
                Remove
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Bind friend card actions
    listContainer.querySelectorAll('.btn-msg-friend').forEach(btn => {
      btn.addEventListener('click', () => {
        const conv = chatService.getOrCreateConversation(btn.dataset.userId);
        if (this.onOpenConversation) {
          this.onOpenConversation(conv.conversationId);
        }
      });
    });

    listContainer.querySelectorAll('.btn-remove-friend').forEach(btn => {
      btn.addEventListener('click', async () => {
        const ok = await modal.confirm({
          title: "Remove Friend?",
          message: `Are you sure you want to remove ${btn.dataset.name} from your friends?`,
          confirmText: "Remove",
          isDanger: true
        });
        if (ok) {
          friendService.removeFriend(btn.dataset.userId);
          toast.info("Friend removed.");
          this.render();
        }
      });
    });
  }

  _renderRequestsList() {
    const listContainer = document.getElementById('friends-subview-content');
    if (!listContainer) return;

    const incoming = friendService.getIncomingRequests();
    const sent = friendService.getSentRequests();

    if (incoming.length === 0 && sent.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">💌</div>
          <div class="empty-state-title">No New Requests</div>
          <div class="empty-state-text">You have no pending friend requests at this time.</div>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Incoming Section -->
        <div>
          <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: var(--color-romantic-rose);">
            Incoming Requests (${incoming.length})
          </h4>
          ${incoming.length === 0 ? '<div style="font-size: 13px; color: var(--text-muted);">No incoming requests.</div>' : `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px;">
              ${incoming.map(req => `
                <div class="glass-panel card-3d" style="padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                    <img src="${req.sender.profilePicture}" class="avatar-img avatar-sm" alt="" />
                    <div style="overflow: hidden;">
                      <div style="font-weight: 700; font-size: 14.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${req.sender.name}</div>
                      <div style="font-size: 11.5px; color: var(--text-muted);">@${req.sender.username} • ${req.sender.userId}</div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 6px; flex-shrink: 0;">
                    <button class="btn-3d btn-primary btn-accept-req" data-req-id="${req.requestId}" style="padding: 6px 12px; font-size: 12px;">Accept</button>
                    <button class="btn-3d btn-glass btn-reject-req" data-req-id="${req.requestId}" style="padding: 6px 10px; font-size: 12px; color: var(--color-danger);">&times;</button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Sent Section -->
        <div>
          <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: var(--text-secondary);">
            Sent Pending Requests (${sent.length})
          </h4>
          ${sent.length === 0 ? '<div style="font-size: 13px; color: var(--text-muted);">No sent pending requests.</div>' : `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;">
              ${sent.map(s => `
                <div class="glass-panel" style="padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <img src="${s.recipient.profilePicture}" class="avatar-img avatar-sm" alt="" />
                    <div style="overflow: hidden;">
                      <div style="font-weight: 600; font-size: 13.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${s.recipient.name}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">@${s.recipient.username}</div>
                    </div>
                  </div>
                  <button class="btn-3d btn-glass btn-cancel-sent" data-user-id="${s.recipient.userId}" style="padding: 5px 10px; font-size: 11.5px;">Cancel</button>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // Bind incoming actions
    listContainer.querySelectorAll('.btn-accept-req').forEach(btn => {
      btn.addEventListener('click', () => {
        friendService.acceptFriendRequest(btn.dataset.reqId);
        toast.success("Friend request accepted! ✨");
        window.dispatchEvent(new CustomEvent('ym:friends_updated'));
        this.render();
      });
    });

    listContainer.querySelectorAll('.btn-reject-req').forEach(btn => {
      btn.addEventListener('click', () => {
        friendService.rejectFriendRequest(btn.dataset.reqId);
        toast.info("Request declined.");
        window.dispatchEvent(new CustomEvent('ym:friends_updated'));
        this.render();
      });
    });

    listContainer.querySelectorAll('.btn-cancel-sent').forEach(btn => {
      btn.addEventListener('click', () => {
        friendService.cancelSentRequest(btn.dataset.userId);
        toast.info("Request canceled.");
        window.dispatchEvent(new CustomEvent('ym:friends_updated'));
        this.render();
      });
    });
  }

  _renderSearchTab() {
    const listContainer = document.getElementById('friends-subview-content');
    if (!listContainer) return;

    listContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div class="input-with-icon" style="max-width: 500px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="user-global-search-input" placeholder="Search by name, @username, or User ID (e.g. YM-482913)..." autofocus />
        </div>
        <div id="user-search-results" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px;">
          <!-- Results inserted dynamically -->
        </div>
      </div>
    `;

    const searchInput = document.getElementById('user-global-search-input');
    const resultsContainer = document.getElementById('user-search-results');

    const doSearch = (query) => {
      const results = userService.searchUsers(query);
      if (results.length === 0) {
        resultsContainer.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-title">No Users Found</div>
            <div class="empty-state-text">Try searching with a different name, username or User ID.</div>
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = results.map(u => {
        const status = friendService.getFriendshipStatus(u.userId);
        let actionBtn = '';

        if (status === 'friends') {
          actionBtn = `<button class="btn-3d btn-glass" disabled style="padding:6px 12px; font-size:12px; opacity:0.7;">Friends ✓</button>`;
        } else if (status === 'request_sent') {
          actionBtn = `<button class="btn-3d btn-glass btn-cancel-search-req" data-user-id="${u.userId}" style="padding:6px 12px; font-size:12px;">Pending (Cancel)</button>`;
        } else if (status === 'request_received') {
          actionBtn = `<button class="btn-3d btn-primary btn-respond-search-req" style="padding:6px 12px; font-size:12px;">Respond</button>`;
        } else {
          actionBtn = `<button class="btn-3d btn-primary btn-add-user" data-user-id="${u.userId}" style="padding:6px 12px; font-size:12px;">Add Friend +</button>`;
        }

        return `
          <div class="glass-panel card-3d" style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${u.profilePicture}" class="avatar-img" alt="" />
              <div style="overflow: hidden;">
                <div style="font-weight: 700; font-size: 14.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${u.name}</div>
                <div style="font-size: 12px; color: var(--color-romantic-rose);">@${u.username} • ${u.userId}</div>
              </div>
            </div>
            <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4; height: 34px; overflow: hidden; text-overflow: ellipsis;">
              ${u.bio || 'Available for conversations ✨'}
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: auto;">
              ${actionBtn}
            </div>
          </div>
        `;
      }).join('');

      // Bind search card buttons
      resultsContainer.querySelectorAll('.btn-add-user').forEach(btn => {
        btn.addEventListener('click', () => {
          try {
            const targetUser = userService.getUserById(btn.dataset.userId);
            friendService.sendFriendRequest(btn.dataset.userId);
            const targetDisplay = targetUser ? `${targetUser.name} (${targetUser.userId})` : btn.dataset.userId;
            toast.success(`Friend request sent to ${targetDisplay}! 💌`);
            window.dispatchEvent(new CustomEvent('ym:friends_updated'));
            doSearch(searchInput.value);
          } catch (err) {
            toast.error(err.message);
          }
        });
      });

      resultsContainer.querySelectorAll('.btn-cancel-search-req').forEach(btn => {
        btn.addEventListener('click', () => {
          friendService.cancelSentRequest(btn.dataset.userId);
          toast.info("Request canceled.");
          window.dispatchEvent(new CustomEvent('ym:friends_updated'));
          doSearch(searchInput.value);
        });
      });
    };

    searchInput.addEventListener('input', (e) => doSearch(e.target.value));
    // Initial display of suggestions
    doSearch('');
  }
}
