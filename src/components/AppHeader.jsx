import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from './Breadcrumb';
import { T_FAST } from '../transitions';

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

export default function AppHeader({ breadcrumbs, onNavigate, onBack, theme, onToggleTheme, canGoBack }) {
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
          >
            ←
          </motion.button>
        )}
      </AnimatePresence>

      <Breadcrumb segments={breadcrumbs} onNavigate={onNavigate} />

      <button
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            className="theme-icon"
            initial={{ opacity: 0, rotate: -40, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0,   scale: 1   }}
            exit={{    opacity: 0, rotate:  40, scale: 0.5 }}
            transition={T_FAST}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </motion.span>
        </AnimatePresence>
      </button>
    </header>
  );
}
