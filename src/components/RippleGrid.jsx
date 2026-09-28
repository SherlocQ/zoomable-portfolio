import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

// A faithful port of Alwan Rosyadi's "Ripple effect" Framer component
// (framer.com/marketplace/components/ripple-effect), with the exact props of
// its published preview: 56px square cells at 30% opacity, 100% on hover
// (150ms), and a click ripple where every cell pops (scale 1 → 1.1 → 1,
// opacity 30% → 100% → 30%) after 55ms per cell of distance from the click,
// lasting 200ms + 80ms per cell of distance (max 2s), ease-out.
// Colors are theme tokens (--ripple-*) instead of the preview's fixed greys.
// The preview's grid is a fixed 27 × 15; here it is at least that and grows
// to cover the container, so wide screens never show an empty edge.
const CELL = 56;
const MIN_COLS = 27;
const MIN_ROWS = 15;
const OPACITY = 0.3;
const HOVER_OPACITY = 1;
const DURATION_MS = 200;
const DELAY_MS = 55;

export default function RippleGrid() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: false, margin: '100px' });
  const [grid, setGrid] = useState({ cols: MIN_COLS, rows: MIN_ROWS });
  const [origin, setOrigin] = useState(null);
  const [wave, setWave] = useState(0);
  const live = inView && !reduceMotion;

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

  const ripple = useCallback((row, col) => {
    if (reduceMotion) return;
    startTransition(() => {
      setOrigin({ row, col });
      setWave((w) => w + 1);
    });
  }, [reduceMotion]);

  const cells = useMemo(() => Array.from({ length: grid.cols * grid.rows }, (_, i) => i), [grid]);

  return (
    <div ref={ref} className="ripple-grid" aria-hidden="true">
      <div
        className="ripple-grid-cells"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, ${CELL}px)`,
          gridTemplateRows: `repeat(${grid.rows}, ${CELL}px)`,
          width: grid.cols * CELL,
          height: grid.rows * CELL,
        }}
      >
        {cells.map((i) => {
          const row = Math.floor(i / grid.cols);
          const col = i % grid.cols;
          const distance = origin ? Math.hypot(origin.row - row, origin.col - col) : 0;
          const rippling = origin && live;
          return (
            // Re-keying on every click restarts each cell's pop from rest.
            <motion.div
              key={`${i}-${wave}`}
              className="ripple-cell"
              style={{ opacity: OPACITY, willChange: live ? 'transform, opacity' : 'auto' }}
              onClick={() => ripple(row, col)}
              whileHover={live ? { opacity: HOVER_OPACITY, transition: { duration: 0.15 } } : {}}
              animate={rippling ? { scale: [1, 1.1, 1], opacity: [OPACITY, 1, OPACITY] } : {}}
              transition={rippling ? {
                delay: (distance * DELAY_MS) / 1000,
                duration: Math.min((DURATION_MS + distance * 80) / 1000, 2),
                ease: 'easeOut',
              } : {}}
            />
          );
        })}
      </div>
    </div>
  );
}
