import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from './Breadcrumb';
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

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="2.8" fill="currentColor" />
      <line x1="7.5" y1="0.5"  x2="7.5" y2="2.2"  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7.5" y1="12.8" x2="7.5" y2="14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="0.5"  y1="7.5" x2="2.2"  y2="7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="12.8" y1="7.5" x2="14.5" y2="7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="2.4"  y1="2.4"  x2="3.6"  y2="3.6"  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11.4" y1="11.4" x2="12.6" y2="12.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="2.4"  y1="12.6" x2="3.6"  y2="11.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11.4" y1="3.6"  x2="12.6" y2="2.4"  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M12.5 10A6 6 0 0 1 5 2.5a6.5 6.5 0 1 0 7.5 7.5z" fill="currentColor" />
    </svg>
  );
}

export default function AppHeader({ breadcrumbs, onNavigate, onBack, theme, onToggleTheme, canGoBack, isNotFound, onGoHome }) {
  return (
    <header className="app-header">
      <AnimatePresence>
        {canGoBack && (
          <motion.button
            className="header-back-btn"
            onClick={onBack}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{    opacity: 0, x: -8 }}
            transition={T_FAST}
            aria-label="Go back"
            title="Go back"
          >
            ←
          </motion.button>
        )}
      </AnimatePresence>

      {isNotFound ? (
        <nav className="breadcrumb-nav" aria-label="Navigation path">
          <button className="bc-pill bc-pill--home" onClick={onGoHome} aria-label="Home" title="Home">
            <HomeIcon />
          </button>
        </nav>
      ) : (
        <Breadcrumb segments={breadcrumbs} onNavigate={onNavigate} />
      )}

      <div className="theme-pill" role="group" aria-label="Color theme">
        {['light', 'dark'].map((t) => (
          <button
            key={t}
            className="theme-pill-option"
            onClick={() => t !== theme && onToggleTheme()}
            aria-pressed={theme === t}
            aria-label={t === 'light' ? 'Light mode' : 'Dark mode'}
            title={t === 'light' ? 'Light mode' : 'Dark mode'}
          >
            {theme === t && (
              <motion.span
                className="theme-pill-thumb"
                layoutId="theme-pill-thumb"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="theme-pill-icon">
              {t === 'light' ? <SunIcon /> : <MoonIcon />}
            </span>
          </button>
        ))}
      </div>
    </header>
  );
}
