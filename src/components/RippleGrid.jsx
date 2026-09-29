import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView, useIsPresent, useReducedMotion } from 'framer-motion';
import { T } from '../transitions';

// A faithful port of Alwan Rosyadi's "Ripple effect" Framer component
// (framer.com/marketplace/components/ripple-effect), with the exact props of
// its published preview: 56px square cells at 30% opacity, 100% on hover
// (150ms), and a click ripple where every cell pops (scale 1 → 1.1 → 1,
// opacity 30% → 100% → 30%) after 55ms per cell of distance from the click,
// lasting 200ms + 80ms per cell of distance (max 2s), ease-out.
// Colors are theme tokens (--ripple-*) instead of the preview's fixed greys.
// The preview's grid is a fixed 27 × 15; here it is at least that and grows
// to cover the container, so wide screens never show an empty edge.
//
// Cells are plain divs: hover is CSS and the ripple runs on the Web
// Animations API. Hundreds of motion components made the Process page's
// zoom in / out stall while they mounted and unmounted.
// Painting the grid while the page scales is still expensive, so it stays
// hidden during the page's zoom: it fades in once the open zoom has landed
// and hides the moment the page starts closing.
const CELL = 56;
const MIN_COLS = 27;
const MIN_ROWS = 15;
const DURATION_MS = 200;
const DELAY_MS = 55;
const POP = [
  { transform: 'scale(1)', opacity: 0.3, easing: 'ease-out' },
  { transform: 'scale(1.1)', opacity: 1, easing: 'ease-out' },
  { transform: 'scale(1)', opacity: 0.3 },
];

export default function RippleGrid() {
  const ref = useRef(null);
  const cellsRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: false, margin: '100px' });
  const [grid, setGrid] = useState({ cols: MIN_COLS, rows: MIN_ROWS });
  const live = inView && !reduceMotion;
  const isPresent = useIsPresent();
  const [settled, setSettled] = useState(false);
  const shown = settled && isPresent;

  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(true), T.duration * 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      const cols = Math.max(MIN_COLS, Math.ceil(el.clientWidth / CELL) + 1);
      const rows = Math.max(MIN_ROWS, Math.ceil(el.clientHeight / CELL) + 1);
      setGrid((g) => (g.cols === cols && g.rows === rows ? g : { cols, rows }));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    fit();
    return () => observer.disconnect();
  }, []);

  const ripple = useCallback((event) => {
    const cell = event.target.closest('.ripple-cell');
    if (!live || !cell) return;
    const index = Number(cell.dataset.i);
    const row = Math.floor(index / grid.cols);
    const col = index % grid.cols;
    [...cellsRef.current.children].forEach((el, i) => {
      const distance = Math.hypot(row - Math.floor(i / grid.cols), col - (i % grid.cols));
      // Each click restarts every cell's pop from rest.
      el.getAnimations().forEach((animation) => animation.cancel());
      el.animate(POP, {
        delay: distance * DELAY_MS,
        duration: Math.min(DURATION_MS + distance * 80, 2000),
      });
    });
  }, [grid.cols, live]);

  // Cells are created only after the zoom, keeping the page's first frame light.
  const cells = useMemo(() => (settled ? Array.from({ length: grid.cols * grid.rows }, (_, i) => (
    <div key={i} className="ripple-cell" data-i={i} />
  )) : null), [grid, settled]);

  return (
    <div ref={ref} className={`ripple-grid${live ? ' ripple-grid--live' : ''}${shown ? '' : ' ripple-grid--hidden'}`} aria-hidden="true">
      <div
        ref={cellsRef}
        className="ripple-grid-cells"
        onClick={ripple}
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, ${CELL}px)`,
          gridTemplateRows: `repeat(${grid.rows}, ${CELL}px)`,
          width: grid.cols * CELL,
          height: grid.rows * CELL,
        }}
      >
        {cells}
      </div>
    </div>
  );
}
