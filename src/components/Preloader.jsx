import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import { PRELOADER_SEEN_KEY } from '../utils/preloader';

// First-load intro, a port of the Framer "Preloader" code component used on
// visual-guardrails-036925.framer.app (same timeline, speed 1), without its
// image card:
//   1. after 0.2s the name blurs in (blur 10px → 0, opacity 0 → 1) over
//      1.5s, ease-out;
//   2. it holds for 2s (the Framer component holds 0.8s);
//   3. it blurs back out over 0.5s, ease-in;
//   4. the whole overlay dissolves (opacity 1 → 0, blur 0 → 20px) over 1s,
//      ease-in-out, revealing the landing page underneath.
// Colors are theme tokens (--canvas / --ink), so it follows light and dark.
const TEXT = 'Chengchang Qian - AI Native Product Designer';
const HOLD_MS = 2000;

const wait = (ms) => new Promise((resolve) => { window.setTimeout(resolve, ms); });

export default function Preloader({ onDone }) {
  const rootRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const text = textRef.current;
    if (!root || !text) return undefined;
    // Cancellable, so StrictMode's mount → unmount → mount restarts cleanly.
    let cancelled = false;
    let current = null;
    // onComplete, not the returned promise: an animation that replaces one
    // stopped on the same element never resolves its promise.
    const step = (element, keyframes, options) => new Promise((resolve) => {
      current = animate(element, keyframes, { ...options, onComplete: () => resolve(!cancelled) });
    });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(10px)' };
    const shown = reduceMotion ? { opacity: 1 } : { opacity: 1, filter: 'blur(0px)' };
    (async () => {
      if (!await step(text, shown, { duration: 1.5, ease: 'easeOut', delay: 0.2 })) return;
      await wait(HOLD_MS);
      if (cancelled) return;
      if (!await step(text, hidden, { duration: 0.5, ease: 'easeIn' })) return;
      const dissolve = reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(20px)' };
      if (!await step(root, dissolve, { duration: 1, ease: 'easeInOut' })) return;
      try { sessionStorage.setItem(PRELOADER_SEEN_KEY, '1'); } catch { /* ignore */ }
      onDone();
    })();
    return () => {
      cancelled = true;
      current?.stop();
    };
  }, [onDone]);

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <span ref={textRef} className="preloader-text">{TEXT}</span>
    </div>
  );
}
