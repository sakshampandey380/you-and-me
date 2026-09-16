/* ==========================================================================
   YOU & ME — 3D Chat Application
   Notification Service (Isolated User In-App Center & Event Dispatch)
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { storage } from './storage.js';
import { sound } from './sound.js';
import { auth } from './auth.js';

class NotificationService {
  _getNotifications() {
    return storage.get('app_notifications') || [];
  }

  _saveNotifications(list) {
    storage.set('app_notifications', list);
  }

  _getCurrentUid() {
    const current = auth.getCurrentUser();
    return current ? String(current.uid || current.userId || '') : null;
  }

  getNotifications(targetUserId = null) {
    const currentId = targetUserId ? String(targetUserId) : this._getCurrentUid();
    const list = this._getNotifications();

    const scoped = list.filter(n => {
      if (!currentId) return false;
      const to = String(n.toUserId || n.recipientUid || '');
      return to.toUpperCase() === currentId.toUpperCase();
    });

    return scoped.sort((a, b) => new Date(b.timestamp || b.createdAt).getTime() - new Date(a.timestamp || a.createdAt).getTime());
  }

  getUnreadCount(targetUserId = null) {
    const currentId = targetUserId ? String(targetUserId) : this._getCurrentUid();
    if (!currentId) return 0;
    const list = this._getNotifications();

    return list.filter(n => {
      const to = String(n.toUserId || n.recipientUid || '');
      return to.toUpperCase() === currentId.toUpperCase() && !n.read;
    }).length;
  }

  addNotification({ type, title, message, fromUserId = null, toUserId = null, requestId = null }) {
    if (!toUserId) return null;
    const list = this._getNotifications();
    const notifId = "notif-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    const newNotif = {
      id: notifId,
      notificationId: notifId,
      type: type, // 'message' | 'friend_request' | 'friend_accepted' | 'reaction'
      title: title,
      message: message,
      fromUserId: fromUserId,
      senderUid: fromUserId,
      toUserId: toUserId,
      recipientUid: toUserId,
      requestId: requestId,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      read: false
    };

    list.unshift(newNotif);
    this._saveNotifications(list);

    try {
      sound.playNotification();
    } catch (e) {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:notification_added', { detail: newNotif }));
      window.dispatchEvent(new CustomEvent('ym:notifications_updated'));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_notifications' } }));
    }
    return newNotif;
  }

  removeNotification(notifId) {
    const list = this._getNotifications();
    const filtered = list.filter(n => (n.id !== notifId && n.notificationId !== notifId));
    this._saveNotifications(filtered);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:notifications_updated'));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_notifications' } }));
    }
    return true;
  }

  removeNotificationByRequestId(requestId) {
    if (!requestId) return false;
    const list = this._getNotifications();
    const filtered = list.filter(n => n.requestId !== requestId);
    this._saveNotifications(filtered);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:notifications_updated'));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_notifications' } }));
    }
    return true;
  }

  markAllAsRead() {
    const currentId = this._getCurrentUid();
    if (!currentId) return;
    const list = this._getNotifications();
    list.forEach(n => {
      const to = String(n.toUserId || n.recipientUid || '');
      if (to.toUpperCase() === currentId.toUpperCase()) {
        n.read = true;
      }
    });
    this._saveNotifications(list);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:notifications_updated'));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_notifications' } }));
    }
  }

  clearAll() {
    const currentId = this._getCurrentUid();
    if (!currentId) return;
    const list = this._getNotifications();
    // Only clear current user's notifications, leaving other users' unaffected
    const remaining = list.filter(n => {
      const to = String(n.toUserId || n.recipientUid || '');
      return to.toUpperCase() !== currentId.toUpperCase();
    });
    this._saveNotifications(remaining);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ym:notifications_updated'));
      window.dispatchEvent(new CustomEvent('ym:storage_changed', { detail: { key: 'app_notifications' } }));
    }
  }
}

export const notificationService = new NotificationService();
