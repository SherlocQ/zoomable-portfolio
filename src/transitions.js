// Single source of truth for all animation curves in this project.
export const EASE = [0.32, 0.72, 0, 1];

export const T      = { duration: 0.38, ease: EASE };
export const T_FAST = { duration: 0.20, ease: EASE };

// Spring presets — use for interactive elements (hover, overlays, list entries)
export const SPRING      = { type: 'spring', stiffness: 400, damping: 30 };
export const SPRING_SLOW = { type: 'spring', stiffness: 260, damping: 26 };

export const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 + 0.14, duration: 0.34, ease: EASE },
  }),
};
