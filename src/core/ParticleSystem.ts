import { Particle } from './Particle';
import { config } from './Config';

export class ParticleSystem {
  particles: Particle[] = [];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouseX: number = -1000;
  mouseY: number = -1000;
  mouseVX: number = 0;
  mouseVY: number = 0;
  lastTime: number = performance.now();
  isMouseMoving: boolean = false;
  hue: number = 0;
  private animationFrameId: number = 0;
  private resizeObserver: ResizeObserver;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    this.resize();
    
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas);
    
    this.canvas.addEventListener('mousemove', (e) => {
      const now = performance.now();
      const dt = Math.max(1, now - this.lastTime);
      
      if (this.mouseX === -1000) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
      }
      
      this.mouseVX = ((e.offsetX - this.mouseX) / dt) * 16;
      this.mouseVY = ((e.offsetY - this.mouseY) / dt) * 16;

      this.mouseX = e.offsetX;
      this.mouseY = e.offsetY;
      this.lastTime = now;
      
      this.isMouseMoving = true;
      this.spawnParticles();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isMouseMoving = false;
      this.mouseVX = 0;
      this.mouseVY = 0;
    });

    // Handle mouse stop
    let timeout: ReturnType<typeof setTimeout>;
    this.canvas.addEventListener('mousemove', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.isMouseMoving = false;
        this.mouseVX = 0;
        this.mouseVY = 0;
      }, 50);
    });
  }

  resize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  getColor() {
    if (config.rainbowMode) {
      return `hsl(${this.hue}, 100%, 50%)`;
    }
    return config.baseColor;
  }

  spawnParticles() {
    const count = 2; // Can be configurable
    for (let i = 0; i < count; i++) {
        const vx = this.isMouseMoving ? this.mouseVX : 0;
        const vy = this.isMouseMoving ? this.mouseVY : 0;
      this.particles.push(new Particle(this.mouseX, this.mouseY, this.getColor(), vx, vy));
    }
  }

  update() {
    if (config.rainbowMode) {
      this.hue = (this.hue + 2) % 360;
    }

    if (config.repetition && !this.isMouseMoving) {
      this.spawnParticles();
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const p of this.particles) {
      p.draw(this.ctx);
    }
  }

  loop = () => {
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  start() {
    this.loop();
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId);
  }
}
