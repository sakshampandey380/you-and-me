/* ==========================================================================
   YOU & ME — 3D Chat Application
   3D Emoji Picker Component
   ========================================================================== */

import { EMOJI_CATEGORIES } from '../config.js';

export class EmojiPicker {
  constructor(onSelect) {
    this.onSelect = onSelect;
    this.panel = null;
    this.isOpen = false;
    this._build();
  }

  _build() {
    this.panel = document.createElement('div');
    this.panel.className = 'emoji-picker-panel';

    this.panel.innerHTML = `
      <div class="emoji-search-box">
        <input type="text" placeholder="Search emojis..." class="emoji-search-input" style="width:100%; padding:8px 12px; font-size:13px;" />
      </div>
      <div class="emoji-grid"></div>
    `;

    const searchInput = this.panel.querySelector('.emoji-search-input');
    const grid = this.panel.querySelector('.emoji-grid');

    const renderEmojis = (filter = '') => {
      grid.innerHTML = '';
      const term = filter.toLowerCase().trim();

      EMOJI_CATEGORIES.forEach(cat => {
        const matches = cat.emojis.filter(e => !term || cat.name.toLowerCase().includes(term));
        matches.forEach(emoji => {
          const btn = document.createElement('span');
          btn.className = 'emoji-item';
          btn.textContent = emoji;
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onSelect) this.onSelect(emoji);
          });
          grid.appendChild(btn);
        });
      });
    };

    searchInput.addEventListener('input', (e) => renderEmojis(e.target.value));
    renderEmojis();

    document.body.appendChild(this.panel);

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.panel.contains(e.target) && !e.target.closest('.emoji-toggle-btn')) {
        this.close();
      }
    });
  }

  toggle(anchorElement) {
    if (this.isOpen) {
      this.close();
    } else {
      this.open(anchorElement);
    }
  }

  open(anchorElement) {
    if (!anchorElement) return;
    const rect = anchorElement.getBoundingClientRect();

    // Position above anchor
    this.panel.style.top = Math.max(10, rect.top - 350) + 'px';
    this.panel.style.left = Math.min(window.innerWidth - 330, Math.max(10, rect.left - 140)) + 'px';

    this.panel.classList.add('active');
    this.isOpen = true;
  }

  close() {
    this.panel.classList.remove('active');
    this.isOpen = false;
  }
}
