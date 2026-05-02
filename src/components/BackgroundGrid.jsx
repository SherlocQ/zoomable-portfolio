import { useEffect, useRef, useState } from 'react';

// Colors per theme
const THEMES = {
  dark:  { grid: '#ffffff', dot: '#ffffff', hover: '#4da6ff', bg: 'transparent' },
  light: { grid: '#1a1917', dot: '#1a1917', hover: '#c96442', bg: 'transparent' },
};

function parseColor(color) {
  if (!color || color === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  const rgba = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?/i);
  if (rgba) return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: rgba[4] != null ? +rgba[4] : 1 };
  let hex = color.replace('#', '');
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  return {
    r: parseInt(hex.slice(0,2), 16),
    g: parseInt(hex.slice(2,4), 16),
    b: parseInt(hex.slice(4,6), 16),
    a: 1,
  };
}

export default function BackgroundGrid({ theme = 'dark' }) {
  const canvasRef  = useRef(null);
  const stateRef   = useRef({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Keep latest theme colors accessible inside the rAF loop without restarts
  useEffect(() => {
    stateRef.current.colors = THEMES[theme] || THEMES.dark;
  }, [theme]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Config
    const GRID_SIZE      = 60;
    const BASE_OPACITY   = 0.07;
    const DOT_SIZE       = 1.5;
    const GRID_THICKNESS = 0.5;
    const REPULSION      = -0.65 * 25;  // mapped (negative = push away)
    const RADIUS         = 300;
    const MAX_DIST       = 400;
    const SPRING         = 0.05;
    const DAMPING        = 0.72;

    stateRef.current.colors = THEMES[theme] || THEMES.dark;

    const dots = new Map();
    const mousePos = { x: null, y: null };
    let rafId;
    let width, height;

    const initDots = () => {
      dots.clear();
      for (let gx = -GRID_SIZE; gx < width + GRID_SIZE * 2; gx += GRID_SIZE) {
        for (let gy = -GRID_SIZE; gy < height + GRID_SIZE * 2; gy += GRID_SIZE) {
          dots.set(`${gx},${gy}`, { x: gx, y: gy, vx: 0, vy: 0, size: DOT_SIZE });
        }
      }
    };

    const resize = () => {
      width  = canvas.clientWidth  || 1;
      height = canvas.clientHeight || 1;
      canvas.width  = width;
      canvas.height = height;
      initDots();
    };

    resize();

    const hoverIntensity = (x, y) => {
      if (mousePos.x == null) return 0;
      const dx = x - mousePos.x, dy = y - mousePos.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d > RADIUS) return 0;
      return Math.pow(1 - d / RADIUS, 3.5);
    };

    const cursorPush = (gx, gy) => {
      if (mousePos.x == null) return { x: 0, y: 0 };
      const dx = gx - mousePos.x, dy = gy - mousePos.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d === 0) return { x: 0, y: 0 };
      const norm = Math.min(d / MAX_DIST, 1);
      const amt  = Math.pow(1 - norm, 2) * REPULSION;
      return { x: (dx/d) * amt, y: (dy/d) * amt };
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      const c = stateRef.current.colors;
      const hC = parseColor(c.hover);
      const gC = parseColor(c.grid);
      const dC = parseColor(c.dot);

      ctx.clearRect(0, 0, width, height);

      // Draw grid lines
      dots.forEach((dot, key) => {
        const [gxStr, gyStr] = key.split(',');
        const gx = +gxStr, gy = +gyStr;
        const hi = hoverIntensity(dot.x, dot.y);

        const rDot = dots.get(`${gx + GRID_SIZE},${gy}`);
        const bDot = dots.get(`${gx},${gy + GRID_SIZE}`);

        const drawLine = (other) => {
          const avg = (hi + hoverIntensity(other.x, other.y)) / 2;
          const r = Math.round(lerp(gC.r, hC.r, avg));
          const g = Math.round(lerp(gC.g, hC.g, avg));
          const b = Math.round(lerp(gC.b, hC.b, avg));
          const a = BASE_OPACITY + (1 - BASE_OPACITY) * avg;
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(other.x, other.y);
          ctx.lineWidth   = GRID_THICKNESS + avg * 1.5;
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          ctx.stroke();
        };

        if (rDot) drawLine(rDot);
        if (bDot) drawLine(bDot);
      });

      // Physics + dot rendering
      dots.forEach((dot, key) => {
        const [gxStr, gyStr] = key.split(',');
        const gx = +gxStr, gy = +gyStr;
        const push   = cursorPush(gx, gy);
        const tx     = gx + push.x;
        const ty     = gy + push.y;
        dot.vx = (dot.vx + (tx - dot.x) * SPRING) * DAMPING;
        dot.vy = (dot.vy + (ty - dot.y) * SPRING) * DAMPING;
        dot.x += dot.vx;
        dot.y += dot.vy;

        const hi = hoverIntensity(dot.x, dot.y);
        const r  = Math.round(lerp(dC.r, hC.r, hi));
        const g  = Math.round(lerp(dC.g, hC.g, hi));
        const b  = Math.round(lerp(dC.b, hC.b, hi));
        const a  = BASE_OPACITY + (1 - BASE_OPACITY) * hi;
        const sz = Math.max(DOT_SIZE * 0.5, DOT_SIZE + hi * DOT_SIZE);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const onMouseMove = (e) => {
      const rect  = canvas.getBoundingClientRect();
      const scaleX = width  / rect.width;
      const scaleY = height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top)  * scaleY;
      mousePos.x = x;
      mousePos.y = y;
    };
    const onMouseLeave = () => { mousePos.x = null; mousePos.y = null; };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    window.addEventListener('mousemove',  onMouseMove,  { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
