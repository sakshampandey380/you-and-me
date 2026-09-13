/* ==========================================================================
   YOU & ME — 3D Chat Application
   Attachment Confirmation & Media Preview Modal
   ========================================================================== */

class MediaPreviewService {
  show({ file, dataUrl, type, caption = '' }) {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop active';

      let previewContent = '';
      if (type === 'image') {
        previewContent = `<img src="${dataUrl}" style="max-height: 220px; border-radius: 14px; object-fit: contain; margin: 0 auto; display: block;" />`;
      } else if (type === 'video') {
        previewContent = `<video src="${dataUrl}" controls style="max-height: 220px; border-radius: 14px; width: 100%;"></video>`;
      } else {
        previewContent = `
          <div style="display: flex; align-items: center; gap: 14px; padding: 18px; background: rgba(0,0,0,0.2); border-radius: 14px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--color-primary); display: flex; align-items: center; justify-content: center; color: #fff;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div>
              <div style="font-weight: 600; font-size: 14px;">${file.name}</div>
              <div style="font-size: 12px; color: var(--text-muted);">${(file.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
        `;
      }

      backdrop.innerHTML = `
        <div class="modal-3d" style="max-width: 440px;">
          <div class="modal-header">
            <h3 style="font-size: 17px; font-weight: 700;">Attachment Preview</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div style="margin-bottom: 16px;">
            ${previewContent}
          </div>
          <div style="margin-bottom: 20px;">
            <input type="text" class="preview-caption-input" placeholder="Add an optional caption..." value="${caption}" style="width: 100%; font-size: 13.5px;" />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn-3d btn-glass btn-cancel">Cancel</button>
            <button class="btn-3d btn-primary btn-send">
              <span>Send Attachment</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      `;

      const cleanup = (confirmed) => {
        backdrop.classList.remove('active');
        const captionVal = backdrop.querySelector('.preview-caption-input').value.trim();
        setTimeout(() => {
          if (backdrop.parentElement) backdrop.parentElement.removeChild(backdrop);
          resolve(confirmed ? { confirmed: true, caption: captionVal } : { confirmed: false });
        }, 250);
      };

      backdrop.querySelector('.modal-close-btn').addEventListener('click', () => cleanup(false));
      backdrop.querySelector('.btn-cancel').addEventListener('click', () => cleanup(false));
      backdrop.querySelector('.btn-send').addEventListener('click', () => cleanup(true));

      document.body.appendChild(backdrop);
    });
  }
}

export const mediaPreview = new MediaPreviewService();
