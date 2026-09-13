import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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

function GlobeCanvas({ activeIndex, chapters }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const stateRef = useRef({
    rotation: [-102, -27, 0],
    scale: 1,
    size: [0, 0],
    activeIndex: 0,
    routeProgress: 1,
    palette: null,
  });

  useEffect(() => {
    if (stateRef.current.activeIndex !== activeIndex) {
      stateRef.current.activeIndex = activeIndex;
      stateRef.current.routeProgress = activeIndex > 1 ? 0 : 1;
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
      const rect = wrap.getBoundingClientRect();
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
      const ease = reducedMotion ? 1 : Math.min(1, dt * 0.0038);

      targetRotation[0] = shortestTarget(state.rotation[0], targetRotation[0]);
      state.rotation = state.rotation.map((value, index) => value + (targetRotation[index] - value) * ease);
      state.scale += (targetScale - state.scale) * ease;
      state.routeProgress = reducedMotion ? 1 : Math.min(1, state.routeProgress + dt / 1100);

      projection
        .translate([
          stacked
            ? width * 0.5
            : isCaliforniaView
              ? width * 0.54
              : width - state.scale,
          stacked && isOverview ? Math.max(height * 0.55, state.scale * 0.96) : height * 0.5,
        ])
        .scale(state.scale)
        .rotate(state.rotation);

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

      // In California, keep only the in-state route; the final chapter intentionally
      // clears every route so Santa Clara reads as one focused destination.
      if (state.activeIndex < chapters.length) {
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
    </div>
  );
}

export default function ResumeGlobe({ content }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const rootRef = useRef(null);
  const stepsRef = useRef([]);
  const chapters = content.journey || [];

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

  useEffect(() => {
    const component = rootRef.current;
    const stage = component?.querySelector('.resume-globe-stage');
    const copy = component?.querySelector('.resume-globe-copy');
    const pageScrollRoot = component?.closest('.page-body');
    if (!stage || !copy || !pageScrollRoot) return undefined;

    let previousTouchY = null;
    let touchStartIndex = 0;
    let touchDirection = 0;
    let settleTimer;
    let wheelGestureTimer;
    let wheelGestureActive = false;
    let settleRaf = 0;
    let isSettling = false;
    let ignoreNativeScrollUntil = 0;

    const isStacked = () => window.matchMedia('(max-width: 768px)').matches;
    const getScrollRoot = () => isStacked() ? copy : pageScrollRoot;
    const cancelSettle = () => {
      window.clearTimeout(settleTimer);
      settleTimer = undefined;
      if (settleRaf) cancelAnimationFrame(settleRaf);
      settleRaf = 0;
      isSettling = false;
    };
    const scenePositions = (scrollRoot) => {
      const rootRect = scrollRoot.getBoundingClientRect();
      const maxTop = scrollRoot.scrollHeight - scrollRoot.clientHeight;
      return stepsRef.current.map((step) => {
        if (!step) return 0;
        const stepRect = step.getBoundingClientRect();
        const top = scrollRoot.scrollTop + stepRect.top - rootRect.top;
        return Math.max(0, Math.min(top, maxTop));
      });
    };
    const nearestSceneIndex = (scrollRoot) => {
      const positions = scenePositions(scrollRoot);
      return positions.reduce((best, top, index) => (
        Math.abs(top - scrollRoot.scrollTop) < best.distance
          ? { index, distance: Math.abs(top - scrollRoot.scrollTop) }
          : best
      ), { index: 0, distance: Number.POSITIVE_INFINITY }).index;
    };
    const animateToScene = (scrollRoot, targetIndex) => {
      const positions = scenePositions(scrollRoot);
      const safeIndex = Math.max(0, Math.min(targetIndex, positions.length - 1));
      const from = scrollRoot.scrollTop;
      const target = positions[safeIndex];
      const distance = target - from;
      if (Math.abs(distance) < 0.75) {
        scrollRoot.scrollTop = target;
        return;
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        scrollRoot.scrollTop = target;
        return;
      }

      cancelSettle();
      isSettling = true;
      const startedAt = performance.now();
      const duration = Math.min(640, Math.max(480, 480 + Math.abs(distance) * 0.2));
      const tick = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        // Smoothstep keeps the direct scene navigation responsive without the
        // previous fast launch: it accelerates gently, carries speed through
        // the middle, then decelerates continuously into the exact pixel.
        const eased = progress * progress * (3 - 2 * progress);
        // A scroll event caused by this assignment can be delivered after the
        // animation frame has completed. Keep a short suppression window so
        // that delayed programmatic events cannot start a second snap.
        ignoreNativeScrollUntil = now + 120;
        scrollRoot.scrollTop = from + distance * eased;
        if (progress < 1) {
          settleRaf = requestAnimationFrame(tick);
        } else {
          // Hold the settling state through two paints. Some browsers dispatch
          // the final scroll event on the following frame; releasing here used
          // to create the occasional last-pixel "pull" at the end.
          settleRaf = requestAnimationFrame(() => {
            settleRaf = requestAnimationFrame(() => {
              settleRaf = 0;
              isSettling = false;
            });
          });
        }
      };
      settleRaf = requestAnimationFrame(tick);
    };
    const settleToNearestScene = () => {
      const scrollRoot = getScrollRoot();
      animateToScene(scrollRoot, nearestSceneIndex(scrollRoot));
    };
    const scheduleSettle = () => {
      if (isSettling) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settleToNearestScene, 80);
    };
    const onNativeScroll = () => {
      if (!isSettling && performance.now() >= ignoreNativeScrollUntil) scheduleSettle();
    };

    const onTouchStart = (event) => {
      if (!isStacked() || event.touches.length !== 1) return;
      cancelSettle();
      previousTouchY = event.touches[0].clientY;
      touchStartIndex = nearestSceneIndex(copy);
      touchDirection = 0;
    };

    const onTouchMove = (event) => {
      if (previousTouchY === null || event.touches.length !== 1) return;
      event.preventDefault();
      const nextY = event.touches[0].clientY;
      const delta = previousTouchY - nextY;
      if (Math.abs(delta) > 0.5) touchDirection = Math.sign(delta);
      copy.scrollTop += delta;
      previousTouchY = nextY;
    };

    const onTouchEnd = () => {
      if (previousTouchY === null) return;
      previousTouchY = null;
      animateToScene(copy, touchStartIndex + touchDirection);
    };

    const onWheelNavigate = (event) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || Math.abs(event.deltaY) < 0.5) return;
      event.preventDefault();
      window.clearTimeout(wheelGestureTimer);
      wheelGestureTimer = window.setTimeout(() => { wheelGestureActive = false; }, 140);
      if (wheelGestureActive) return;
      wheelGestureActive = true;

      const scrollRoot = getScrollRoot();
      const currentIndex = nearestSceneIndex(scrollRoot);
      cancelSettle();
      animateToScene(scrollRoot, currentIndex + Math.sign(event.deltaY));
    };

    stage.addEventListener('touchstart', onTouchStart, { passive: true });
    stage.addEventListener('touchmove', onTouchMove, { passive: false });
    stage.addEventListener('touchend', onTouchEnd, { passive: true });
    stage.addEventListener('touchcancel', onTouchEnd, { passive: true });
    copy.addEventListener('touchstart', onTouchStart, { passive: true });
    copy.addEventListener('touchmove', onTouchMove, { passive: false });
    copy.addEventListener('touchend', onTouchEnd, { passive: true });
    copy.addEventListener('touchcancel', onTouchEnd, { passive: true });
    pageScrollRoot.addEventListener('wheel', onWheelNavigate, { passive: false });
    pageScrollRoot.addEventListener('scroll', onNativeScroll, { passive: true });
    copy.addEventListener('scroll', onNativeScroll, { passive: true });
    return () => {
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchmove', onTouchMove);
      stage.removeEventListener('touchend', onTouchEnd);
      stage.removeEventListener('touchcancel', onTouchEnd);
      copy.removeEventListener('touchstart', onTouchStart);
      copy.removeEventListener('touchmove', onTouchMove);
      copy.removeEventListener('touchend', onTouchEnd);
      copy.removeEventListener('touchcancel', onTouchEnd);
      pageScrollRoot.removeEventListener('wheel', onWheelNavigate);
      pageScrollRoot.removeEventListener('scroll', onNativeScroll);
      copy.removeEventListener('scroll', onNativeScroll);
      window.clearTimeout(wheelGestureTimer);
      cancelSettle();
    };
  }, [chapters.length]);

  return (
    <div className="resume-globe" ref={rootRef}>
      <aside className="resume-globe-stage" aria-label="Career locations on an interactive globe">
        <GlobeCanvas activeIndex={activeIndex} chapters={chapters} />
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
            With over 10 years of experience across enterprise and consumer platforms, I specialize in systematic thinking—transforming fragmented systems into cohesive, scalable experiences that help people accomplish meaningful work.
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

      <span className={`resume-scroll-cue${isAtStart ? ' is-visible' : ''}`} aria-hidden="true">
        <span>Scroll to explore</span>
        <svg viewBox="0 0 16 16" focusable="false">
          <path d="M8 2.5v10M4.5 9.5 8 13l3.5-3.5" />
        </svg>
      </span>
    </div>
  );
}
