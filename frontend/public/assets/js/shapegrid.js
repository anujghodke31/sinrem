/**
 * shapegrid.js — Vanilla JS port of the ShapeGrid React component.
 * Renders an animated, hoverable canvas grid background.
 *
 * Usage:
 *   new ShapeGrid(canvasElement, options)
 *
 * Options (all optional):
 *   direction        'right' | 'left' | 'up' | 'down' | 'diagonal'
 *   speed            Number (pixels per frame)
 *   borderColor      CSS color string
 *   squareSize       Number (cell size in px)
 *   hoverFillColor   CSS color string
 *   shape            'square' | 'hexagon' | 'triangle' | 'circle'
 *   hoverTrailAmount Number of trail cells to remember
 */
class ShapeGrid {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Config
    this.direction       = opts.direction       ?? 'diagonal';
    this.speed           = opts.speed           ?? 0.5;
    this.borderColor     = opts.borderColor     ?? 'rgba(0,0,0,0.10)';
    this.squareSize      = opts.squareSize      ?? 40;
    this.hoverFillColor  = opts.hoverFillColor  ?? 'rgba(180,80,20,0.18)';
    this.shape           = opts.shape           ?? 'square';
    this.hoverTrailAmount = opts.hoverTrailAmount ?? 6;

    // State
    this.gridOffset     = { x: 0, y: 0 };
    this.hoveredSquare  = null;
    this.trailCells     = [];
    this.cellOpacities  = new Map();
    this.rafId          = null;
    this.isVisible      = true;
    this.numCols        = 0;
    this.numRows        = 0;

    // Hex geometry helpers
    this.hexHoriz = this.squareSize * 1.5;
    this.hexVert  = this.squareSize * Math.sqrt(3);

    this._onResize      = this._resize.bind(this);
    this._onMouseMove   = this._handleMouseMove.bind(this);
    this._onMouseLeave  = this._handleMouseLeave.bind(this);
    this._onVisibilityChange = this._handleVisibilityChange.bind(this);

    window.addEventListener('resize', this._onResize);
    document.addEventListener('visibilitychange', this._onVisibilityChange);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);

    this._resize();
    this._setupVisibilityObserver();
    this._tick();
  }

  _setupVisibilityObserver() {
    this.observer = new IntersectionObserver((entries) => {
      this.isVisible = Boolean(entries[0]?.isIntersecting);
      if (this.isVisible && !this.rafId) {
        this._tick();
      } else if (!this.isVisible && this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }, { threshold: 0.01 });
    this.observer.observe(this.canvas);
  }

  _handleVisibilityChange() {
    if (document.hidden && this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
      return;
    }
    if (!document.hidden && this.isVisible && !this.rafId) {
      this._tick();
    }
  }

  // ── Resize ───────────────────────────────────────────────
  _resize() {
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.numCols = Math.ceil(this.canvas.width  / this.squareSize) + 1;
    this.numRows = Math.ceil(this.canvas.height / this.squareSize) + 1;
  }

  // ── Shape Drawers ─────────────────────────────────────────
  _drawHex(cx, cy) {
    const ctx = this.ctx, s = this.squareSize;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const vx = cx + s * Math.cos(angle);
      const vy = cy + s * Math.sin(angle);
      i === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
    }
    ctx.closePath();
  }

  _drawCircle(cx, cy) {
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, this.squareSize / 2, 0, Math.PI * 2);
    this.ctx.closePath();
  }

  _drawTriangle(cx, cy, flip) {
    const ctx = this.ctx, s = this.squareSize;
    ctx.beginPath();
    if (flip) {
      ctx.moveTo(cx, cy + s / 2);
      ctx.lineTo(cx + s / 2, cy - s / 2);
      ctx.lineTo(cx - s / 2, cy - s / 2);
    } else {
      ctx.moveTo(cx, cy - s / 2);
      ctx.lineTo(cx + s / 2, cy + s / 2);
      ctx.lineTo(cx - s / 2, cy + s / 2);
    }
    ctx.closePath();
  }

  // ── Draw Grid ─────────────────────────────────────────────
  _drawGrid() {
    const { ctx, canvas, squareSize, shape, borderColor, hoverFillColor,
            hexHoriz, hexVert, gridOffset, cellOpacities } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (shape === 'hexagon') {
      const colShift = Math.floor(gridOffset.x / hexHoriz);
      const offsetX  = ((gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
      const offsetY  = ((gridOffset.y % hexVert)  + hexVert)  % hexVert;
      const cols = Math.ceil(canvas.width  / hexHoriz) + 3;
      const rows = Math.ceil(canvas.height / hexVert)  + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * hexHoriz + offsetX;
          const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + offsetY;
          const key = `${col},${row}`;
          const alpha = cellOpacities.get(key);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this._drawHex(cx, cy);
            ctx.fillStyle = hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          this._drawHex(cx, cy);
          ctx.strokeStyle = borderColor;
          ctx.stroke();
        }
      }

    } else if (shape === 'triangle') {
      const halfW   = squareSize / 2;
      const colShift = Math.floor(gridOffset.x / halfW);
      const rowShift = Math.floor(gridOffset.y / squareSize);
      const offsetX  = ((gridOffset.x % halfW)     + halfW)     % halfW;
      const offsetY  = ((gridOffset.y % squareSize) + squareSize) % squareSize;
      const cols = Math.ceil(canvas.width  / halfW)     + 4;
      const rows = Math.ceil(canvas.height / squareSize) + 4;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx   = col * halfW + offsetX;
          const cy   = row * squareSize + squareSize / 2 + offsetY;
          const flip = ((col + colShift + row + rowShift) % 2 + 2) % 2 !== 0;
          const key  = `${col},${row}`;
          const alpha = cellOpacities.get(key);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this._drawTriangle(cx, cy, flip);
            ctx.fillStyle = hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          this._drawTriangle(cx, cy, flip);
          ctx.strokeStyle = borderColor;
          ctx.stroke();
        }
      }

    } else if (shape === 'circle') {
      const offsetX = ((gridOffset.x % squareSize) + squareSize) % squareSize;
      const offsetY = ((gridOffset.y % squareSize) + squareSize) % squareSize;
      const cols = Math.ceil(canvas.width  / squareSize) + 3;
      const rows = Math.ceil(canvas.height / squareSize) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx  = col * squareSize + squareSize / 2 + offsetX;
          const cy  = row * squareSize + squareSize / 2 + offsetY;
          const key = `${col},${row}`;
          const alpha = cellOpacities.get(key);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this._drawCircle(cx, cy);
            ctx.fillStyle = hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          this._drawCircle(cx, cy);
          ctx.strokeStyle = borderColor;
          ctx.stroke();
        }
      }

    } else {
      // Default: square
      const offsetX = ((gridOffset.x % squareSize) + squareSize) % squareSize;
      const offsetY = ((gridOffset.y % squareSize) + squareSize) % squareSize;
      const cols = Math.ceil(canvas.width  / squareSize) + 3;
      const rows = Math.ceil(canvas.height / squareSize) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const sx  = col * squareSize + offsetX;
          const sy  = row * squareSize + offsetY;
          const key = `${col},${row}`;
          const alpha = cellOpacities.get(key);
          if (alpha) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(sx, sy, squareSize, squareSize);
            ctx.globalAlpha = 1;
          }
          ctx.strokeStyle = borderColor;
          ctx.strokeRect(sx, sy, squareSize, squareSize);
        }
      }
    }

    // Radial vignette fade at edges
    const grad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2,
      Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
    );
    grad.addColorStop(0,   'rgba(0,0,0,0)');
    grad.addColorStop(0.7, 'rgba(0,0,0,0)');
    grad.addColorStop(1,   'rgba(0,0,0,0.12)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ── Update Cell Opacities (hover + trail fade) ────────────
  _updateOpacities() {
    const targets = new Map();

    if (this.hoveredSquare) {
      targets.set(`${this.hoveredSquare.x},${this.hoveredSquare.y}`, 1);
    }

    if (this.hoverTrailAmount > 0) {
      for (let i = 0; i < this.trailCells.length; i++) {
        const t   = this.trailCells[i];
        const key = `${t.x},${t.y}`;
        if (!targets.has(key)) {
          targets.set(key, (this.trailCells.length - i) / (this.trailCells.length + 1));
        }
      }
    }

    for (const [key] of targets) {
      if (!this.cellOpacities.has(key)) this.cellOpacities.set(key, 0);
    }

    for (const [key, opacity] of this.cellOpacities) {
      const target = targets.get(key) ?? 0;
      const next   = opacity + (target - opacity) * 0.15;
      if (next < 0.005) {
        this.cellOpacities.delete(key);
      } else {
        this.cellOpacities.set(key, next);
      }
    }
  }

  // ── Animation Tick ────────────────────────────────────────
  _tick() {
    if (document.hidden || !this.isVisible) {
      this.rafId = null;
      return;
    }
    const speed  = Math.max(this.speed, 0.1);
    const wrapX  = this.shape === 'hexagon'  ? this.hexHoriz * 2
                 : this.shape === 'triangle' ? this.squareSize / 2
                 : this.squareSize;
    const wrapY  = this.shape === 'hexagon'  ? this.hexVert
                 : this.shape === 'triangle' ? this.squareSize * 2
                 : this.squareSize;

    switch (this.direction) {
      case 'right':    this.gridOffset.x = (this.gridOffset.x - speed + wrapX) % wrapX; break;
      case 'left':     this.gridOffset.x = (this.gridOffset.x + speed + wrapX) % wrapX; break;
      case 'up':       this.gridOffset.y = (this.gridOffset.y + speed + wrapY) % wrapY; break;
      case 'down':     this.gridOffset.y = (this.gridOffset.y - speed + wrapY) % wrapY; break;
      case 'diagonal':
        this.gridOffset.x = (this.gridOffset.x - speed + wrapX) % wrapX;
        this.gridOffset.y = (this.gridOffset.y - speed + wrapY) % wrapY;
        break;
    }

    this._updateOpacities();
    this._drawGrid();
    this.rafId = requestAnimationFrame(() => this._tick());
  }

  // ── Mouse Move ────────────────────────────────────────────
  _handleMouseMove(e) {
    const rect   = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const { squareSize, shape, hexHoriz, hexVert, gridOffset } = this;

    let col, row;

    if (shape === 'hexagon') {
      const colShift = Math.floor(gridOffset.x / hexHoriz);
      const offsetX  = ((gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
      const offsetY  = ((gridOffset.y % hexVert)  + hexVert)  % hexVert;
      col = Math.round((mouseX - offsetX) / hexHoriz);
      const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;
      row = Math.round((mouseY - offsetY - rowOffset) / hexVert);

    } else if (shape === 'triangle') {
      const halfW   = squareSize / 2;
      const offsetX = ((gridOffset.x % halfW)     + halfW)      % halfW;
      const offsetY = ((gridOffset.y % squareSize) + squareSize) % squareSize;
      col = Math.round((mouseX - offsetX) / halfW);
      row = Math.floor((mouseY - offsetY) / squareSize);

    } else if (shape === 'circle') {
      const offsetX = ((gridOffset.x % squareSize) + squareSize) % squareSize;
      const offsetY = ((gridOffset.y % squareSize) + squareSize) % squareSize;
      col = Math.round((mouseX - offsetX) / squareSize);
      row = Math.round((mouseY - offsetY) / squareSize);

    } else {
      const offsetX = ((gridOffset.x % squareSize) + squareSize) % squareSize;
      const offsetY = ((gridOffset.y % squareSize) + squareSize) % squareSize;
      col = Math.floor((mouseX - offsetX) / squareSize);
      row = Math.floor((mouseY - offsetY) / squareSize);
    }

    if (!this.hoveredSquare || this.hoveredSquare.x !== col || this.hoveredSquare.y !== row) {
      if (this.hoveredSquare && this.hoverTrailAmount > 0) {
        this.trailCells.unshift({ ...this.hoveredSquare });
        if (this.trailCells.length > this.hoverTrailAmount) this.trailCells.length = this.hoverTrailAmount;
      }
      this.hoveredSquare = { x: col, y: row };
    }
  }

  // ── Mouse Leave ───────────────────────────────────────────
  _handleMouseLeave() {
    if (this.hoveredSquare && this.hoverTrailAmount > 0) {
      this.trailCells.unshift({ ...this.hoveredSquare });
      if (this.trailCells.length > this.hoverTrailAmount) this.trailCells.length = this.hoverTrailAmount;
    }
    this.hoveredSquare = null;
  }

  // ── Destroy ───────────────────────────────────────────────
  destroy() {
    cancelAnimationFrame(this.rafId);
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
    if (this.observer) this.observer.disconnect();
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
  }
}

// ── Init: attach to hero background ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('shapegrid-canvas');
  if (!canvas) return;

  new ShapeGrid(canvas, {
    direction:        'diagonal',
    speed:            0.35,
    shape:            'square',
    squareSize:       40,
    borderColor:      'rgba(0, 0, 0, 0.08)',
    hoverFillColor:   'rgba(180, 70, 10, 0.16)',
    hoverTrailAmount: 4
  });
});
