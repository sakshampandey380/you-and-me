/* ==========================================================================
   YOU & ME — 3D Chat Application
   Settings View Controller (Appearance, Privacy, Language, Sound & Theme)
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { APP_CONFIG } from '../config.js';
import { storage } from '../services/storage.js';
import { auth } from '../services/auth.js';
import { userService } from '../services/user.js';
import { sound } from '../services/sound.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export class SettingsView {
  constructor(onLogout) {
    this.onLogout = onLogout;
    this.container = document.getElementById('settings-view');
  }

  render() {
    if (!this.container) return;

    const settings = storage.get('app_settings') || {};
    const isDark = settings.theme !== 'light';
    const allUsers = userService.getAllUsers();
    const current = auth.getCurrentUser();
    const currentUid = current ? (current.uid || current.userId) : null;
    const currentLang = current?.language || settings.language || 'English';

    this.container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 20px;">
        <div class="subview-top-bar">
          <button class="btn-icon mobile-subview-back-btn" data-view="chats" title="Back to Chats">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2 class="subview-header-title">Settings</h2>
          <button class="btn-icon notif-bell-btn" data-view="notifications" title="Notifications" style="position: relative;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span class="badge-count notif-badge" style="position: absolute; top: -2px; right: -2px; display: none;">0</span>
          </button>
        </div>

        <!-- Appearance Section -->
        <div class="glass-panel card-3d" style="padding: 22px; display: flex; flex-direction: column; gap: 16px;">
          <h3 style="font-size: 15px; font-weight: 700; color: var(--color-romantic-rose); display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            3D Appearance & Visuals
          </h3>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Theme Mode</div>
              <div style="font-size: 12px; color: var(--text-muted);">Switch between futuristic Dark 3D and Light 3D</div>
            </div>
            <div style="display: flex; background: rgba(0,0,0,0.25); border-radius: 12px; padding: 4px;">
              <button class="btn-theme-select ${isDark ? 'active' : ''}" data-theme="dark" style="padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: ${isDark ? '#fff' : 'var(--text-muted)'}; background: ${isDark ? 'var(--color-primary)' : 'transparent'};">Dark 3D</button>
              <button class="btn-theme-select ${!isDark ? 'active' : ''}" data-theme="light" style="padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: ${!isDark ? '#121426' : 'var(--text-muted)'}; background: ${!isDark ? '#fff' : 'transparent'};">Light 3D</button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 600;">
              <span>3D Parallax & Depth Intensity</span>
              <span id="depth-val-label">${(settings.depthIntensity || 1) * 100}%</span>
            </div>
            <input type="range" id="depth-slider" min="0" max="1.5" step="0.1" value="${settings.depthIntensity || 1}" style="width: 100%; accent-color: var(--color-romantic-pink);" />
          </div>
        </div>

        <!-- Language & Translation Section -->
        <div class="glass-panel card-3d" style="padding: 22px; display: flex; flex-direction: column; gap: 16px;">
          <h3 style="font-size: 15px; font-weight: 700; color: var(--color-cyan-accent); display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            Chat Language & Translation (Hindi / English)
          </h3>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Preferred Language</div>
              <div style="font-size: 12px; color: var(--text-muted);">Used for in-chat message translation</div>
            </div>
            <div style="display: flex; background: rgba(0,0,0,0.25); border-radius: 12px; padding: 4px;">
              <button class="btn-lang-select ${currentLang === 'English' ? 'active' : ''}" data-lang="English" style="padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: ${currentLang === 'English' ? '#fff' : 'var(--text-muted)'}; background: ${currentLang === 'English' ? 'var(--color-primary)' : 'transparent'};">English</button>
              <button class="btn-lang-select ${currentLang === 'Hindi' ? 'active' : ''}" data-lang="Hindi" style="padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: ${currentLang === 'Hindi' ? '#fff' : 'var(--text-muted)'}; background: ${currentLang === 'Hindi' ? 'var(--color-primary)' : 'transparent'};">Hindi (हिंदी)</button>
            </div>
          </div>
        </div>

        <!-- Audio & Messages -->
        <div class="glass-panel card-3d" style="padding: 22px; display: flex; flex-direction: column; gap: 16px;">
          <h3 style="font-size: 15px; font-weight: 700; color: var(--color-primary-light); display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            Audio & Messages
          </h3>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Sound Effects</div>
              <div style="font-size: 12px; color: var(--text-muted);">Futuristic synthesized audio chimes</div>
            </div>
            <label class="remember-label">
              <input type="checkbox" id="toggle-sound" ${settings.soundEnabled !== false ? 'checked' : ''} />
            </label>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Press Enter to Send</div>
              <div style="font-size: 12px; color: var(--text-muted);">Use Shift + Enter for new lines</div>
            </div>
            <label class="remember-label">
              <input type="checkbox" id="toggle-enter-send" ${settings.enterToSend !== false ? 'checked' : ''} />
            </label>
          </div>
        </div>

        <!-- Privacy Section -->
        <div class="glass-panel card-3d" style="padding: 22px; display: flex; flex-direction: column; gap: 16px;">
          <h3 style="font-size: 15px; font-weight: 700; color: var(--color-romantic-pink); display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Privacy
          </h3>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Online Status Visibility</div>
              <div style="font-size: 12px; color: var(--text-muted);">Show others when you are active</div>
            </div>
            <label class="remember-label">
              <input type="checkbox" id="toggle-privacy-online" ${settings.privacyOnline !== false ? 'checked' : ''} />
            </label>
          </div>
        </div>

        <!-- Account Switcher Section (Testing Multi-Account locally) -->
        <div class="glass-panel card-3d" style="padding: 22px; display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 15px; font-weight: 700; color: var(--color-romantic-pink); display: flex; align-items: center; gap: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              Account Switcher (Instant 1-Click)
            </h3>
            <span style="font-size: 11px; padding: 2px 8px; border-radius: 12px; background: rgba(255, 51, 102, 0.15); color: var(--color-romantic-pink); font-weight: 600;">Test & Chat</span>
          </div>
          <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;">
            Easily switch between registered profiles on this browser to test messaging, friend requests, and chatting between User A and User B.
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto;">
            ${allUsers.length === 0 ? '<div style="font-size: 12px; color: var(--text-muted);">No other users registered yet.</div>' : allUsers.map(u => {
              const uUid = u.uid || u.userId;
              const isCurrent = currentUid && currentUid === uUid;
              const avatar = u.profilePicture || u.avatar || APP_CONFIG.defaultAvatar;
              return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 10px; background: ${isCurrent ? 'rgba(138, 63, 252, 0.15)' : 'rgba(255, 255, 255, 0.04)'}; border: 1px solid ${isCurrent ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.08)'};">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <img src="${avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
                    <div style="overflow: hidden;">
                      <div style="font-size: 13.5px; font-weight: 700; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${u.name} ${isCurrent ? '<span style="color: var(--color-primary-light); font-size: 11px;">(Active)</span>' : ''}</div>
                      <div style="font-size: 11.5px; color: var(--text-muted);">@${u.username} • <span style="font-family: var(--font-mono);">${uUid}</span></div>
                    </div>
                  </div>
                  ${isCurrent 
                    ? '<span style="font-size: 12px; color: var(--color-success); font-weight: 600; padding: 4px 10px;">✓ Active</span>' 
                    : `<button type="button" class="btn-3d btn-primary btn-switch-account" data-user-id="${uUid}" style="padding: 5px 12px; font-size: 12px;">Switch</button>`
                  }
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Danger & Account Actions -->
        <div class="glass-panel" style="padding: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600; font-size: 14px;">Log Out</div>
            <div style="font-size: 12px; color: var(--text-muted);">Sign out of your active session</div>
          </div>
          <button class="btn-3d btn-danger" id="btn-logout" style="padding: 8px 18px; font-size: 13px;">
            Log Out
          </button>
        </div>

        <!-- Creator Signature in Natural View Scroll -->
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
    const settings = storage.get('app_settings') || {};

    // Theme Switch
    document.querySelectorAll('.btn-theme-select').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        settings.theme = theme;
        storage.set('app_settings', settings);
        document.documentElement.setAttribute('data-theme', theme);
        toast.info(`Switched to ${theme === 'dark' ? 'Dark 3D' : 'Light 3D'} theme!`);
        this.render();
      });
    });

    // Language Switch
    document.querySelectorAll('.btn-lang-select').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        settings.language = lang;
        storage.set('app_settings', settings);
        auth.updateCurrentUser({ language: lang });
        toast.success(`Chat language set to ${lang}! 🌐`);
        this.render();
      });
    });

    // 3D Depth Slider
    const depthSlider = document.getElementById('depth-slider');
    const depthLabel = document.getElementById('depth-val-label');
    if (depthSlider) {
      depthSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        settings.depthIntensity = val;
        storage.set('app_settings', settings);
        if (depthLabel) depthLabel.textContent = `${Math.round(val * 100)}%`;
      });
    }

    // Sound Toggle
    const soundToggle = document.getElementById('toggle-sound');
    if (soundToggle) {
      soundToggle.addEventListener('change', (e) => {
        settings.soundEnabled = e.target.checked;
        storage.set('app_settings', settings);
        if (e.target.checked) {
          sound.playNotification();
          toast.success("Sound effects enabled! 🔔");
        } else {
          toast.info("Sound effects muted.");
        }
      });
    }

    // Enter to Send
    const enterToggle = document.getElementById('toggle-enter-send');
    if (enterToggle) {
      enterToggle.addEventListener('change', (e) => {
        settings.enterToSend = e.target.checked;
        storage.set('app_settings', settings);
      });
    }

    // Account Switcher buttons
    this.container.querySelectorAll('.btn-switch-account').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.dataset.userId;
        const target = userService.getUserById(userId);
        if (target) {
          auth.setCurrentUser(target);
          toast.success(`Switched account to ${target.name} (@${target.username})! 🚀`);
          setTimeout(() => {
            window.location.reload();
          }, 350);
        }
      });
    });

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        const ok = await modal.confirm({
          title: "Log Out?",
          message: "Are you sure you want to log out of You & Me?",
          confirmText: "Log Out",
          isDanger: true
        });
        if (ok) {
          auth.logout();
          toast.info("Logged out safely.");
          if (this.onLogout) this.onLogout();
        }
      });
    }
  }
}
