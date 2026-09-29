import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  geoContains,
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
} from 'd3-geo';
import { feature } from 'topojson-client';
import landTopology from 'world-atlas/land-110m.json';
import { fadeUp } from '../transitions';
import ScrollCue from './ScrollCue';
import { asset } from '../utils/asset';

const land = feature(landTopology, landTopology.objects.land);
const sphere = { type: 'Sphere' };
const graticule = geoGraticule10();

const landDots = [];
for (let lat = -56; lat <= 76; lat += 3) {
  for (let lon = -180; lon < 180; lon += 3) {
    if (geoContains(land, [lon, lat])) landDots.push([lon, lat]);
  }
}

const readPalette = () => {
  const styles = getComputedStyle(document.documentElement);
  return {
    surface: styles.getPropertyValue('--surface-1').trim(),
    ink: styles.getPropertyValue('--ink').trim(),
    hairline: styles.getPropertyValue('--hairline-strong').trim(),
    accent: styles.getPropertyValue('--accent').trim(),
  };
};

const shortestTarget = (current, target) => {
  let next = target;
  while (next - current > 180) next -= 360;
  while (next - current < -180) next += 360;
  return next;
};

function drawMarker(ctx, projection, point, palette, time, showPulse = true, radius = 4.2) {
  const center = [-projection.rotate()[0], -projection.rotate()[1]];
  if (geoDistance(point, center) > Math.PI / 2) return;
  const xy = projection(point);
  if (!xy) return;

  const [x, y] = xy;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  if (showPulse) {
    const pulse = 9 + ((time / 42) % 14);
    ctx.strokeStyle = palette.accent;
    ctx.globalAlpha = 0.52 - ((pulse - 9) / 14) * 0.4;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, y, pulse, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function routePoint(from, to, t) {
  let longitudeDelta = to[0] - from[0];
  if (longitudeDelta > 180) longitudeDelta -= 360;
  if (longitudeDelta < -180) longitudeDelta += 360;

  const angularDistance = geoDistance(from, to) * (180 / Math.PI);
  const latitudeArc = angularDistance < 1
    ? 0.035
    : Math.min(10, angularDistance * 0.12);

  return [
    from[0] + longitudeDelta * t,
    from[1] + (to[1] - from[1]) * t + Math.sin(Math.PI * t) * latitudeArc,
  ];
}

function drawConnection(ctx, projection, from, to, palette, progress, isCurrent) {
  const routeDistance = geoDistance(from, to);
  if (routeDistance < 0.00001 || progress <= 0) return;
  const isLocalRoute = routeDistance < 0.012;

  const center = [-projection.rotate()[0], -projection.rotate()[1]];
  const fromVisible = geoDistance(from, center) < Math.PI / 2;
  const fromXY = fromVisible ? projection(from) : null;

  ctx.save();
  ctx.strokeStyle = palette.accent;
  ctx.fillStyle = palette.accent;
  ctx.globalAlpha = isCurrent ? 1 : 0.42;
  ctx.lineWidth = isLocalRoute ? 1.5 : isCurrent ? 2.4 : 1.35;
  ctx.shadowColor = palette.accent;
  ctx.shadowBlur = isCurrent ? (isLocalRoute ? 2 : 7) : 0;

  const points = [];
  const steps = Math.max(2, Math.ceil(96 * progress));
  for (let step = 0; step <= steps; step += 1) {
    points.push(routePoint(from, to, (step / steps) * progress));
  }
  ctx.beginPath();
  geoPath(projection, ctx)({ type: 'LineString', coordinates: points });
  ctx.stroke();

  if (isCurrent && fromXY) {
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(fromXY[0], fromXY[1], isLocalRoute ? 1.7 : 3.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Space between the marker and the photo stack (clears the marker's pulse).
const PHOTO_GAP = 28;
// The stack emerges from the marker once the globe has arrived: a short
// slide up out of the dot with a fade; it slips back quickly on leaving.
const PHOTO_ENTER = { duration: 0.36, ease: [0.23, 1, 0.32, 1] };
const PHOTO_EXIT = { duration: 0.16, ease: 'easeIn' };
// Between two chapters that both have photos the stack stays; only the
// photos cross-fade.
const PHOTO_SWAP = { duration: 0.22, ease: 'easeInOut' };
// "Arrived" = the place is within ~2° of the view center and the zoom is
// within 4% of its target, so photos appear as the globe settles.
const ARRIVE_ANGLE = 0.04;
const ARRIVE_SCALE = 0.04;
const PHOTO_FAN = { type: 'spring', stiffness: 320, damping: 26, mass: 0.7 };
// Card poses for [left, center, right]: tucked behind the center card at
// rest, fanned out on hover (tap on touch), like a hand of cards.
// Up to five cards: [far left, left, center, right, far right].
const PHOTO_POSES = {
  rest: [
    { x: -26, y: 7, rotate: -9, scale: 0.86 },
    { x: -18, y: 4, rotate: -6, scale: 0.92 },
    { x: 0, y: 0, rotate: 0, scale: 1 },
    { x: 18, y: 4, rotate: 6, scale: 0.92 },
    { x: 26, y: 7, rotate: 9, scale: 0.86 },
  ],
  // Spread wide enough that the side photos are mostly uncovered.
  fan: [
    { x: -212, y: 34, rotate: -18, scale: 0.9 },
    { x: -120, y: 14, rotate: -12, scale: 0.96 },
    { x: 0, y: -4, rotate: 0, scale: 1.04 },
    { x: 120, y: 14, rotate: 12, scale: 0.96 },
    { x: 212, y: 34, rotate: 18, scale: 0.9 },
  ],
};
const SLOT_Z = [1, 2, 3, 2, 1];

function PhotoCard({ photo }) {
  if (photo.src) {
    return (
      <img
        src={asset(photo.src)}
        alt={photo.alt || ''}
        draggable={false}
        className={photo.fit === 'contain' ? 'resume-photo-contain' : undefined}
        style={photo.pad !== undefined ? { padding: photo.pad } : undefined}
      />
    );
  }
  return (
    <div className="resume-photo-placeholder" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="4" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="7.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M3 14.5l4.5-4 3.5 3 2.5-2 3.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
      <span>{photo.caption}</span>
    </div>
  );
}

// Up to three photos for the active chapter, stacked above its marker.
// Slot → index into photos: the first photo is the center card, then
// left, right, far left, far right.
const SLOT_PHOTO = [3, 1, 0, 2, 4];

function PhotoStack({ photos, photosKey }) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const pose = hovered || tapped ? 'fan' : 'rest';
  // Smaller cards on phones spread proportionally less.
  const spread = window.matchMedia('(max-width: 768px)').matches ? 0.8 : 1;
  return (
    <motion.div
      className="resume-photo-stack"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: reduceMotion ? { duration: 0.18 } : PHOTO_ENTER }}
      exit={reduceMotion ? { opacity: 0, transition: { duration: 0.12 } } : { opacity: 0, y: 8, scale: 0.96, transition: PHOTO_EXIT }}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onClick={() => { if (!hovered) setTapped((t) => !t); }}
    >
      {SLOT_PHOTO.map((photoIndex, slot) => {
        const photo = photos[photoIndex];
        return (
          <motion.figure
            key={slot}
            className="resume-photo-card"
            style={{ zIndex: SLOT_Z[slot] }}
            initial={false}
            animate={{ ...PHOTO_POSES[pose][slot], x: PHOTO_POSES[pose][slot].x * spread, opacity: photo ? 1 : 0 }}
            transition={reduceMotion ? { duration: 0 } : { ...PHOTO_FAN, opacity: PHOTO_SWAP }}
          >
            <AnimatePresence initial={false}>
              {photo && (
                <motion.div
                  key={`${photosKey}-${photoIndex}`}
                  className="resume-photo-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : PHOTO_SWAP}
                >
                  <PhotoCard photo={photo} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.figure>
        );
      })}
    </motion.div>
  );
}

function GlobeCanvas({ activeIndex, chapters, showPhotos, onArrive, children }) {
  const canvasRef = useRef(null);
  const anchorRef = useRef(null);
  const onArriveRef = useRef(onArrive);
  useEffect(() => { onArriveRef.current = onArrive; }, [onArrive]);
  const wrapRef = useRef(null);
  const stateRef = useRef({
    rotation: [-102, -27, 0],
    scale: 1,
    size: [0, 0],
    activeIndex: 0,
    routeProgress: 1,
    center: null,
    arrivedIndex: -1,
    palette: null,
  });

  useEffect(() => {
    if (stateRef.current.activeIndex !== activeIndex) {
      stateRef.current.activeIndex = activeIndex;
      stateRef.current.routeProgress = activeIndex > 1 ? 0 : 1;
      // Leaving a chapter clears its arrival.
      stateRef.current.arrivedIndex = -1;
    }
  }, [activeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    const projection = geoOrthographic().clipAngle(90).precision(0.3);
    const path = geoPath(projection, ctx);
    let raf = 0;
    let last = performance.now();
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      // Layout size, not getBoundingClientRect: the page opens under a
      // Framer scale transform, and measuring the scaled box made the globe
      // start small and then slide / grow into place.
      const rect = { width: wrap.clientWidth, height: wrap.clientHeight };
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.max(1, Math.round(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(rect.height * pixelRatio));
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      stateRef.current.size = [rect.width, rect.height];
      stateRef.current.scale = Math.min(rect.width, rect.height) * 0.66;
      stateRef.current.palette = readPalette();
    };

    // Shared-layout navigation briefly scales the entire page. Re-measuring the
    // backing store after that transition prevents the browser from retaining a
    // softened canvas texture until the next manual window resize.
    const settleTimers = [0, 120, 420, 760].map((delay) => window.setTimeout(resize, delay));
    const onPageShow = () => resize();

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();
    window.addEventListener('pageshow', onPageShow);
    document.fonts?.ready.then(resize);

    const themeObserver = new MutationObserver(() => {
      stateRef.current.palette = readPalette();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (event) => { reducedMotion = event.matches; };
    motionQuery.addEventListener?.('change', onMotionChange);

    const render = (now) => {
      const state = stateRef.current;
      const [width, height] = state.size;
      const palette = state.palette;
      if (!width || !height || !palette) {
        raf = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min(32, now - last);
      last = now;
      const activeChapter = state.activeIndex > 0 ? chapters[state.activeIndex - 1] : null;
      const isOverview = state.activeIndex === 0;
      const destination = isOverview
        ? [105 + Math.sin(now / 7000) * 3, 33]
        : activeChapter.coordinates;
      const targetRotation = [-destination[0], -destination[1], 0];
      const stacked = window.matchMedia('(max-width: 768px)').matches;
      const isUnitedStates = state.activeIndex >= 2;
      const isCaliforniaView = state.activeIndex >= 3;
      const targetScale = Math.min(width, height) * (
        isCaliforniaView
          ? 1.65
          : isUnitedStates
            ? (stacked ? 0.72 : 0.74)
            : 0.66
      );
      // A chapter can ask for a closer view (Beyond work zooms in on home).
      const targetZoomedScale = targetScale * (activeChapter?.zoom || 1);
      // The first frame lands the globe already in place (no settle-in).
      const ease = reducedMotion || !state.placed ? 1 : Math.min(1, dt * 0.0038);
      state.placed = true;

      targetRotation[0] = shortestTarget(state.rotation[0], targetRotation[0]);
      state.rotation = state.rotation.map((value, index) => value + (targetRotation[index] - value) * ease);
      state.scale += (targetZoomedScale - state.scale) * ease;
      state.routeProgress = reducedMotion ? 1 : Math.min(1, state.routeProgress + dt / 1100);

      // The globe rotates the active place to the sphere's center, so placing
      // the sphere's center places the marker. In a chapter, the marker and
      // its photo stack are centered together in the stage as one group.
      const anchorEl = anchorRef.current;
      const stackHeight = anchorEl?.dataset.visible === 'true' ? anchorEl.offsetHeight : 0;
      const groupOffset = stackHeight ? (stackHeight + PHOTO_GAP) / 2 : 0;
      const targetCenter = isOverview
        ? [
          stacked ? width * 0.5 : width - state.scale,
          stacked ? Math.max(height * 0.55, state.scale * 0.96) : height * 0.5,
        ]
        : [width * 0.5, height * 0.5 + groupOffset];
      state.center = state.center
        ? state.center.map((value, index) => value + (targetCenter[index] - value) * ease)
        : targetCenter;

      projection
        .translate(state.center)
        .scale(state.scale)
        .rotate(state.rotation);

      if (activeChapter && state.arrivedIndex !== state.activeIndex) {
        const settled = geoDistance(activeChapter.coordinates, [-state.rotation[0], -state.rotation[1]]) < ARRIVE_ANGLE
          && Math.abs(state.scale - targetZoomedScale) < targetZoomedScale * ARRIVE_SCALE;
        if (settled) {
          state.arrivedIndex = state.activeIndex;
          onArriveRef.current?.(state.activeIndex);
        }
      }

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.beginPath();
      path(sphere);
      ctx.fillStyle = palette.surface;
      ctx.fill();
      ctx.strokeStyle = palette.hairline;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = palette.hairline;
      ctx.globalAlpha = 0.52;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.beginPath();
      path(land);
      ctx.fillStyle = palette.ink;
      ctx.globalAlpha = 0.035;
      ctx.fill();
      ctx.strokeStyle = palette.ink;
      ctx.globalAlpha = 0.92;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.restore();

      const center = [-projection.rotate()[0], -projection.rotate()[1]];
      ctx.save();
      ctx.fillStyle = palette.ink;
      ctx.globalAlpha = 0.68;
      landDots.forEach((point) => {
        if (geoDistance(point, center) >= Math.PI / 2) return;
        const xy = projection(point);
        if (!xy) return;
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], 1.05, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // In California, keep only the in-state route. A chapter that stays in
      // the previous chapter's place (LinkedIn Sales Solutions) has no journey
      // to show, and the Santa Clara chapters (ServiceNow, then Beyond work)
      // clear every route so home reads as one focused destination.
      const previousChapter = chapters[state.activeIndex - 2];
      const stayedPut = activeChapter && previousChapter
        && geoDistance(activeChapter.coordinates, previousChapter.coordinates) < 0.00001;
      if (state.activeIndex < chapters.length - 1 && !stayedPut) {
        const firstVisibleSegment = state.activeIndex >= 4 ? 3 : 1;
        for (let segment = firstVisibleSegment; segment < state.activeIndex; segment += 1) {
          const isCurrent = segment === state.activeIndex - 1;
          drawConnection(
            ctx,
            projection,
            chapters[segment - 1].coordinates,
            chapters[segment].coordinates,
            palette,
            isCurrent ? state.routeProgress : 1,
            isCurrent,
          );
        }
      }

      if (activeChapter) {
        drawMarker(
          ctx,
          projection,
          activeChapter.coordinates,
          palette,
          now,
          true,
          4.2,
        );
      }


      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      settleTimers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pageshow', onPageShow);
      motionQuery.removeEventListener?.('change', onMotionChange);
    };
  }, [chapters]);

  return (
    <div className="resume-globe-canvas-wrap" ref={wrapRef}>
      <canvas ref={canvasRef} className="resume-globe-canvas" aria-hidden="true" />
      <div className="resume-globe-vignette" aria-hidden="true" />
      {/* Sits where the marker comes to rest (see groupOffset), so the stack
          never has to chase the marker while the globe turns. Always sized
          to the stack, so the offset is known before the photos appear. */}
      <div className="resume-photo-anchor" ref={anchorRef} data-visible={showPhotos ? 'true' : 'false'}>
        <AnimatePresence>{children}</AnimatePresence>
      </div>
    </div>
  );
}

export default function ResumeGlobe({ content }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const rootRef = useRef(null);
  const stepsRef = useRef([]);
  const chapters = content.journey || [];
  const activeChapter = activeIndex > 0 ? chapters[activeIndex - 1] : null;
  const activePhotos = activeChapter?.photos || [];
  // The chapter whose photos are showing. A chapter's photos emerge once
  // the globe arrives there, unless the previous chapter's stack is still
  // showing: then the stack stays and only its photos change.
  const [shownIndex, setShownIndex] = useState(-1);
  const [previousIndex, setPreviousIndex] = useState(activeIndex);
  if (previousIndex !== activeIndex) {
    setPreviousIndex(activeIndex);
    setShownIndex(shownIndex !== -1 && activePhotos.length > 0 ? activeIndex : -1);
  }
  const handleArrive = useCallback((index) => {
    if (content.journey?.[index - 1]?.photos?.length) setShownIndex(index);
  }, [content.journey]);

  useEffect(() => {
    const component = rootRef.current;
    const pageScrollRoot = component?.closest('.page-body');
    const mobileScrollRoot = component?.querySelector('.resume-globe-copy');
    if (!component || !pageScrollRoot || !mobileScrollRoot) return undefined;
    let ticking = false;

    const update = () => {
      ticking = false;
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      const scrollRoot = mobile ? mobileScrollRoot : pageScrollRoot;
      const nextIsAtStart = scrollRoot.scrollTop <= 2;
      setIsAtStart((current) => current === nextIsAtStart ? current : nextIsAtStart);
      const rootRect = scrollRoot.getBoundingClientRect();
      const focusY = rootRect.top + rootRect.height * 0.48;
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      stepsRef.current.forEach((step, index) => {
        if (!step) return;
        const rect = step.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height * 0.5 - focusY);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      setActiveIndex(bestIndex);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    pageScrollRoot.addEventListener('scroll', onScroll, { passive: true });
    mobileScrollRoot.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      pageScrollRoot.removeEventListener('scroll', onScroll);
      mobileScrollRoot.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [chapters.length]);

  // Desktop and copy-panel scrolling stay fully native. On stacked layouts the
  // globe is a sibling of the scrollable copy, so only gestures that begin on
  // the globe are forwarded to that native scroller; CSS scroll snap handles
  // the final resting scene.
  useEffect(() => {
    const component = rootRef.current;
    const stage = component?.querySelector('.resume-globe-stage');
    const copy = component?.querySelector('.resume-globe-copy');
    if (!stage || !copy) return undefined;

    let previousTouchY = null;
    const isStacked = () => window.matchMedia('(max-width: 768px)').matches;

    const onStageWheel = (event) => {
      if (!isStacked() || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      copy.scrollBy({ top: event.deltaY, behavior: 'auto' });
    };
    const onStageTouchStart = (event) => {
      if (!isStacked() || event.touches.length !== 1) return;
      previousTouchY = event.touches[0].clientY;
    };
    const onStageTouchMove = (event) => {
      if (previousTouchY === null || event.touches.length !== 1) return;
      event.preventDefault();
      const nextY = event.touches[0].clientY;
      copy.scrollTop += previousTouchY - nextY;
      previousTouchY = nextY;
    };
    const onStageTouchEnd = () => {
      previousTouchY = null;
    };

    stage.addEventListener('wheel', onStageWheel, { passive: false });
    stage.addEventListener('touchstart', onStageTouchStart, { passive: true });
    stage.addEventListener('touchmove', onStageTouchMove, { passive: false });
    stage.addEventListener('touchend', onStageTouchEnd, { passive: true });
    stage.addEventListener('touchcancel', onStageTouchEnd, { passive: true });
    return () => {
      stage.removeEventListener('wheel', onStageWheel);
      stage.removeEventListener('touchstart', onStageTouchStart);
      stage.removeEventListener('touchmove', onStageTouchMove);
      stage.removeEventListener('touchend', onStageTouchEnd);
      stage.removeEventListener('touchcancel', onStageTouchEnd);
    };
  }, []);

  return (
    <div className="resume-globe" ref={rootRef}>
      <aside className="resume-globe-stage" aria-label="Career locations on an interactive globe">
        <GlobeCanvas
          activeIndex={activeIndex}
          chapters={chapters}
          showPhotos={activePhotos.length > 0}
          onArrive={handleArrive}
        >
          {activePhotos.length > 0 && shownIndex === activeIndex && (
            <PhotoStack key="photos" photos={activePhotos} photosKey={activeChapter.id} />
          )}
        </GlobeCanvas>
      </aside>

      <div className="resume-globe-copy">
        <section
          className={`resume-step resume-step--intro${activeIndex === 0 ? ' is-active' : ''}`}
          ref={(node) => { stepsRef.current[0] = node; }}
        >
          <motion.h1 custom={0} variants={fadeUp} initial="hidden" animate="show">
            Designing AI-native products and complex platform ecosystems
          </motion.h1>
          <motion.p className="resume-description" custom={1} variants={fadeUp} initial="hidden" animate="show">
            With over 10 years of experience across enterprise and consumer platforms, I specialize in systematic thinking, transforming fragmented systems into cohesive, scalable experiences that help people accomplish meaningful work.
          </motion.p>
          <motion.div className="resume-step-actions" custom={2} variants={fadeUp} initial="hidden" animate="show">
            <a href={content.resumeUrl} download className="about-resume-btn">Download Résumé</a>
          </motion.div>
        </section>

        {chapters.map((chapter, index) => (
          <section
            key={chapter.id}
            className={`resume-step${activeIndex === index + 1 ? ' is-active' : ''}`}
            ref={(node) => { stepsRef.current[index + 1] = node; }}
          >
            <span className="resume-eyebrow">{chapter.eyebrow}</span>
            <h2>{chapter.title}</h2>
            <p className="resume-description">{chapter.body}</p>
          </section>
        ))}
      </div>

      <ScrollCue visible={isAtStart} className="resume-scroll-cue" />
    </div>
  );
}
