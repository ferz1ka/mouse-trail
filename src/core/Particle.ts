import { config } from "./Config";

export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  shape: string;
  rotation: number;
  rotationSpeed: number;

  constructor(
    x: number,
    y: number,
    color: string,
    mouseVx: number = 0,
    mouseVy: number = 0,
  ) {
    this.x = x;
    this.y = y;

    // Spread based on config speed and spread
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * config.spread;
    this.vx = Math.cos(angle) * r * config.speed;
    this.vy = Math.sin(angle) * r * config.speed;

    if (config.inheritVelocity) {
      this.vx += mouseVx * config.inheritFactor;
      this.vy += mouseVy * config.inheritFactor;
    }

    this.life = 1.0;
    this.color = color;

    this.size = config.randomizeSize
      ? Math.random() * config.size + config.size / 2
      : config.size;
    this.shape = config.shape;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= config.deceleration;
    this.vy *= config.deceleration;

    this.life -= config.delayFade;
    this.rotation += this.rotationSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    if (this.shape === "Circle") {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === "Square") {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else if (this.shape === "Star") {
      this.drawStar(ctx, 0, 0, 5, this.size, this.size / 2);
    } else if (this.shape === "Triangle") {
      this.drawTriangle(ctx, 0, 0, this.size);
    }

    ctx.restore();
  }

  drawTriangle(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size, cy + size);
    ctx.lineTo(cx - size, cy + size);
    ctx.closePath();
    ctx.fill();
  }

  drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
  ) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}
