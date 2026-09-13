/* ==========================================================================
   YOU & ME — 3D Chat Application
   Custom 3D Confirmation & Prompt Modals
   ========================================================================== */

class ModalService {
  confirm({ title = "Confirm Action", message = "Are you sure?", confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop active';

      backdrop.innerHTML = `
        <div class="modal-3d">
          <div class="modal-header">
            <h3 style="font-size: 18px; font-weight: 700;">${title}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 24px;">
            ${message}
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn-3d btn-glass btn-cancel">${cancelText}</button>
            <button class="btn-3d ${isDanger ? 'btn-danger' : 'btn-primary'} btn-confirm">${confirmText}</button>
          </div>
        </div>
      `;

      const cleanup = (result) => {
        backdrop.classList.remove('active');
        setTimeout(() => {
          if (backdrop.parentElement) backdrop.parentElement.removeChild(backdrop);
          resolve(result);
        }, 250);
      };

      backdrop.querySelector('.modal-close-btn').addEventListener('click', () => cleanup(false));
      backdrop.querySelector('.btn-cancel').addEventListener('click', () => cleanup(false));
      backdrop.querySelector('.btn-confirm').addEventListener('click', () => cleanup(true));

      // Click outside to dismiss
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) cleanup(false);
      });

      document.body.appendChild(backdrop);
    });
  }
}

export const modal = new ModalService();
