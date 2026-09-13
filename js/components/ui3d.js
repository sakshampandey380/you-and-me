/* ==========================================================================
   YOU & ME — 3D Chat Application
   3D UI Micro-Interactions (Card Tilt, Magnetic Buttons, Depth Scaling)
   ========================================================================== */

import { storage } from '../services/storage.js';

class UI3D {
  constructor() {
    this.init();
  }

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Bind tilt to elements with .card-3d
    document.addEventListener('mousemove', (e) => this._handleGlobalTilt(e));
  }

  _getDepthMultiplier() {
    const settings = storage.get('settings') || {};
    return typeof settings.depthIntensity === 'number' ? settings.depthIntensity : 1;
  }

  _handleGlobalTilt(e) {
    const multiplier = this._getDepthMultiplier();
    if (multiplier <= 0) return;

    const cards = document.querySelectorAll('.card-3d');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const distX = e.clientX - cardCenterX;
      const distY = e.clientY - cardCenterY;

      // Only tilt if mouse is relatively close to card (within 250px)
      const dist = Math.hypot(distX, distY);
      if (dist < 350) {
        const rotateY = (distX / (rect.width / 2)) * 6 * multiplier;
        const rotateX = -(distY / (rect.height / 2)) * 6 * multiplier;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      } else {
        card.style.transform = '';
      }
    });
  }

  bindTiltToElement(el) {
    if (!el) return;
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  }
}

export const ui3d = new UI3D();
