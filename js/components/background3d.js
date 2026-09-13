/* ==========================================================================
   YOU & ME — 3D Chat Application
   Main 3D Animated Background Engine (Canvas 3D Spatial Spheres & Nodes)
   ========================================================================== */

import { storage } from '../services/storage.js';

export class Background3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = 0;
    this.height = 0;
    this.animationFrameId = null;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.nodes = [];
    this.spheres = [];
    this.floatingHearts = [];
    this.time = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 50;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 50;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 35;
        this.targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 35;
      }
    }, { passive: true });

    this._createSpheres(6);
    this._createNodes(35);
    this._createFloatingHearts(6);
    this.start();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  _createSpheres(count) {
    this.spheres = [];
    for (let i = 0; i < count; i++) {
      this.spheres.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 400 + 100, // 3D depth
        radius: Math.random() * 80 + 40,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        hue: i % 2 === 0 ? 335 : 265, // Rose or purple
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  _createNodes(count) {
    this.nodes = [];
    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        depth: Math.random() * 0.8 + 0.2,
        radius: Math.random() * 2.5 + 1.2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }
  }

  _createFloatingHearts(count) {
    this.floatingHearts = [];
    for (let i = 0; i < count; i++) {
      this.floatingHearts.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 10 + 8,
        speedY: Math.random() * 0.5 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.35 + 0.15
      });
    }
  }

  start() {
    if (!this.animationFrameId) {
      this.animate();
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  animate() {
    this.time += 0.015;

    // Smooth camera / parallax interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const settings = storage.get('settings') || {};
    const isLight = document.documentElement.getAttribute('data-theme') === 'light' || settings.theme === 'light';

    this._draw3DSpheres(isLight);
    this._drawNodesAndConnections(isLight);
    this._drawFloatingHearts(isLight);

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  _draw3DSpheres(isLight) {
    this.ctx.save();
    for (let s of this.spheres) {
      s.x += s.speedX;
      s.y += s.speedY;

      if (s.x < -s.radius) s.x = this.width + s.radius;
      if (s.x > this.width + s.radius) s.x = -s.radius;
      if (s.y < -s.radius) s.y = this.height + s.radius;
      if (s.y > this.height + s.radius) s.y = -s.radius;

      // 3D Perspective Projection
      const depthFactor = 300 / (s.z || 300);
      const px = s.x + this.mouseX * depthFactor;
      const py = s.y + this.mouseY * depthFactor;
      const r = s.radius * depthFactor * (1 + Math.sin(this.time + s.pulseOffset) * 0.06);

      const grad = this.ctx.createRadialGradient(
        px - r * 0.3,
        py - r * 0.3,
        r * 0.1,
        px,
        py,
        r
      );

      const alpha = isLight ? 0.08 : 0.18;
      grad.addColorStop(0, `hsla(${s.hue}, 100%, 75%, ${alpha * 1.5})`);
      grad.addColorStop(0.6, `hsla(${s.hue}, 90%, 55%, ${alpha})`);
      grad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(px, py, r, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  _drawNodesAndConnections(isLight) {
    this.ctx.save();
    const maxDist = 120;
    const nodeColor = isLight ? 'rgba(120, 60, 220,' : 'rgba(180, 120, 255,';

    // Move & draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0) n.x = this.width;
      if (n.x > this.width) n.x = 0;
      if (n.y < 0) n.y = this.height;
      if (n.y > this.height) n.y = 0;

      const px = n.x + this.mouseX * n.depth;
      const py = n.y + this.mouseY * n.depth;

      this.ctx.fillStyle = `${nodeColor} ${0.35 * n.depth})`;
      this.ctx.beginPath();
      this.ctx.arc(px, py, n.radius * n.depth, 0, Math.PI * 2);
      this.ctx.fill();

      // Connect nearby nodes
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        const px2 = n2.x + this.mouseX * n2.depth;
        const py2 = n2.y + this.mouseY * n2.depth;

        const dx = px - px2;
        const dy = py - py2;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15 * Math.min(n.depth, n2.depth);
          this.ctx.strokeStyle = `${nodeColor} ${alpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(px, py);
          this.ctx.lineTo(px2, py2);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.restore();
  }

  _drawFloatingHearts(isLight) {
    this.ctx.save();
    for (let h of this.floatingHearts) {
      h.y -= h.speedY;
      h.wobble += 0.02;
      const px = h.x + Math.sin(h.wobble) * 15 + this.mouseX * 0.2;
      const py = h.y + this.mouseY * 0.2;

      if (h.y < -30) {
        h.y = this.height + 30;
        h.x = Math.random() * this.width;
      }

      this.ctx.fillStyle = isLight ? `rgba(255, 51, 102, ${h.alpha * 0.6})` : `rgba(255, 51, 102, ${h.alpha})`;
      this.ctx.beginPath();
      const d = h.size * 0.5;
      this.ctx.moveTo(px, py - d * 0.4);
      this.ctx.bezierCurveTo(px - d * 0.8, py - d * 1.2, px - d * 1.6, py - d * 0.2, px, py + d * 1.2);
      this.ctx.bezierCurveTo(px + d * 1.6, py - d * 0.2, px + d * 0.8, py - d * 1.2, px, py - d * 0.4);
      this.ctx.closePath();
      this.ctx.fill();
    }
    this.ctx.restore();
  }
}
