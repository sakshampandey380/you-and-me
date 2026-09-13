/* ==========================================================================
   YOU & ME — 3D Chat Application
   3D Glass Toast Notification Component
   ========================================================================== */

class ToastService {
  constructor() {
    this.container = null;
    this._ensureContainer();
  }

  _ensureContainer() {
    if (!this.container) {
      this.container = document.querySelector('.toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    }
  }

  show(message, type = 'info', duration = 3200) {
    this._ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast-3d toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    }

    toast.innerHTML = `
      <div style="color: ${type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-danger)' : 'var(--color-romantic-pink)'}; display:flex; align-items:center;">
        ${iconSvg}
      </div>
      <div style="flex:1; font-size:13.5px; font-weight:500;">${message}</div>
    `;

    toast.addEventListener('click', () => this._dismiss(toast));
    this.container.appendChild(toast);

    setTimeout(() => {
      this._dismiss(toast);
    }, duration);
  }

  _dismiss(toast) {
    if (!toast || toast.dataset.dismissed) return;
    toast.dataset.dismissed = "true";
    toast.style.opacity = '0';
    toast.style.transform = 'perspective(600px) translateY(-20px) scale(0.9)';
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }

  success(msg) { this.show(msg, 'success'); }
  error(msg) { this.show(msg, 'error'); }
  info(msg) { this.show(msg, 'info'); }
}

export const toast = new ToastService();
