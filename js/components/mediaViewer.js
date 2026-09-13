/* ==========================================================================
   YOU & ME — 3D Chat Application
   Full-Screen 3D Media Lightbox (Images & Videos with Zoom & Download)
   ========================================================================== */

class MediaViewerService {
  constructor() {
    this.lightbox = null;
    this.zoomLevel = 1;
    this._build();
  }

  _build() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'media-lightbox';

    this.lightbox.innerHTML = `
      <div class="media-lightbox-toolbar">
        <button class="btn-icon zoom-in-btn" title="Zoom In">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        </button>
        <button class="btn-icon zoom-out-btn" title="Zoom Out">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        </button>
        <button class="btn-icon download-btn" title="Download">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
        <button class="btn-icon close-btn" title="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="media-container" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; overflow:hidden;">
        <!-- Media inserted dynamically -->
      </div>
    `;

    document.body.appendChild(this.lightbox);

    this.lightbox.querySelector('.close-btn').addEventListener('click', () => this.close());
    this.lightbox.querySelector('.zoom-in-btn').addEventListener('click', () => this.zoom(0.25));
    this.lightbox.querySelector('.zoom-out-btn').addEventListener('click', () => this.zoom(-0.25));

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox || e.target.classList.contains('media-container')) {
        this.close();
      }
    });

    // Keyboard ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(mediaUrl, type = 'image', fileName = 'you_and_me_media') {
    const container = this.lightbox.querySelector('.media-container');
    container.innerHTML = '';
    this.zoomLevel = 1;

    if (type === 'video') {
      const video = document.createElement('video');
      video.src = mediaUrl;
      video.controls = true;
      video.autoplay = true;
      video.className = 'media-lightbox-content';
      container.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = mediaUrl;
      img.className = 'media-lightbox-content';
      container.appendChild(img);
    }

    const downloadBtn = this.lightbox.querySelector('.download-btn');
    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = mediaUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    this.lightbox.classList.add('active');
  }

  zoom(delta) {
    this.zoomLevel = Math.max(0.5, Math.min(3.0, this.zoomLevel + delta));
    const media = this.lightbox.querySelector('.media-lightbox-content');
    if (media) {
      media.style.transform = `scale(${this.zoomLevel})`;
    }
  }

  close() {
    this.lightbox.classList.remove('active');
    const container = this.lightbox.querySelector('.media-container');
    const video = container.querySelector('video');
    if (video) video.pause();
    setTimeout(() => { container.innerHTML = ''; }, 300);
  }
}

export const mediaViewer = new MediaViewerService();
