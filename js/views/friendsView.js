/* ==========================================================================
   YOU & ME — 3D Chat Application
   Friends & Requests View Controller
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { APP_CONFIG } from '../config.js';
import { friendService } from '../services/friend.js';
import { userService } from '../services/user.js';
import { chatService } from '../services/chat.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';
import { cloudSync } from '../services/cloudSync.js';

export class FriendsView {
  constructor(onOpenConversation) {
    this.onOpenConversation = onOpenConversation;
    this.container = document.getElementById('friends-view');
    this.currentSubTab = 'my-friends'; // 'my-friends' | 'requests' | 'search'
    this.searchDebounceTimer = null;
    this._bindEvents();
  }

  render(searchQuery = '') {
    if (!this.container) return;
    this._renderSubTabs();
    if (this.currentSubTab === 'my-friends') this._renderFriendsList();
    else if (this.currentSubTab === 'requests') this._renderRequestsList();
    else if (this.currentSubTab === 'search') {
      this._renderSearchTab(searchQuery);
      // Auto-fetch latest registered cloud users
      cloudSync.pullUsers();
    }
  }

  _bindEvents() {
    document.querySelectorAll('.friends-subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentSubTab = btn.dataset.subtab;
        this.render();
      });
    });

    window.addEventListener('ym:friends_updated', () => {
      this._renderSubTabs();
      if (this.container && this.container.classList.contains('active')) {
        this.render();
      }
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
          <div class="empty-state-text">Search for users by Name, Username, User ID, or Birthday to connect and chat!</div>
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
        ${friends.map(friend => {
          const uid = friend.uid || friend.userId;
          const avatar = friend.profilePicture || friend.avatar || APP_CONFIG.defaultAvatar;
          return `
            <div class="glass-panel card-3d" style="padding: 18px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div class="avatar-wrap">
                  <img src="${avatar}" class="avatar-img" alt="${friend.name}" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
                  <span class="avatar-status ${friend.onlineStatus === 'online' ? 'online' : ''}"></span>
                </div>
                <div style="overflow: hidden;">
                  <div style="font-weight: 700; font-size: 15px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${friend.name}</div>
                  <div style="font-size: 12px; color: var(--color-romantic-rose);">@${friend.username} • <span style="opacity: 0.85; font-family: var(--font-mono);">${uid}</span></div>
                </div>
              </div>
              <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; height: 38px; overflow: hidden; text-overflow: ellipsis;">
                ${friend.bio || 'Hey there! I am using You & Me 🚀'}
              </div>
              <div style="display: flex; gap: 8px; margin-top: auto;">
                <button class="btn-3d btn-primary btn-msg-friend" data-user-id="${uid}" style="flex: 1; padding: 8px 12px; font-size: 13px;">
                  Message
                </button>
                <button class="btn-3d btn-glass btn-remove-friend" data-user-id="${uid}" data-name="${friend.name}" style="padding: 8px 12px; font-size: 13px; color: var(--color-danger);">
                  Remove
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Bind actions
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
          message: `Are you sure you want to remove ${btn.dataset.name} from your friends list?`,
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
          <div class="empty-state-title">No Pending Requests</div>
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
              ${incoming.map(req => {
                const s = req.sender;
                const avatar = s.profilePicture || s.avatar || APP_CONFIG.defaultAvatar;
                const uid = s.uid || s.userId;
                return `
                  <div class="glass-panel card-3d" style="padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                      <img src="${avatar}" class="avatar-img avatar-sm" alt="" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
                      <div style="overflow: hidden;">
                        <div style="font-weight: 700; font-size: 14.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${s.name}</div>
                        <div style="font-size: 11.5px; color: var(--text-muted);">@${s.username} • <span style="font-family: var(--font-mono);">${uid}</span></div>
                      </div>
                    </div>
                    <div style="display: flex; gap: 6px; flex-shrink: 0;">
                      <button class="btn-3d btn-primary btn-accept-req" data-req-id="${req.requestId}" style="padding: 6px 14px; font-size: 12px;">Accept</button>
                      <button class="btn-3d btn-glass btn-reject-req" data-req-id="${req.requestId}" style="padding: 6px 10px; font-size: 12px; color: var(--color-danger);">&times;</button>
                    </div>
                  </div>
                `;
              }).join('')}
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
              ${sent.map(s => {
                const r = s.recipient;
                const avatar = r.profilePicture || r.avatar || APP_CONFIG.defaultAvatar;
                const uid = r.uid || r.userId;
                return `
                  <div class="glass-panel" style="padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                      <img src="${avatar}" class="avatar-img avatar-sm" alt="" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
                      <div style="overflow: hidden;">
                        <div style="font-weight: 600; font-size: 13.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${r.name}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">@${r.username} • <span style="font-family: var(--font-mono);">${uid}</span></div>
                      </div>
                    </div>
                    <button class="btn-3d btn-glass btn-cancel-sent" data-user-id="${uid}" style="padding: 5px 12px; font-size: 11.5px;">Cancel</button>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // Bind incoming actions
    listContainer.querySelectorAll('.btn-accept-req').forEach(btn => {
      btn.addEventListener('click', () => {
        friendService.acceptFriendRequest(btn.dataset.reqId);
        toast.success("Friend request accepted! You can now chat ✨");
        this.render();
      });
    });

    listContainer.querySelectorAll('.btn-reject-req').forEach(btn => {
      btn.addEventListener('click', () => {
        friendService.rejectFriendRequest(btn.dataset.reqId);
        toast.info("Friend request declined.");
        this.render();
      });
    });

    listContainer.querySelectorAll('.btn-cancel-sent').forEach(btn => {
      btn.addEventListener('click', () => {
        friendService.cancelSentRequest(btn.dataset.userId);
        toast.info("Request canceled.");
        this.render();
      });
    });
  }

  _renderSearchTab(initialQuery = '') {
    const listContainer = document.getElementById('friends-subview-content');
    if (!listContainer) return;

    // Load registered users (strictly excluding self)
    const allEnrolled = userService.getAllEnrolledUsers({ excludeSelf: true });

    // Quick chips from actual enrolled accounts
    const dynamicChipsHtml = allEnrolled.slice(0, 8).map(u => `
      <button type="button" class="search-chip" data-query="@${u.username}">@${u.username}</button>
    `).join('');

    listContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="search-tab-header">
          <div class="input-with-icon" style="max-width: 540px; width: 100%;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="user-global-search-input" placeholder="Search by name, @username, User ID (SK-XXXXXX), or DOB..." value="${initialQuery ? this._escapeHtml(initialQuery) : ''}" autofocus />
            <button id="user-global-search-clear" class="search-clear-btn" style="${initialQuery ? 'display: flex;' : 'display: none;'}" title="Clear search">&times;</button>
          </div>
          <div class="search-helper-chips" id="search-helper-chips-container">
            <span class="chip-label">Quick Search:</span>
            ${dynamicChipsHtml || '<span style="font-size: 11.5px; color: var(--text-muted);">No other users registered yet</span>'}
          </div>
        </div>

        <div id="user-search-status-bar" style="font-size: 13.5px; font-weight: 600; color: var(--text-secondary); margin-top: 4px;"></div>

        <div id="user-search-results" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px;">
          <!-- Results inserted dynamically -->
        </div>
      </div>
    `;

    const searchInput = document.getElementById('user-global-search-input');
    const clearBtn = document.getElementById('user-global-search-clear');
    const resultsContainer = document.getElementById('user-search-results');
    const statusBar = document.getElementById('user-search-status-bar');

    const updateChips = () => {
      const chipsContainer = document.getElementById('search-helper-chips-container');
      if (!chipsContainer) return;
      const enrolled = userService.getAllEnrolledUsers({ excludeSelf: true });
      const chips = enrolled.slice(0, 8).map(u => `
        <button type="button" class="search-chip" data-query="@${u.username}">@${u.username}</button>
      `).join('');
      chipsContainer.innerHTML = `<span class="chip-label">Quick Search:</span>` + (chips || '<span style="font-size: 11.5px; color: var(--text-muted);">No other users registered yet</span>');
      chipsContainer.querySelectorAll('.search-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          if (searchInput) {
            searchInput.value = chip.dataset.query;
            doSearch(chip.dataset.query);
            searchInput.focus();
          }
        });
      });
    };

    const doSearch = async (query) => {
      const q = String(query || '').trim();
      if (clearBtn) {
        clearBtn.style.display = q ? 'flex' : 'none';
      }

      const isDefault = !q;
      let results = isDefault 
        ? userService.getAllEnrolledUsers({ excludeSelf: true }) 
        : userService.searchUsers(q, { excludeSelf: false });

      // If specific search returns 0 local results, perform a quick cloud search to catch newly registered users on other devices
      if (!isDefault && results.length === 0) {
        if (statusBar) {
          statusBar.innerHTML = `🔍 <span>Searching cloud registry for "<strong>${this._escapeHtml(q)}</strong>"...</span>`;
        }
        await cloudSync.pullUsers();
        results = userService.searchUsers(q, { excludeSelf: false });
        updateChips();
      }

      if (statusBar) {
        if (isDefault) {
          statusBar.innerHTML = `👥 <span>Registered Community Members (${results.length} total)</span>`;
        } else {
          statusBar.innerHTML = `🔍 <span>Found ${results.length} ${results.length === 1 ? 'user' : 'users'} matching "<strong>${this._escapeHtml(q)}</strong>"</span>`;
        }
      }

      if (results.length === 0) {
        resultsContainer.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; padding: 40px 20px;">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-title">No Users Found</div>
            <div class="empty-state-text" style="max-width: 440px; line-height: 1.6;">
              No matches found for "<strong>${this._escapeHtml(q)}</strong>".<br/>
              <strong>Search by:</strong><br/>
              • <strong>Full Name</strong> (e.g. <em>Rahul Sharma</em>)<br/>
              • <strong>Username</strong> (e.g. <em>@rahul</em> or <em>rahul</em>)<br/>
              • <strong>User ID / UID</strong> (e.g. <em>SK-A82K92</em>)<br/>
              • <strong>Date of Birth</strong> (e.g. <em>YYYY-MM-DD</em> or <em>12/05/2006</em>)
            </div>
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = results.map(u => {
        const uid = u.uid || u.userId;
        const status = friendService.getFriendshipStatus(uid);
        let actionBtn = '';

        if (u.isSelf) {
          actionBtn = `
            <button class="btn-3d btn-glass btn-view-self-profile" style="padding:6px 14px; font-size:12px;" title="View Your Profile">
              👤 Your Profile
            </button>
          `;
        } else if (status === 'friends') {
          actionBtn = `
            <button class="btn-3d btn-primary btn-msg-user" data-user-id="${uid}" style="padding:6px 14px; font-size:12px;" title="Open Chat">
              💬 Friends
            </button>
          `;
        } else if (status === 'request_sent') {
          actionBtn = `
            <button class="btn-3d btn-glass btn-cancel-search-req" data-user-id="${uid}" style="padding:6px 12px; font-size:12px;" title="Click to cancel request">
              Request Sent ✕
            </button>
          `;
        } else if (status === 'request_received') {
          actionBtn = `
            <button class="btn-3d btn-primary btn-accept-search-req" data-user-id="${uid}" style="padding:6px 12px; font-size:12px;">
              Accept Request ✓
            </button>
          `;
        } else {
          // Stranger -> Add Friend (Requirement 11)
          actionBtn = `
            <button class="btn-3d btn-primary btn-add-user" data-user-id="${uid}" style="padding:6px 14px; font-size:12px;" title="Send friend request">
              ➕ Add Friend
            </button>
          `;
        }

        const avatar = u.profilePicture || u.avatar || APP_CONFIG.defaultAvatar;
        const dobText = u.dob || u.birthday ? ` • 🎂 ${u.dob || u.birthday}` : '';

        return `
          <div class="glass-panel card-3d" style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                <div class="avatar-wrap">
                  <img src="${avatar}" class="avatar-img avatar-sm" alt="" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
                  <span class="avatar-status ${u.onlineStatus === 'online' ? 'online' : ''}"></span>
                </div>
                <div style="overflow: hidden;">
                  <div style="font-weight: 700; font-size: 14.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${u.name}</div>
                  <div style="font-size: 11.5px; color: var(--color-romantic-rose);">@${u.username} • <span style="font-family: var(--font-mono);">${uid}</span>${dobText}</div>
                </div>
              </div>
            </div>
            <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4; height: 34px; overflow: hidden; text-overflow: ellipsis;">
              ${u.bio || 'Hey there! I am using You & Me 🚀'}
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
              ${actionBtn}
            </div>
          </div>
        `;
      }).join('');

      // Bind search results actions
      resultsContainer.querySelectorAll('.btn-add-user').forEach(btn => {
        btn.addEventListener('click', () => {
          try {
            friendService.sendFriendRequest(btn.dataset.userId);
            toast.success("Friend request sent! 💌");
            doSearch(searchInput ? searchInput.value : '');
          } catch (err) {
            toast.error(err.message);
          }
        });
      });

      resultsContainer.querySelectorAll('.btn-cancel-search-req').forEach(btn => {
        btn.addEventListener('click', () => {
          friendService.cancelSentRequest(btn.dataset.userId);
          toast.info("Request canceled.");
          doSearch(searchInput ? searchInput.value : '');
        });
      });

      resultsContainer.querySelectorAll('.btn-accept-search-req').forEach(btn => {
        btn.addEventListener('click', () => {
          const incoming = friendService.getIncomingRequests();
          const found = incoming.find(r => r.sender && (r.sender.uid === btn.dataset.userId || r.sender.userId === btn.dataset.userId));
          if (found) {
            friendService.acceptFriendRequest(found.requestId);
            toast.success("Friend request accepted! ✨");
            doSearch(searchInput ? searchInput.value : '');
          }
        });
      });

      resultsContainer.querySelectorAll('.btn-msg-user').forEach(btn => {
        btn.addEventListener('click', () => {
          const conv = chatService.getOrCreateConversation(btn.dataset.userId);
          if (this.onOpenConversation) {
            this.onOpenConversation(conv.conversationId);
          }
        });
      });

      resultsContainer.querySelectorAll('.btn-view-self-profile').forEach(btn => {
        btn.addEventListener('click', () => {
          if (window.ymApp) window.ymApp.switchView('profile');
        });
      });
    };

    // Live search input with debounce
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchDebounceTimer);
        this.searchDebounceTimer = setTimeout(() => {
          doSearch(e.target.value);
        }, 120);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          clearBtn.style.display = 'none';
          doSearch('');
          searchInput.focus();
        }
      });
    }

    // Quick chips
    listContainer.querySelectorAll('.search-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = chip.dataset.query;
          doSearch(chip.dataset.query);
          searchInput.focus();
        }
      });
    });

    // Run initial search
    doSearch(initialQuery);
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
