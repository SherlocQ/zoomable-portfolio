import { motion, AnimatePresence } from 'framer-motion';
import { T_FAST } from '../transitions';

function HomeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <path
        d="M1 5.8L6.5 1L12 5.8V12H8.5V8.5H4.5V12H1V5.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function Breadcrumb({ segments, onNavigate }) {
  return (
    <nav className="breadcrumb-nav" aria-label="Navigation path">
      <AnimatePresence mode="popLayout" initial={false}>
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          const isRoot = i === 0;
          return (
            <motion.span
              key={seg.id ?? '__root__'}
              className="bc-group"
              layout
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{    opacity: 0, x: 10 }}
              transition={T_FAST}
            >
              {i > 0 && <span className="bc-sep" aria-hidden="true">›</span>}
              <button
                className={`bc-pill${isLast ? ' bc-pill--active' : ''}${isRoot ? ' bc-pill--home' : ''}`}
                onClick={() => !isLast && onNavigate(i)}
                disabled={isLast}
                aria-label={isRoot ? 'Home' : seg.label}
              >
                {isRoot ? <HomeIcon /> : seg.label}
              </button>
            </motion.span>
          );
        })}
      </AnimatePresence>
    </nav>
  );
}
