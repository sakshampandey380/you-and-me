/* ==========================================================================
   YOU & ME — 3D Chat Application
   Profile View Controller (3D Profile Card & Editor)
   ========================================================================== */

import { auth } from '../services/auth.js';
import { friendService } from '../services/friend.js';
import { toast } from '../components/toast.js';

export class ProfileView {
  constructor() {
    this.container = document.getElementById('profile-view');
  }

  render() {
    if (!this.container) return;

    const user = auth.getCurrentUser();
    if (!user) return;

    const friends = friendService.getFriendsList();
    const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Recently';

    this.container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 20px;">
        <div class="subview-top-bar">
          <button class="btn-icon mobile-subview-back-btn" data-view="chats" title="Back to Chats">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2 class="subview-header-title">My Profile</h2>
          <button class="btn-icon notif-bell-btn" data-view="notifications" title="Notifications" style="position: relative;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span class="badge-count notif-badge" style="position: absolute; top: -2px; right: -2px; display: none;">0</span>
          </button>
        </div>
        <div class="glass-panel-elevated card-3d" style="padding: 32px 24px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;">
          <div class="avatar-wrap avatar-lg" style="margin-bottom: 4px;">
            <img src="${user.profilePicture}" class="avatar-img" alt="${user.name}" id="profile-display-avatar" />
            <span class="avatar-status online"></span>
          </div>

          <div>
            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${user.name}</h2>
            <div style="font-size: 14px; color: var(--color-romantic-rose); font-weight: 600;">@${user.username}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px; font-family: var(--font-mono); background: rgba(0,0,0,0.2); padding: 3px 10px; border-radius: 8px; display: inline-block;">
              User ID: ${user.userId}
            </div>
          </div>

          <div style="max-width: 440px; font-size: 14.5px; color: var(--text-secondary); line-height: 1.5; background: rgba(255,255,255,0.03); padding: 14px 18px; border-radius: 16px; border: 1px solid var(--glass-border);">
            "${user.bio || 'Hey there! I am using You & Me 🚀'}"
          </div>

          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; max-width: 360px; margin: 8px 0;">
            <div class="glass-panel" style="padding: 14px; text-align: center;">
              <div style="font-size: 22px; font-weight: 800; color: var(--color-romantic-pink);">${friends.length}</div>
              <div style="font-size: 12px; color: var(--text-muted);">Friends</div>
            </div>
            <div class="glass-panel" style="padding: 14px; text-align: center;">
              <div style="font-size: 16px; font-weight: 700; color: var(--color-primary-light); margin-top: 4px;">${joinDate}</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Member Since</div>
            </div>
          </div>

          <button class="btn-3d btn-primary" id="btn-open-edit-profile" style="width: 100%; max-width: 360px; padding: 12px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit Profile
          </button>
        </div>

        <!-- Creator Signature in Mobile/Desktop View -->
        <div class="mobile-view-footer">
          <div class="creator-signature">
            <span>Made by Sakcham</span>
            <span class="heart-icon">❤️</span>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <div class="modal-backdrop" id="edit-profile-modal">
        <div class="modal-3d">
          <div class="modal-header">
            <h3 style="font-size: 18px; font-weight: 700;">Edit Profile</h3>
            <button class="modal-close-btn" id="btn-close-edit-modal">&times;</button>
          </div>
          <form id="edit-profile-form" style="display: flex; flex-direction: column; gap: 16px;">
            <div class="input-group">
              <label class="input-label">Full Name</label>
              <input type="text" id="edit-name" value="${user.name}" required />
            </div>
            <div class="input-group">
              <label class="input-label">Status Tag</label>
              <input type="text" id="edit-status" value="${user.status || ''}" placeholder="e.g. Dreaming in 3D 🌌" />
            </div>
            <div class="input-group">
              <label class="input-label">Bio</label>
              <textarea id="edit-bio" rows="3">${user.bio || ''}</textarea>
            </div>
            <div class="input-group">
              <label class="input-label">Change Profile Picture</label>
              <input type="file" id="edit-avatar-input" accept="image/*" />
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
              <button type="button" class="btn-3d btn-glass" id="btn-cancel-edit">Cancel</button>
              <button type="submit" class="btn-3d btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    const editModal = document.getElementById('edit-profile-modal');
    const openBtn = document.getElementById('btn-open-edit-profile');
    const closeBtn = document.getElementById('btn-close-edit-modal');
    const cancelBtn = document.getElementById('btn-cancel-edit');
    const editForm = document.getElementById('edit-profile-form');
    const avatarInput = document.getElementById('edit-avatar-input');

    let newAvatarData = null;

    if (openBtn && editModal) {
      openBtn.addEventListener('click', () => editModal.classList.add('active'));
    }

    const closeModal = () => {
      if (editModal) editModal.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (avatarInput) {
      avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            newAvatarData = evt.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('edit-name').value.trim();
        const status = document.getElementById('edit-status').value.trim();
        const bio = document.getElementById('edit-bio').value.trim();

        const updates = { name, status, bio };
        if (newAvatarData) updates.profilePicture = newAvatarData;

        auth.updateCurrentUser(updates);
        toast.success("Profile updated successfully! ✨");
        closeModal();
        this.render();
      });
    }
  }
}
