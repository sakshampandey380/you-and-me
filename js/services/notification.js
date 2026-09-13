/* ==========================================================================
   YOU & ME — 3D Chat Application
   Notification Service (In-App Center & Event Dispatch)
   ========================================================================== */

import { storage } from './storage.js';
import { sound } from './sound.js';

class NotificationService {
  _getNotifications() {
    return storage.get('notifications') || [];
  }

  _saveNotifications(list) {
    storage.set('notifications', list);
  }

  getNotifications() {
    return this._getNotifications().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getUnreadCount() {
    return this._getNotifications().filter(n => !n.read).length;
  }

  addNotification({ type, title, message, fromUserId = null }) {
    const list = this._getNotifications();
    const newNotif = {
      id: "notif-" + Date.now(),
      type: type, // 'message' | 'friend_request' | 'friend_accepted' | 'reaction'
      title: title,
      message: message,
      fromUserId: fromUserId,
      timestamp: new Date().toISOString(),
      read: false
    };

    list.unshift(newNotif);
    this._saveNotifications(list);

    sound.playNotification();
    window.dispatchEvent(new CustomEvent('ym:notification_added', { detail: newNotif }));
    return newNotif;
  }

  markAllAsRead() {
    const list = this._getNotifications();
    list.forEach(n => n.read = true);
    this._saveNotifications(list);
    window.dispatchEvent(new CustomEvent('ym:notifications_updated'));
  }

  clearAll() {
    this._saveNotifications([]);
    window.dispatchEvent(new CustomEvent('ym:notifications_updated'));
  }
}

export const notificationService = new NotificationService();
