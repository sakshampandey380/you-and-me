import { notificationService } from '../services/notification.js';
import { friendService } from '../services/friend.js';
import { chatService } from '../services/chat.js';
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
              const isFriendReq = n.type === 'friend_request';
              const isFriendAccepted = n.type === 'friend_accepted';

              return `
                <div class="glass-panel card-3d" style="padding: 14px 18px; display: flex; align-items: flex-start; gap: 14px; border-left: 4px solid ${n.read ? 'transparent' : 'var(--color-romantic-pink)'};">
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--glass-surface-2); display: flex; align-items: center; justify-content: center; color: var(--color-romantic-rose); font-size: 18px; flex-shrink: 0; margin-top: 2px;">
                    ${n.type === 'message' ? '💬' : n.type === 'reaction' ? '❤️' : isFriendAccepted ? '🎉' : '💌'}
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div style="font-weight: 700; font-size: 14px;">${n.title}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${timeStr}</div>
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary); margin-top: 3px;">${n.message}</div>

                    ${isFriendReq ? `
                      <div style="display: flex; gap: 8px; margin-top: 10px;">
                        <button type="button" class="btn-3d btn-primary btn-notif-accept" data-req-id="${n.requestId || ''}" data-sender-id="${n.fromUserId || ''}" data-notif-id="${n.id}" style="padding: 6px 14px; font-size: 12px;">
                          Accept Request ✓
                        </button>
                        <button type="button" class="btn-3d btn-glass btn-notif-decline" data-req-id="${n.requestId || ''}" data-notif-id="${n.id}" style="padding: 6px 12px; font-size: 12px; color: var(--color-danger);">
                          Decline
                        </button>
                      </div>
                    ` : ''}

                    ${isFriendAccepted ? `
                      <div style="display: flex; gap: 8px; margin-top: 10px;">
                        <button type="button" class="btn-3d btn-primary btn-notif-chat" data-user-id="${n.fromUserId || ''}" style="padding: 6px 14px; font-size: 12px;">
                          💬 Open Chat
                        </button>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}

        <div class="mobile-view-footer">
          <div class="creator-signature">
            <span>Made by Saksham</span>
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

    // Accept Friend Request Button
    this.container.querySelectorAll('.btn-notif-accept').forEach(btn => {
      btn.addEventListener('click', () => {
        const reqId = btn.dataset.reqId;
        const senderId = btn.dataset.senderId;
        const notifId = btn.dataset.notifId;

        try {
          // If reqId is found directly, use it, or locate through incoming requests
          let resolvedReqId = reqId;
          if (!resolvedReqId && senderId) {
            const incoming = friendService.getIncomingRequests();
            const found = incoming.find(r => r.sender && r.sender.userId === senderId);
            if (found) resolvedReqId = found.requestId;
          }

          if (resolvedReqId) {
            const res = friendService.acceptFriendRequest(resolvedReqId);
            toast.success("Friend request accepted! Chat unlocked ✨");
            this.render();
            if (this.onOpenConversation && res.conversation) {
              this.onOpenConversation(res.conversation.conversationId);
            }
          } else {
            notificationService.removeNotification(notifId);
            toast.info("Request resolved.");
            this.render();
          }
        } catch (err) {
          toast.error(err.message);
          this.render();
        }
      });
    });

    // Decline Friend Request Button
    this.container.querySelectorAll('.btn-notif-decline').forEach(btn => {
      btn.addEventListener('click', () => {
        const reqId = btn.dataset.reqId;
        const notifId = btn.dataset.notifId;
        try {
          if (reqId) {
            friendService.rejectFriendRequest(reqId);
          } else if (notifId) {
            notificationService.removeNotification(notifId);
          }
          toast.info("Friend request declined.");
          this.render();
        } catch (err) {
          toast.error(err.message);
        }
      });
    });

    // Chat button on accepted notification
    this.container.querySelectorAll('.btn-notif-chat').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.dataset.userId;
        if (userId) {
          const conv = chatService.getOrCreateConversation(userId);
          if (this.onOpenConversation) {
            this.onOpenConversation(conv.conversationId);
          }
        }
      });
    });
  }
}
