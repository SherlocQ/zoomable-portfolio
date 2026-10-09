import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// A port of Pixelthrone's "Cursor Dot Trail" Framer component
// (pixelthrone--cursor-dot-trail.framer.website), with its default props:
// a 12px dot that follows the pointer on a spring (0.15 / friction 0.5),
// drawing a 200ms fading trail. The demo's hover ring is left out (too
// noisy here): over anything interactive the dot simply steps aside.
//
// Colors follow the theme, black on light / white on dark (the demo's
// black-and-white variant): `--ink`, with the opposite ink where an element
// asks for the inverted color.
//
// Behaviors, by element:
//   hand   — every interactive element (tiles, links, buttons, form fields,
//            iframes, [data-cursor~="hide"]): the dot hides and only the
//            native hand / caret shows
//   invert — [data-cursor~="invert"] and image heroes: opposite color
// Only on fine pointers that can hover; off for touch and reduced motion.
const SIZE = 12;
const SPRING = 0.15;
const FRICTION = 0.5;
const TRAIL_MS = 200;
const EASE = 0.15;
// The custom cursor is off for now — the site uses the native cursor (hand
// on everything interactive). The code is kept so it can come back as a
// setting: pass enabled (the dot) and showTrail (its fading trail), or flip
// these defaults.
const ENABLED = false;
const SHOW_TRAIL = false;

const HIDE = '[data-cursor~="hide"], a, button, [role~="button"], summary, label[for], input, textarea, select, iframe';
const INVERT = '[data-cursor~="invert"], .project-hero-section:not(.project-hero-section--empty) .project-hero-meta';

const parseColor = (value) => {
  const v = value.trim();
  if (v.startsWith('#')) {
    const hex = v.length === 4 ? v.slice(1).split('').map((c) => c + c).join('') : v.slice(1, 7);
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }
  const m = v.match(/[\d.]+/g);
  return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
};
const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`;

const supported = () => typeof window !== 'undefined'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CursorTrail({ enabled: wanted = ENABLED, showTrail = SHOW_TRAIL }) {
  const canvasRef = useRef(null);
  const [supportedHere] = useState(supported);
  const enabled = wanted && supportedHere;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let colors = { ink: [8, 8, 8], inverted: [255, 255, 255] };
    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      const ink = parseColor(styles.getPropertyValue('--ink') || '#080808');
      const canvasColor = parseColor(styles.getPropertyValue('--canvas') || '#ffffff');
      colors = { ink, inverted: canvasColor };
    };
    readColors();
    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const resize = () => {
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();

    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    const vel = { x: 0, y: 0 };
    let seen = false;
    let trail = [];
    let fill = 0;
    let last = performance.now();
    let frame = 0;

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!seen) { pos.x = target.x; pos.y = target.y; seen = true; }
    };
    const onLeave = () => { seen = false; trail = []; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);

    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = (now) => {
      const dt = Math.min(now - last, 33);
      last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame = requestAnimationFrame(tick);
      if (!seen) return;

      vel.x = (vel.x + (target.x - pos.x) * SPRING) * FRICTION;
      vel.y = (vel.y + (target.y - pos.y) * SPRING) * FRICTION;
      pos.x += vel.x;
      pos.y += vel.y;
      trail.push({ x: pos.x, y: pos.y, age: 0 });
      trail.forEach((p) => { p.age += dt; });
      trail = trail.filter((p) => p.age < TRAIL_MS);

      const el = document.elementFromPoint(target.x, target.y);
      if (el?.closest(HIDE)) { fill = 0; return; }
      const color = el?.closest(INVERT) ? colors.inverted : colors.ink;

      if (showTrail && trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i += 1) ctx.lineTo(trail[i].x, trail[i].y);
        const head = trail[0];
        const tail = trail[trail.length - 1];
        const gradient = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
        gradient.addColorStop(0, rgba(color, Math.max(0, (1 - head.age / TRAIL_MS) * 0.3)));
        gradient.addColorStop(1, rgba(color, 1));
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(2, SIZE / 4);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // The dot fades back in after it was hidden over something interactive.
      fill = lerp(fill, 1, EASE);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = rgba(color, fill);
      ctx.fill();
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, [enabled, showTrail]);

  if (!enabled) return null;
  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'block', pointerEvents: 'none', zIndex: 9999 }}
    />,
    document.body,
  );
}
