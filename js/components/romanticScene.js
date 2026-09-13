/* ==========================================================================
   YOU & ME — 3D Chat Application
   Romantic 3D Canvas Scene for Login & Signup
   - Silhouette couple on bench under streetlamp
   - 3D perspective flying glowing hearts
   - Starry night sky with twinkling stars & fireflies
   - Interactive mouse/touch parallax depth
   ========================================================================== */

export class RomanticScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = 0;
    this.height = 0;
    this.animationFrameId = null;
    this.isRunning = false;

    // Parallax mouse coordinates
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    // Elements
    this.stars = [];
    this.hearts = [];
    this.fireflies = [];
    this.time = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 40;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 40;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 30;
        this.targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 30;
      }
    }, { passive: true });

    this._createStars(140);
    this._createHearts(28);
    this._createFireflies(24);
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  _createStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.75),
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        depth: Math.random() * 0.5 + 0.2
      });
    }
  }

  _createHearts(count) {
    this.hearts = [];
    for (let i = 0; i < count; i++) {
      this.hearts.push(this._generateHeart(true));
    }
  }

  _generateHeart(randomY = false) {
    const depth = Math.random() * 0.8 + 0.4; // 3D depth multiplier
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 20 + Math.random() * 50,
      size: (Math.random() * 14 + 10) * depth,
      speedY: (Math.random() * 1.2 + 0.6) * depth,
      speedX: (Math.sin(Math.random() * Math.PI) - 0.5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      depth: depth,
      alpha: Math.random() * 0.6 + 0.4,
      hue: Math.random() > 0.3 ? 340 + Math.random() * 25 : 270 + Math.random() * 20, // Pink to purple
      wobbleOffset: Math.random() * Math.PI * 2
    };
  }

  _createFireflies(count) {
    this.fireflies = [];
    for (let i = 0; i < count; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: this.height * 0.4 + Math.random() * (this.height * 0.55),
        radius: Math.random() * 2.5 + 1.2,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        alpha: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.05 + 0.02,
        depth: Math.random() * 0.8 + 0.3
      });
    }
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  animate() {
    if (!this.isRunning) return;
    this.time += 0.02;

    // Smooth mouse parallax interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    this._drawSkyGradient();
    this._drawMoon();
    this._drawStars();
    this._drawHillsAndGround();
    this._drawStreetLampAndCouple();
    this._drawFireflies();
    this._draw3DHearts();

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  _drawSkyGradient() {
    const grad = this.ctx.createRadialGradient(
      this.width * 0.5 + this.mouseX * 0.2,
      this.height * 0.3 + this.mouseY * 0.2,
      10,
      this.width * 0.5,
      this.height * 0.5,
      this.width
    );
    grad.addColorStop(0, '#1c1542');
    grad.addColorStop(0.5, '#0e0e22');
    grad.addColorStop(1, '#06060e');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  _drawMoon() {
    const moonX = this.width * 0.82 + this.mouseX * 0.2;
    const moonY = this.height * 0.18 + this.mouseY * 0.2;
    const radius = Math.min(this.width * 0.06, 55);

    // Moon outer atmospheric glow
    const glow = this.ctx.createRadialGradient(moonX, moonY, radius * 0.8, moonX, moonY, radius * 3);
    glow.addColorStop(0, 'rgba(255, 230, 240, 0.25)');
    glow.addColorStop(0.5, 'rgba(255, 105, 180, 0.08)');
    glow.addColorStop(1, 'transparent');
    this.ctx.fillStyle = glow;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, radius * 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Crescent Moon
    this.ctx.save();
    this.ctx.fillStyle = '#fff6ea';
    this.ctx.shadowColor = '#ff6584';
    this.ctx.shadowBlur = 20;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Subtract shadow to make romantic crescent
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(moonX - radius * 0.45, moonY - radius * 0.2, radius * 0.9, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  _drawStars() {
    this.ctx.save();
    for (let star of this.stars) {
      star.alpha += Math.sin(this.time + star.x) * star.twinkleSpeed;
      const alpha = Math.max(0.1, Math.min(1, star.alpha));
      
      const px = star.x + this.mouseX * star.depth;
      const py = star.y + this.mouseY * star.depth;

      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(px, py, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  _drawHillsAndGround() {
    this.ctx.save();
    const groundY = this.height * 0.88;

    // Distant soft hill with parallax
    this.ctx.fillStyle = '#0b0c1c';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height);
    this.ctx.lineTo(0, groundY - 30);
    this.ctx.quadraticCurveTo(this.width * 0.4, groundY - 90, this.width, groundY - 20);
    this.ctx.lineTo(this.width, this.height);
    this.ctx.closePath();
    this.ctx.fill();

    // Foreground grassy hill
    const foreGround = this.ctx.createLinearGradient(0, groundY - 40, 0, this.height);
    foreGround.addColorStop(0, '#060712');
    foreGround.addColorStop(1, '#020308');
    this.ctx.fillStyle = foreGround;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height);
    this.ctx.lineTo(0, groundY);
    this.ctx.quadraticCurveTo(this.width * 0.5, groundY - 35, this.width, groundY + 10);
    this.ctx.lineTo(this.width, this.height);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  _drawStreetLampAndCouple() {
    this.ctx.save();

    // Adaptive anchor based on screen width (slightly left of center on desktop, centered on mobile)
    const isMobile = this.width < 768;
    const originX = isMobile ? this.width * 0.5 : this.width * 0.28;
    const originY = this.height * 0.86;
    const scale = isMobile ? Math.min(this.width / 440, 0.85) : 1;

    const lampX = originX + 75 * scale;
    const lampTopY = originY - 180 * scale;

    // 1. Warm Glowing Light Cone from Streetlamp
    const coneGrad = this.ctx.createRadialGradient(lampX, lampTopY + 15, 10, lampX, lampTopY + 120, 160 * scale);
    coneGrad.addColorStop(0, 'rgba(255, 235, 160, 0.45)');
    coneGrad.addColorStop(0.3, 'rgba(255, 180, 80, 0.2)');
    coneGrad.addColorStop(0.8, 'rgba(255, 105, 180, 0.05)');
    coneGrad.addColorStop(1, 'transparent');

    this.ctx.fillStyle = coneGrad;
    this.ctx.beginPath();
    this.ctx.moveTo(lampX - 15 * scale, lampTopY + 20);
    this.ctx.lineTo(lampX - 120 * scale, originY + 10);
    this.ctx.lineTo(lampX + 120 * scale, originY + 10);
    this.ctx.lineTo(lampX + 15 * scale, lampTopY + 20);
    this.ctx.closePath();
    this.ctx.fill();

    // 2. Streetlamp Silhouette
    this.ctx.fillStyle = '#0a0a14';
    this.ctx.strokeStyle = '#0a0a14';
    this.ctx.lineWidth = 4 * scale;

    // Pole
    this.ctx.beginPath();
    this.ctx.moveTo(lampX, originY);
    this.ctx.lineTo(lampX, lampTopY + 20);
    this.ctx.stroke();

    // Pole base & decorative ring
    this.ctx.fillRect(lampX - 8 * scale, originY - 10, 16 * scale, 12);
    this.ctx.fillRect(lampX - 5 * scale, lampTopY + 45, 10 * scale, 6);

    // Lamp Head Housing
    this.ctx.beginPath();
    this.ctx.moveTo(lampX - 16 * scale, lampTopY + 20);
    this.ctx.lineTo(lampX + 16 * scale, lampTopY + 20);
    this.ctx.lineTo(lampX + 12 * scale, lampTopY);
    this.ctx.lineTo(lampX - 12 * scale, lampTopY);
    this.ctx.closePath();
    this.ctx.fill();

    // Lamp Top Cap & Finial
    this.ctx.beginPath();
    this.ctx.arc(lampX, lampTopY - 6, 8 * scale, 0, Math.PI, true);
    this.ctx.fill();

    // Glowing Lantern Bulb
    const bulbGlow = this.ctx.createRadialGradient(lampX, lampTopY + 10, 2, lampX, lampTopY + 10, 24 * scale);
    bulbGlow.addColorStop(0, '#ffffff');
    bulbGlow.addColorStop(0.4, '#ffea9f');
    bulbGlow.addColorStop(1, 'rgba(255, 170, 50, 0)');
    this.ctx.fillStyle = bulbGlow;
    this.ctx.beginPath();
    this.ctx.arc(lampX, lampTopY + 10, 20 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    // 3. Romantic Park Bench Silhouette
    const benchX = originX - 45 * scale;
    const benchY = originY - 30 * scale;

    this.ctx.fillStyle = '#080812';
    this.ctx.strokeStyle = '#080812';
    this.ctx.lineWidth = 3.5 * scale;

    // Bench Seat Slats
    this.ctx.fillRect(benchX - 40 * scale, benchY + 10 * scale, 80 * scale, 5 * scale);
    // Bench Backrest
    this.ctx.fillRect(benchX - 38 * scale, benchY - 15 * scale, 76 * scale, 4 * scale);
    this.ctx.fillRect(benchX - 38 * scale, benchY - 7 * scale, 76 * scale, 4 * scale);

    // Bench Legs
    this.ctx.beginPath();
    this.ctx.moveTo(benchX - 32 * scale, benchY + 12 * scale);
    this.ctx.lineTo(benchX - 35 * scale, originY + 2);
    this.ctx.moveTo(benchX + 32 * scale, benchY + 12 * scale);
    this.ctx.lineTo(benchX + 35 * scale, originY + 2);
    this.ctx.stroke();

    // 4. Romantic Couple Sitting Together Silhouette
    // Person 1 (leaning slightly)
    const p1X = benchX - 10 * scale;
    const p1Y = benchY - 12 * scale;

    // Person 1 Body & Head
    this.ctx.fillStyle = '#06060c';
    this.ctx.beginPath();
    this.ctx.arc(p1X, p1Y - 26 * scale, 9 * scale, 0, Math.PI * 2); // Head
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(p1X - 8 * scale, p1Y + 10 * scale);
    this.ctx.lineTo(p1X - 5 * scale, p1Y - 18 * scale);
    this.ctx.lineTo(p1X + 8 * scale, p1Y - 18 * scale);
    this.ctx.lineTo(p1X + 10 * scale, p1Y + 10 * scale);
    this.ctx.closePath();
    this.ctx.fill();

    // Person 2 (leaning head affectionately on Person 1's shoulder)
    const p2X = benchX + 8 * scale;
    const p2Y = benchY - 10 * scale;

    // Person 2 Head leaning
    this.ctx.beginPath();
    this.ctx.arc(p2X - 4 * scale, p2Y - 23 * scale, 8 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    // Person 2 Body
    this.ctx.beginPath();
    this.ctx.moveTo(p2X - 7 * scale, p2Y + 10 * scale);
    this.ctx.lineTo(p2X - 5 * scale, p2Y - 16 * scale);
    this.ctx.lineTo(p2X + 8 * scale, p2Y - 16 * scale);
    this.ctx.lineTo(p2X + 9 * scale, p2Y + 10 * scale);
    this.ctx.closePath();
    this.ctx.fill();

    // Couple's legs down to grass
    this.ctx.fillRect(p1X - 6 * scale, p1Y + 10 * scale, 8 * scale, 22 * scale);
    this.ctx.fillRect(p2X - 1 * scale, p2Y + 10 * scale, 8 * scale, 22 * scale);

    // Floating little heart above the couple
    const lovePulse = Math.sin(this.time * 3) * 0.15 + 1;
    this._drawSingleHeart(benchX, p1Y - 50 * scale, 12 * lovePulse * scale, 0, 1, 345);

    this.ctx.restore();
  }

  _drawFireflies() {
    this.ctx.save();
    for (let f of this.fireflies) {
      f.x += f.speedX + Math.sin(this.time * 2 + f.y) * 0.4;
      f.y += f.speedY + Math.cos(this.time * 2 + f.x) * 0.4;

      if (f.x < 0) f.x = this.width;
      if (f.x > this.width) f.x = 0;
      if (f.y < this.height * 0.3) f.y = this.height * 0.85;
      if (f.y > this.height * 0.9) f.y = this.height * 0.4;

      const alpha = (Math.sin(this.time * 4 + f.x) * 0.4 + 0.6) * f.alpha;

      const glow = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 4);
      glow.addColorStop(0, `rgba(255, 230, 150, ${alpha})`);
      glow.addColorStop(0.5, `rgba(255, 105, 180, ${alpha * 0.4})`);
      glow.addColorStop(1, 'transparent');

      this.ctx.fillStyle = glow;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.radius * 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  _draw3DHearts() {
    for (let h of this.hearts) {
      h.y -= h.speedY;
      h.x += Math.sin(this.time + h.wobbleOffset) * 0.8;
      h.rotation += h.rotSpeed;

      // Parallax with 3D depth
      const px = h.x + this.mouseX * h.depth;
      const py = h.y + this.mouseY * h.depth;

      this._drawSingleHeart(px, py, h.size, h.rotation, h.alpha * h.depth, h.hue);

      if (h.y < -50) {
        Object.assign(h, this._generateHeart(false));
      }
    }
  }

  _drawSingleHeart(x, y, size, rotation, alpha, hue) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);

    // 3D Soft Glow
    this.ctx.shadowColor = `hsla(${hue}, 100%, 65%, ${alpha})`;
    this.ctx.shadowBlur = size * 0.8;

    this.ctx.fillStyle = `hsla(${hue}, 100%, 68%, ${alpha})`;

    // Parametric Heart Shape
    this.ctx.beginPath();
    const d = size * 0.6;
    this.ctx.moveTo(0, -d * 0.4);
    this.ctx.bezierCurveTo(-d * 0.8, -d * 1.2, -d * 1.6, -d * 0.2, 0, d * 1.2);
    this.ctx.bezierCurveTo(d * 1.6, -d * 0.2, d * 0.8, -d * 1.2, 0, -d * 0.4);
    this.ctx.closePath();
    this.ctx.fill();

    // Subtle 3D Inner Highlight
    this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.35})`;
    this.ctx.beginPath();
    this.ctx.arc(-d * 0.4, -d * 0.5, d * 0.25, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }
}
