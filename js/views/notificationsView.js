/* ==========================================================================
   YOU & ME — 3D Chat Application
   Notifications View Controller
   ========================================================================== */

import { notificationService } from '../services/notification.js';
import { toast } from '../components/toast.js';

export class NotificationsView {
  constructor(onOpenConversation) {
    this.onOpenConversation = onOpenConversation;
    this.container = document.getElementById('notifications-view');
  }

  render() {
    if (!this.container) return;

    const notifs = notificationService.getNotifications();

    this.container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 16px;">
        <div class="subview-top-bar">
          <button class="btn-icon mobile-subview-back-btn" data-view="chats" title="Back to Chats">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2 class="subview-header-title">Notifications</h2>
          <div style="display: flex; gap: 8px;">
            <button class="btn-3d btn-glass" id="btn-mark-all-notifs-read" style="padding: 6px 12px; font-size: 12px;">Mark Read</button>
            <button class="btn-3d btn-glass" id="btn-clear-all-notifs" style="padding: 6px 12px; font-size: 12px; color: var(--color-danger);">Clear</button>
          </div>
        </div>

        ${notifs.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">🔔</div>
            <div class="empty-state-title">All Caught Up!</div>
            <div class="empty-state-text">You have no unread notifications right now.</div>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${notifs.map(n => {
              const timeStr = new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return `
                <div class="glass-panel card-3d" style="padding: 14px 18px; display: flex; align-items: center; gap: 14px; border-left: 4px solid ${n.read ? 'transparent' : 'var(--color-romantic-pink)'};">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--glass-surface-2); display: flex; align-items: center; justify-content: center; color: var(--color-romantic-rose);">
                    ${n.type === 'message' ? '💬' : n.type === 'reaction' ? '❤️' : '💌'}
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div style="font-weight: 700; font-size: 14px;">${n.title}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${timeStr}</div>
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">${n.message}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}

        <div class="mobile-view-footer">
          <div class="creator-signature">
            <span>Made by Sakcham</span>
            <span class="heart-icon">❤️</span>
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    document.getElementById('btn-mark-all-notifs-read')?.addEventListener('click', () => {
      notificationService.markAllAsRead();
      toast.success("All marked as read.");
      this.render();
    });

    document.getElementById('btn-clear-all-notifs')?.addEventListener('click', () => {
      notificationService.clearAll();
      toast.info("Notifications cleared.");
      this.render();
    });
  }
}
