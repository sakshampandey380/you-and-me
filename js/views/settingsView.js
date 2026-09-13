/* ==========================================================================
   YOU & ME — 3D Chat Application
   Settings View Controller (Appearance, Privacy, Sound & Theme)
   ========================================================================== */

import { storage } from '../services/storage.js';
import { auth } from '../services/auth.js';
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

    const settings = storage.get('settings') || {};
    const isDark = settings.theme !== 'light';

    this.container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 20px;">
        <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 4px;">Settings</h2>

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

        <!-- Audio & Notifications -->
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
          <h3 style="font-size: 15px; font-weight: 700; color: var(--color-cyan-accent); display: flex; align-items: center; gap: 8px;">
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
            <span>Made by Sakcham</span>
            <span class="heart-icon">❤️</span>
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    const settings = storage.get('settings') || {};

    // Theme Switch
    document.querySelectorAll('.btn-theme-select').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        settings.theme = theme;
        storage.set('settings', settings);
        document.documentElement.setAttribute('data-theme', theme);
        toast.info(`Switched to ${theme === 'dark' ? 'Dark 3D' : 'Light 3D'} theme!`);
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
        storage.set('settings', settings);
        if (depthLabel) depthLabel.textContent = `${Math.round(val * 100)}%`;
      });
    }

    // Sound Toggle
    const soundToggle = document.getElementById('toggle-sound');
    if (soundToggle) {
      soundToggle.addEventListener('change', (e) => {
        settings.soundEnabled = e.target.checked;
        storage.set('settings', settings);
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
        storage.set('settings', settings);
      });
    }

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
