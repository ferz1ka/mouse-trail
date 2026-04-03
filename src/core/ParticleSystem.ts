import { Particle } from "./Particle";
import { config } from "./Config";

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
  isMouseDown: boolean = false;
  hue: number = 0;
  private animationFrameId: number = 0;
  private resizeObserver: ResizeObserver;
  private moveTimeout?: ReturnType<typeof setTimeout>;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;

    this.resize();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas);

    this.canvas.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        this.isMouseDown = true;
        this.handleMove(e.offsetX, e.offsetY);
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      this.handleMove(e.offsetX, e.offsetY);
    });

    this.canvas.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        this.isMouseDown = false;
      }
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.handleLeave();
    });

    this.canvas.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        this.isMouseDown = true;
        const pos = this.getTouchPos(e);
        this.handleMove(pos.x, pos.y);
      },
      { passive: false },
    );

    this.canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        const pos = this.getTouchPos(e);
        this.handleMove(pos.x, pos.y);
      },
      { passive: false },
    );

    this.canvas.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        this.isMouseDown = false;
        this.handleLeave();
      },
      { passive: false },
    );

    this.canvas.addEventListener("touchcancel", () => {
      this.isMouseDown = false;
      this.handleLeave();
    });
  }

  getTouchPos(e: TouchEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  handleMove(x: number, y: number) {
    const now = performance.now();
    const dt = Math.max(1, now - this.lastTime);

    if (this.mouseX === -1000) {
      this.mouseX = x;
      this.mouseY = y;
    }

    this.mouseVX = ((x - this.mouseX) / dt) * 16;
    this.mouseVY = ((y - this.mouseY) / dt) * 16;

    this.mouseX = x;
    this.mouseY = y;
    this.lastTime = now;

    this.isMouseMoving = true;
    if (!config.spawnOnHold || this.isMouseDown) {
      this.spawnParticles();
    }

    if (this.moveTimeout) clearTimeout(this.moveTimeout);
    this.moveTimeout = setTimeout(() => {
      this.isMouseMoving = false;
      this.mouseVX = 0;
      this.mouseVY = 0;
    }, 50);
  }

  handleLeave() {
    this.isMouseMoving = false;
    this.isMouseDown = false;
    this.mouseVX = 0;
    this.mouseVY = 0;
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
    const count = 2;
    for (let i = 0; i < count; i++) {
      const vx = this.isMouseMoving ? this.mouseVX : 0;
      const vy = this.isMouseMoving ? this.mouseVY : 0;
      this.particles.push(
        new Particle(this.mouseX, this.mouseY, this.getColor(), vx, vy),
      );
    }
  }

  update() {
    if (config.rainbowMode) {
      this.hue = (this.hue + 2) % 360;
    }

    if (config.repetition && !this.isMouseMoving) {
      if (!config.spawnOnHold || this.isMouseDown) {
        this.spawnParticles();
      }
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
  };

  start() {
    this.loop();
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId);
  }
}
