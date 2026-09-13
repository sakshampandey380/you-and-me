/* ==========================================================================
   YOU & ME — 3D Chat Application
   Master Application Controller & Router
   "Connect. Chat. Share. Together." | Made by Sakcham ❤️
   ========================================================================== */

import { auth } from './services/auth.js';
import { storage } from './services/storage.js';
import { realtime } from './services/realtime.js';
import { Background3D } from './components/background3d.js';
import { AuthView } from './views/authView.js';
import { ChatListView } from './views/chatListView.js';
import { ChatView } from './views/chatView.js';
import { FriendsView } from './views/friendsView.js';
import { ProfileView } from './views/profileView.js';
import { SettingsView } from './views/settingsView.js';
import { NotificationsView } from './views/notificationsView.js';
import { friendService } from './services/friend.js';

class App {
  constructor() {
    this.currentView = 'chats'; // 'chats' | 'friends' | 'profile' | 'settings' | 'notifications'
    this.bg3D = null;
    this.authView = null;
    this.chatListView = null;
    this.chatView = null;
    this.friendsView = null;
    this.profileView = null;
    this.settingsView = null;
    this.notificationsView = null;

    this.init();
  }

  init() {
    this._applyStoredTheme();

    // Initialize 3D background
    this.bg3D = new Background3D('bg-canvas');

    // Initialize View Controllers
    this.authView = new AuthView((user) => this._handleAuthSuccess(user));
    this.chatListView = new ChatListView('sidebar-conversations-list', (convId) => this.openConversation(convId));
    this.chatView = new ChatView();
    this.friendsView = new FriendsView((convId) => this.openConversation(convId));
    this.profileView = new ProfileView();
    this.settingsView = new SettingsView(() => this._handleLogout());
    this.notificationsView = new NotificationsView((convId) => this.openConversation(convId));

    this._bindGlobalEvents();
    this._bindRealtimeEvents();

    // Start loading sequence
    this._runLoadingSequence();
  }

  _applyStoredTheme() {
    const settings = storage.get('settings') || {};
    const theme = settings.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }

  _runLoadingSequence() {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          this._checkSessionAndRoute();
        }, 500);
      } else {
        this._checkSessionAndRoute();
      }
    }, 1100);
  }

  _checkSessionAndRoute() {
    if (auth.isAuthenticated()) {
      this._showDashboard();
    } else {
      this._showAuth();
    }
  }

  _showAuth() {
    document.getElementById('app-dashboard').style.display = 'none';
    this.authView.show();
  }

  _showDashboard() {
    this.authView.hide();
    const dashboard = document.getElementById('app-dashboard');
    dashboard.style.display = 'flex';

    this._updateGreeting();
    this.chatListView.render();
    this.switchView('chats');
  }

  _handleAuthSuccess(user) {
    this._showDashboard();
  }

  _handleLogout() {
    this.chatView.closeConversation();
    this._showAuth();
  }

  _updateGreeting() {
    const user = auth.getCurrentUser();
    if (!user) return;

    const hour = new Date().getHours();
    let greet = "Good morning";
    let icon = "☀️";

    if (hour >= 12 && hour < 17) {
      greet = "Good afternoon";
      icon = "☀️";
    } else if (hour >= 17 && hour < 22) {
      greet = "Good evening";
      icon = "🌙";
    } else if (hour >= 22 || hour < 5) {
      greet = "Good night";
      icon = "✨";
    }

    const banner = document.getElementById('greeting-text');
    if (banner) {
      banner.innerHTML = `${greet}, <span class="greeting-highlight">${user.name.split(' ')[0]}</span> ${icon}`;
    }
  }

  openConversation(convId) {
    this.switchView('chats');
    this.chatListView.setActive(convId);
    this.chatView.openConversation(convId);
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Hide all subviews
    document.querySelectorAll('.subview-container').forEach(el => el.classList.remove('active'));

    // Nav button states
    document.querySelectorAll('.nav-tab-btn, .mobile-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    const chatScreen = document.getElementById('chat-screen');
    const sidebarList = document.getElementById('sidebar-conversations-list');
    const sidebarSearch = document.querySelector('.sidebar-search-box');

    if (viewName === 'chats') {
      if (chatScreen) chatScreen.style.display = 'flex';
      if (sidebarList) sidebarList.style.display = 'flex';
      if (sidebarSearch) sidebarSearch.style.display = 'block';
      this.chatListView.render();
    } else {
      if (chatScreen) chatScreen.style.display = 'none';

      const targetSubview = document.getElementById(`${viewName}-view`);
      if (targetSubview) targetSubview.classList.add('active');

      if (viewName === 'friends') this.friendsView.render();
      else if (viewName === 'profile') this.profileView.render();
      else if (viewName === 'settings') this.settingsView.render();
      else if (viewName === 'notifications') this.notificationsView.render();

      // On mobile, if active chat was open, return to view
      this.chatView.closeConversation();
    }

    this._updateBadges();
  }

  _updateBadges() {
    const incomingReqs = friendService.getIncomingRequests();
    document.querySelectorAll('.friends-badge').forEach(b => {
      b.textContent = incomingReqs.length;
      b.style.display = incomingReqs.length > 0 ? 'inline-flex' : 'none';
    });
  }

  _bindGlobalEvents() {
    // Navigation Tabs (Sidebar & Mobile Nav)
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchView(btn.dataset.view);
      });
    });

    // Sidebar search filter
    const searchInput = document.getElementById('sidebar-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.chatListView.render(e.target.value);
      });
    }

    // Global Notification listener
    window.addEventListener('ym:notification_added', () => {
      this._updateBadges();
    });

    window.addEventListener('ym:notifications_updated', () => {
      this._updateBadges();
    });
  }

  _bindRealtimeEvents() {
    // Realtime message arrived
    realtime.on('message:received', ({ conversationId, message }) => {
      this.chatListView.render();
      if (this.chatView.currentConvId === conversationId) {
        this.chatView.renderMessages();
        this.chatView.scrollToBottom();
      }
    });

    // Realtime typing start
    realtime.on('typing:start', ({ conversationId, userId, userName }) => {
      this.chatListView.setTyping(conversationId, userName);
      if (this.chatView.currentConvId === conversationId) {
        this.chatView.showTyping(userName);
      }
    });

    // Realtime typing stop
    realtime.on('typing:stop', ({ conversationId }) => {
      this.chatListView.setTyping(conversationId, null);
      if (this.chatView.currentConvId === conversationId) {
        this.chatView.hideTyping();
      }
    });

    // Message status update (sent -> delivered -> read)
    realtime.on('message:status_update', () => {
      if (this.chatView.currentConvId) {
        this.chatView.renderMessages();
      }
    });
  }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.ymApp = new App();
});
