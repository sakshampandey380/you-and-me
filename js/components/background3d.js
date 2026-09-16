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
    this._createFloatingHearts(24);
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
    const hues = [335, 345, 320, 275, 355]; // Rose pink, ruby red, vibrant magenta, purple glow, neon crimson
    const w = this.width || window.innerWidth;
    const h = this.height || window.innerHeight;
    for (let i = 0; i < count; i++) {
      this.floatingHearts.push({
        baseX: Math.random() * w,
        baseY: Math.random() * h,
        baseZ: Math.random() * 380 + 120, // 3D spatial depth
        size: Math.random() * 10 + 11, // Size 11 to 21
        radiusX: Math.random() * 34 + 18, // Omnidirectional drift bounds in X
        radiusY: Math.random() * 30 + 16, // Omnidirectional drift bounds in Y
        radiusZ: Math.random() * 42 + 20, // Depth oscillation
        speedX: Math.random() * 0.012 + 0.007,
        speedY: Math.random() * 0.014 + 0.008,
        speedZ: Math.random() * 0.009 + 0.005,
        speedRot: Math.random() * 0.015 + 0.008,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        phaseRot: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.035 + 0.02,
        hue: hues[i % hues.length],
        alpha: Math.random() * 0.35 + 0.45 // 0.45 to 0.8
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
    for (let h of this.floatingHearts) {
      // Omnidirectional smooth drifting in place (X, Y, Z oscillate around anchor position in all directions)
      const currentX = h.baseX 
        + Math.sin(this.time * h.speedX + h.phaseX) * h.radiusX 
        + Math.cos(this.time * (h.speedX * 0.6) + h.phaseY) * (h.radiusX * 0.4);
      const currentY = h.baseY 
        + Math.cos(this.time * h.speedY + h.phaseY) * h.radiusY 
        + Math.sin(this.time * (h.speedY * 0.7) + h.phaseX) * (h.radiusY * 0.35);
      const currentZ = h.baseZ 
        + Math.sin(this.time * h.speedZ + h.phaseZ) * h.radiusZ;

      // 3D perspective projection factor
      const depthFactor = 300 / (currentZ || 300);
      const px = currentX + this.mouseX * depthFactor;
      const py = currentY + this.mouseY * depthFactor;

      // Heartbeat pulse & scale
      const pulse = 1 + Math.sin(this.time * h.pulseSpeed + h.phaseX) * 0.15;
      const r = h.size * depthFactor * pulse;
      const rot = Math.sin(this.time * h.speedRot + h.phaseRot) * 0.26;
      const alpha = isLight ? h.alpha * 0.75 : h.alpha;

      this.ctx.save();
      this.ctx.translate(px, py);
      this.ctx.rotate(rot);

      // 1. Radiant Multi-Layer Outer Halo Glow
      const halo = this.ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 2.8);
      halo.addColorStop(0, `hsla(${h.hue}, 100%, 70%, ${alpha * 0.55})`);
      halo.addColorStop(0.45, `hsla(${h.hue}, 100%, 60%, ${alpha * 0.2})`);
      halo.addColorStop(1, 'transparent');
      this.ctx.fillStyle = halo;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, r * 2.8, 0, Math.PI * 2);
      this.ctx.fill();

      // 2. High-intensity Shadow Glow
      this.ctx.shadowColor = `hsla(${h.hue}, 100%, 72%, ${alpha})`;
      this.ctx.shadowBlur = r * 1.8;

      // 3. Heart Body Gradient Fill
      const grad = this.ctx.createLinearGradient(0, -r, 0, r);
      grad.addColorStop(0, `hsla(${h.hue}, 100%, 82%, ${alpha})`);
      grad.addColorStop(0.5, `hsla(${h.hue}, 100%, 65%, ${alpha * 0.95})`);
      grad.addColorStop(1, `hsla(${h.hue}, 95%, 48%, ${alpha * 0.9})`);
      this.ctx.fillStyle = grad;

      // Parametric Heart Shape
      this.ctx.beginPath();
      const d = r * 0.65;
      this.ctx.moveTo(0, -d * 0.4);
      this.ctx.bezierCurveTo(-d * 0.8, -d * 1.2, -d * 1.6, -d * 0.2, 0, d * 1.25);
      this.ctx.bezierCurveTo(d * 1.6, -d * 0.2, d * 0.8, -d * 1.2, 0, -d * 0.4);
      this.ctx.closePath();
      this.ctx.fill();

      // 4. Glossy 3D Highlight on Top Left Lobe
      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.55})`;
      this.ctx.beginPath();
      this.ctx.arc(-d * 0.42, -d * 0.52, d * 0.26, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
  }
}
