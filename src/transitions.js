// Single source of truth for all animation curves in this project.
export const EASE = [0.32, 0.72, 0, 1];

// Cinematic ease-out for hero entrances — fast start, long graceful tail
export const EASE_HERO = [0.16, 1, 0.3, 1];

export const T      = { duration: 0.38, ease: EASE };
export const T_FAST = { duration: 0.20, ease: EASE };

// Lightbox motion mirrors linear.app/docs (measured from its Web Animations):
// - zoom in:  400ms transform on a critically damped spring curve (no overshoot)
// - zoom out: 300ms transform, CSS ease-out
// - scrim:    300ms opacity, cubic-bezier(0.25, 0.1, 0.35, 1) both ways
// The visible image keeps its opacity and moves only through scale/translate.
// Linear ships the open curve as CSS linear() stops sampled every 1/39th of
// the duration; the same stops drive a piecewise-linear ease for Framer.
const LINEAR_SPRING_STOPS = [
  0, 0.024, 0.0823, 0.1594, 0.2448, 0.3315, 0.4152, 0.4934, 0.5646, 0.6282,
  0.6844, 0.7334, 0.7758, 0.8122, 0.8432, 0.8694, 0.8916, 0.9102, 0.9258, 0.9388,
  0.9496, 0.9586, 0.966, 0.9722, 0.9772, 0.9814, 0.9848, 0.9876, 0.9899, 0.9918,
  0.9933, 0.9946, 0.9956, 0.9964, 0.9971, 0.9977, 0.9981, 0.9985, 0.9988, 1,
];
// Evenly spaced CSS linear() stops → a piecewise-linear Framer ease.
const linearStopsEase = (stops) => (t) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const pos = t * (stops.length - 1);
  const i = Math.floor(pos);
  return stops[i] + (stops[i + 1] - stops[i]) * (pos - i);
};

export const LIGHTBOX_ZOOM  = { duration: 0.4, ease: linearStopsEase(LINEAR_SPRING_STOPS) };
export const LIGHTBOX_CLOSE = { duration: 0.3, ease: 'easeOut' };
export const LIGHTBOX_FADE  = { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] };
export const LIGHTBOX_CLOSE_MS = LIGHTBOX_CLOSE.duration * 1000;

// Accordion motion mirrors the linear.app/docs collapsible (measured):
// - panel height: JS spring, same curve both ways (fitted: k=830, c=58)
// - content opacity: 350ms spring-like linear() curve; on open it waits
//   100ms for the height to lead, on close it fades immediately
// - chevron: 90° rotation over 120ms (CSS)
const ACCORDION_FADE_STOPS = [
  0, 0.0187, 0.0663, 0.1321, 0.2081, 0.2886, 0.3692, 0.4472, 0.5205, 0.588,
  0.6492, 0.7038, 0.7519, 0.7939, 0.8302, 0.8612, 0.8875, 0.9097, 0.9281, 0.9434,
  0.956, 0.9662, 0.9744, 0.981, 0.9863, 0.9903, 0.9935, 0.9959, 0.9977, 0.9991,
  1, 1.0007, 1.0011, 1, 1,
];
export const ACCORDION_HEIGHT = { type: 'spring', stiffness: 830, damping: 58, mass: 1 };
export const ACCORDION_FADE   = { duration: 0.35, ease: linearStopsEase(ACCORDION_FADE_STOPS) };

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

// Metric reveal, copied from the Framer "Animated Stats Pro" component
// (animatedstatspro.framer.website): each stat fades in from opacity 0, rises
// 40px and un-blurs from 12px over 2s on cubic-bezier(0.16, 1, 0.3, 1), its
// number counting up on the same curve and clock; stats start 240ms apart.
export const METRIC_EASE = [0.16, 1, 0.3, 1];
export const METRIC_REVEAL_MS = 2000;
export const METRIC_STAGGER_MS = 240;
