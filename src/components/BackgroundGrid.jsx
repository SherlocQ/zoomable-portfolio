import { useEffect, useRef } from 'react';

const FADE_IN  = 0.10;   // lerp factor — spotlight appears quickly
const FADE_OUT = 0.032;  // lerp factor — spotlight fades slowly (~1.2s)
const CHASE    = 0.14;   // lerp factor — center follows cursor

export default function BackgroundGrid({ theme }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let raf;
    let mx = 0, my = 0;    // target mouse position
    let cx = 0, cy = 0;    // animated spotlight center
    let opacity  = 0;      // current spotlight opacity
    let targetOp = 0;      // 0 = off, 1 = on
    let entered  = false;
    let idleTimer = null;

    const apply = () => {
      el.style.setProperty('--mx', `${cx}px`);
      el.style.setProperty('--my', `${cy}px`);
      el.style.setProperty('--so', opacity.toFixed(4));
    };

    const tick = () => {
      cx += (mx - cx) * CHASE;
      cy += (my - cy) * CHASE;
      const factor = targetOp > opacity ? FADE_IN : FADE_OUT;
      opacity += (targetOp - opacity) * factor;
      if (Math.abs(opacity - targetOp) < 0.002) opacity = targetOp;
      apply();
      raf = requestAnimationFrame(tick);
    };

    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { targetOp = 0; }, 600);
    };

    const onMove = (e) => {
      if (!entered) {
        cx = e.clientX; cy = e.clientY;
        entered = true;
      }
      mx = e.clientX; my = e.clientY;
      targetOp = 1;
      resetIdle();
    };

    const onLeave = () => {
      clearTimeout(idleTimer);
      targetOp = 0;
      entered  = false;
    };

    apply();
    tick();
    window.addEventListener('mousemove',  onMove,  { passive: true });
    window.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <div className={`bg-grid bg-grid--${theme}`} ref={ref} aria-hidden="true" />;
}
