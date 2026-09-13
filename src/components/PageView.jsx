import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { flushSync } from 'react-dom';
import lottie from 'lottie-web/build/player/lottie_light.js';
import { T, fadeUp, SPRING_SLOW, EASE_HERO } from '../transitions';
import { asset } from '../utils/asset';
import ResumeGlobe from './ResumeGlobe';

const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const HEADING_TERMS = new Map([
  ['account', 'Account'],
  ['academy', 'Academy'],
  ['ai', 'AI'],
  ['api', 'API'],
  ['b2b', 'B2B'],
  ['csat', 'CSAT'],
  ['figjam', 'FigJam'],
  ['figma', 'Figma'],
  ['gai', 'GAI'],
  ['genai', 'GenAI'],
  ['hci', 'HCI'],
  ['hatcher', 'Hatcher'],
  ['hi-fi', 'Hi-Fi'],
  ['i', 'I'],
  ['iq', 'IQ'],
  ['jill', 'Jill'],
  ['lighthouse', 'Lighthouse'],
  ['linkedin', 'LinkedIn'],
  ['liz', 'Liz'],
  ['mmm', 'MMM'],
  ['mta', 'MTA'],
  ['neustar', 'Neustar'],
  ['oscar', 'Oscar'],
  ['pete', 'Pete'],
  ['scenario', 'Scenario'],
  ['listing', 'Listing'],
  ['servicenow', 'ServiceNow'],
  ['ui', 'UI'],
  ['ux', 'UX'],
]);

function sentenceCaseHeading(text) {
  if (!text) return text;
  let isFirstWord = true;
  return text.replace(/[A-Za-z][A-Za-z0-9]*(?:[-'][A-Za-z0-9]+)*/g, (word) => {
    const canonical = HEADING_TERMS.get(word.toLowerCase());
    const isAcronym = /[A-Z]/.test(word) && word === word.toUpperCase();
    const isMixedCaseName = /[a-z][A-Z]/.test(word);
    let result = canonical || (isAcronym || isMixedCaseName ? word : word.toLowerCase());
    if (isFirstWord) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
      isFirstWord = false;
    }
    return result;
  });
}

function ProjectLottie({ src, label }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    let animation = null;
    let cancelled = false;
    let visible = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!animation || reduceMotion) return;
      if (visible) animation.play();
      else animation.pause();
    }, { rootMargin: '120px 0px', threshold: 0.05 });
    if (containerRef.current) observer.observe(containerRef.current);

    fetch(asset(src), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load animation: ${src}`);
        return response.json();
      })
      .then((animationData) => {
        if (cancelled || !containerRef.current) return;
        animation = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          animationData,
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
        });
        if (reduceMotion) animation.goToAndStop(0, true);
        else if (visible) animation.play();
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.error(error);
      });
    return () => {
      cancelled = true;
      controller.abort();
      observer.disconnect();
      animation?.destroy();
    };
  }, [src]);

  return (
    <div ref={containerRef} className="project-lottie" role="img" aria-label={label || 'Animated illustration'} />
  );
}

function ProjectSectionHeading({ section, isH2 }) {
  if (!section.heading) return null;
  const label = sentenceCaseHeading(section.heading);
  return isH2
    ? <h2 id={slugify(section.heading)} className="section-h2">{label}</h2>
    : <h3 className="section-h3">{label}</h3>;
}

function ProjectImageWrap({ id, src, caption, onImageClick, children }) {
  const interactive = Boolean(id && onImageClick);
  return (
    <motion.div
      className={`section-img-wrap${onImageClick ? ' section-img-wrap--clickable' : ''}`}
      layoutId={id ? `item-img-${id}` : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? (caption || 'View image') : undefined}
      onClick={interactive ? () => onImageClick(id, src, caption) : undefined}
      onKeyDown={interactive ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onImageClick(id, src, caption);
        }
      } : undefined}
      whileHover={interactive ? { scale: 1.01, transition: { duration: 0.15 } } : {}}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated number counter (triggers on first viewport entry) ─────────── */
function CountUp({ value, duration = 1400 }) {
  const [display, setDisplay] = useState('0');
  const ref      = useRef(null);
  const started  = useRef(false);

  // Parse: split into prefix, number, suffix  e.g. "$22.6M" → ['$', 22.6, 'M']
  const { prefix, number, suffix, decimals } = (() => {
    const raw = String(value);
    const m = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!m) return { prefix: '', number: 0, suffix: raw, decimals: 0 };
    const dec = (m[2].split('.')[1] || '').length;
    return { prefix: m[1], number: parseFloat(m[2]), suffix: m[3], decimals: dec };
  })();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        // ease-out cubic
        const e = 1 - Math.pow(1 - p, 3);
        const cur = number * e;
        setDisplay(decimals > 0 ? cur.toFixed(decimals) : Math.round(cur).toString());
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [number, decimals, duration]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

/* ─── Before/after comparison slider ─────────────────────────────────────── */
function ComparisonSlider({ before, after }) {
  const [pos, setPos] = useState(50);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let activeId = null;

    const update = (clientX) => {
      const { left, width } = el.getBoundingClientRect();
      setPos(Math.max(2, Math.min(98, ((clientX - left) / width) * 100)));
    };

    const onDown = (e) => {
      activeId = e.pointerId;
      el.setPointerCapture(e.pointerId);
      update(e.clientX);
      e.preventDefault();
    };
    const onMove = (e) => { if (e.pointerId === activeId) update(e.clientX); };
    const onUp   = (e) => { if (e.pointerId === activeId) activeId = null; };

    el.addEventListener('pointerdown',  onDown);
    el.addEventListener('pointermove',  onMove);
    el.addEventListener('pointerup',    onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown',  onDown);
      el.removeEventListener('pointermove',  onMove);
      el.removeEventListener('pointerup',    onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown') { setPos((p) => Math.max(2, p - step)); e.preventDefault(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp')   { setPos((p) => Math.min(98, p + step)); e.preventDefault(); }
    else if (e.key === 'Home') { setPos(2);  e.preventDefault(); }
    else if (e.key === 'End')  { setPos(98); e.preventDefault(); }
  };

  return (
    <div
      className="cs-wrap"
      ref={wrapRef}
      role="slider"
      tabIndex={0}
      aria-label={`Before/after comparison: ${before.label} vs ${after.label}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      aria-valuetext={`${Math.round(pos)}% ${after.label}, use arrow keys to adjust`}
      onKeyDown={onKeyDown}
    >
      <img src={asset(after.src)}  alt={after.label}  className="cs-img" loading="lazy" />
      <img src={asset(before.src)} alt={before.label} className="cs-img cs-img--over" loading="lazy"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <div className="cs-handle" style={{ left: `${pos}%` }}>
        <div className="cs-line" />
        <div className="cs-knob">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M6 9H1M12 9h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M4 6L1 9l3 3M14 6l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <span className="cs-label cs-label--l">{before.label}</span>
      <span className="cs-label cs-label--r">{after.label}</span>
    </div>
  );
}

const SWIPE_OFFSET_THRESHOLD   = 50;
const SWIPE_VELOCITY_THRESHOLD = 400;

function useAdjacentImagePreload(images, index) {
  useEffect(() => {
    if (!images || images.length < 2) return;
    const count = images.length;
    const adjacent = [
      images[(index - 1 + count) % count],
      images[(index + 1) % count],
    ];
    adjacent.forEach((image) => {
      const preload = new window.Image();
      preload.src = asset(image.src);
    });
  }, [images, index]);
}

function useSwipeNavigation({ enabled, onPrevious, onNext, trackRef }) {
  const startRef = useRef(null);
  const animatingRef = useRef(false);
  const animationRef = useRef(null);
  const currentXRef = useRef(0);
  const suppressClickRef = useRef(false);

  const setTransform = useCallback((value) => {
    currentXRef.current = value;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${value}px, 0, 0)`;
    }
  }, [trackRef]);

  const animateTo = useCallback((target, duration) => {
    const element = trackRef.current;
    if (!element) return Promise.resolve();

    animationRef.current?.cancel();
    const animation = element.animate([
      { transform: `translate3d(${currentXRef.current}px, 0, 0)` },
      { transform: `translate3d(${target}px, 0, 0)` },
    ], {
      duration,
      easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
      fill: 'forwards',
    });
    animationRef.current = animation;

    return animation.finished.then(() => {
      currentXRef.current = target;
      if (trackRef.current === element) {
        element.style.transform = `translate3d(${target}px, 0, 0)`;
      }
      animation.cancel();
      if (animationRef.current === animation) animationRef.current = null;
    }).catch(() => {});
  }, [trackRef]);

  const settleBack = useCallback(() => {
    animateTo(0, 180);
  }, [animateTo]);

  const navigate = useCallback((direction, width) => {
    if (!enabled || animatingRef.current || !width) return;

    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (shouldReduceMotion) {
      flushSync(() => {
        if (direction === 'next') onNext();
        else onPrevious();
      });
      setTransform(0);
      return;
    }

    animatingRef.current = true;
    const destination = direction === 'next' ? -width : width;
    const remainingRatio = Math.min(1, Math.abs(destination - currentXRef.current) / width);
    const duration = Math.max(160, Math.round(280 * remainingRatio));
    animateTo(destination, duration).then(() => {
      // Reset the physical track before swapping its three stable slide sources.
      // Both mutations happen in the same task, so the newly-current image is
      // already centered when the browser paints the next frame.
      setTransform(0);
      flushSync(() => {
        if (direction === 'next') onNext();
        else onPrevious();
      });
      animatingRef.current = false;
    });
  }, [animateTo, enabled, onNext, onPrevious, setTransform]);

  const onPointerDown = useCallback((event) => {
    if (!enabled || animatingRef.current || event.target.closest('button')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    animationRef.current?.cancel();
    animationRef.current = null;
    setTransform(0);
    startRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
      width: trackRef.current?.getBoundingClientRect().width
        || event.currentTarget.getBoundingClientRect().width,
      intent: null,
    };
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // Synthetic pointers and older touch browsers may not expose capture.
    }
  }, [enabled, setTransform, trackRef]);

  const onPointerMove = useCallback((event) => {
    const start = startRef.current;
    if (!start || start.pointerId !== event.pointerId) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.intent && Math.hypot(dx, dy) >= 7) {
      start.intent = Math.abs(dx) > Math.abs(dy) * 1.08 ? 'horizontal' : 'vertical';
    }
    if (start.intent !== 'horizontal') return;

    setTransform(dx);
  }, [setTransform]);

  const onPointerUp = useCallback((event) => {
    const start = startRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    startRef.current = null;
    try {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // The pointer may already have been released by the browser.
    }

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const elapsed = Math.max(1, performance.now() - start.time);
    const velocity = Math.abs(dx) / elapsed * 1000;
    const isHorizontal = start.intent === 'horizontal' || Math.abs(dx) > Math.abs(dy) * 1.15;
    const crossedThreshold = Math.abs(dx) >= SWIPE_OFFSET_THRESHOLD
      || (Math.abs(dx) >= 28 && velocity >= SWIPE_VELOCITY_THRESHOLD);

    if (!isHorizontal || !crossedThreshold) {
      settleBack();
      return;
    }
    suppressClickRef.current = true;
    window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    navigate(dx < 0 ? 'next' : 'previous', start.width);
  }, [navigate, settleBack]);

  const onPointerCancel = useCallback(() => {
    startRef.current = null;
    settleBack();
  }, [settleBack]);

  useEffect(() => () => animationRef.current?.cancel(), []);

  const consumeSuppressedClick = useCallback(() => {
    if (!suppressClickRef.current) return false;
    suppressClickRef.current = false;
    return true;
  }, []);

  return {
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
    consumeSuppressedClick,
    navigate,
  };
}

/* ─── Image carousel ─────────────────────────────────────────────────────── */
function ImageCarousel({ images, onImageClick, aspectRatio, showCaption = false }) {
  const [idx, setIdx] = useState(0);
  const trackRef = useRef(null);
  const count = images.length;
  const img   = images[idx];
  const go    = useCallback((n) => setIdx(((n % count) + count) % count), [count]);
  const ratio = aspectRatio || '4/3';
  useAdjacentImagePreload(images, idx);

  const swipe = useSwipeNavigation({
    enabled: count > 1,
    onPrevious: () => go(idx - 1),
    onNext: () => go(idx + 1),
    trackRef,
  });

  return (
    <div className="img-carousel">
      {/* Fixed-ratio stage — images positioned absolute to fill it */}
      <div
        className="img-carousel-stage"
        style={{ '--carousel-ratio': ratio }}
        data-swipe-enabled={count > 1 || undefined}
        aria-label={count > 1 ? 'Image carousel. Swipe left or right to browse.' : undefined}
        onClick={onImageClick && img.id
          ? (event) => {
              if (!event.target.closest('button') && !swipe.consumeSuppressedClick()) {
                onImageClick(img.id, img.src, img.caption, images, idx);
              }
            }
          : undefined}
        {...swipe.handlers}
      >
        <div ref={trackRef} className="carousel-swipe-track">
          {(count > 1 ? [-1, 0, 1] : [0]).map((offset) => {
            const slide = images[((idx + offset) % count + count) % count];
            return (
              <div
                className="carousel-swipe-slide"
                key={offset}
                style={{ transform: `translate3d(${offset * 100}%, 0, 0)` }}
                aria-hidden={offset !== 0 || undefined}
              >
                <img
                  src={asset(slide.src)}
                  alt={offset === 0 ? slide.caption || '' : ''}
                  className="img-carousel-img"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  style={{ cursor: onImageClick && slide.id ? 'zoom-in' : 'default' }}
                />
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <>
            <button
              className="img-carousel-arrow img-carousel-arrow--prev"
              onClick={() => swipe.navigate('previous', trackRef.current?.clientWidth)}
              aria-label="Previous image"
              title="Previous image"
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
                <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="img-carousel-arrow img-carousel-arrow--next"
              onClick={() => swipe.navigate('next', trackRef.current?.clientWidth)}
              aria-label="Next image"
              title="Next image"
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
                <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {showCaption && img.caption && <p className="section-caption">{img.caption}</p>}
      {count > 1 && (
        <div className="img-carousel-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === idx ? ' carousel-dot--active' : ''}`}
              onClick={() => go(i)}
              aria-label={`Image ${i + 1}`}
              title={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── On-this-page section navigator ─────────────────────────────────────── */
function useOtpState(h2s) {
  const [active, setActive] = useState(() => h2s.length ? slugify(h2s[0].heading) : null);
  const isProgrammaticScroll = useRef(false);
  const scrollEndTimer       = useRef(null);

  useEffect(() => {
    if (!h2s.length) return;
    const container = document.querySelector('.page-body');
    if (!container) return;

    const update = () => {
      if (isProgrammaticScroll.current) return;
      const containerRect = container.getBoundingClientRect();
      const trigger = containerRect.top + containerRect.height * 0.25;
      let found = h2s[0].heading;
      for (const s of h2s) {
        const el = document.getElementById(slugify(s.heading));
        if (el && el.getBoundingClientRect().top <= trigger) found = s.heading;
      }
      setActive(slugify(found));
    };

    container.addEventListener('scroll', update, { passive: true });
    update();
    return () => container.removeEventListener('scroll', update);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = (heading) => {
    setActive(slugify(heading));
    const el = document.getElementById(slugify(heading));
    if (!el) return;
    const container = el.closest('.page-body');

    isProgrammaticScroll.current = true;

    const clearFlag = () => {
      clearTimeout(scrollEndTimer.current);
      scrollEndTimer.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
        container?.removeEventListener('scroll', clearFlag);
      }, 150);
    };

    if (container) {
      container.addEventListener('scroll', clearFlag, { passive: true });
      const top = el.getBoundingClientRect().top
        - container.getBoundingClientRect().top
        + container.scrollTop
        - 72;
      container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Fallback: clear flag after a generous timeout
      scrollEndTimer.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1000);
    }
  };

  return { active, scrollTo };
}

/* Desktop sidebar */
function OnThisPage({ h2s }) {
  const { active, scrollTo } = useOtpState(h2s);
  if (h2s.length < 2) return null;
  return (
    <nav className="on-this-page" aria-label="On this page">
      <ul>
        {h2s.map((s) => (
          <li key={s.heading}>
            <button
              className={`otp-link${active === slugify(s.heading) ? ' otp-link--active' : ''}`}
              onClick={() => scrollTo(s.heading)}
            >
              {sentenceCaseHeading(s.heading)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* Mobile sticky-bottom selector */
function OnThisPageMobile({ h2s }) {
  const { active, scrollTo } = useOtpState(h2s);
  const [open, setOpen] = useState(false);
  if (h2s.length < 2) return null;

  const activeLabel = sentenceCaseHeading(
    h2s.find((s) => slugify(s.heading) === active)?.heading ?? h2s[0].heading,
  );

  const handleSelect = (heading) => {
    scrollTo(heading);
    setOpen(false);
  };

  return (
    <div className="otp-mobile">
      <div className={`otp-mobile-inner${open ? ' otp-mobile-inner--open' : ''}`}>
        {/* Dropdown list — rendered first so it expands upward */}
        <div className={`otp-mobile-list${open ? ' otp-mobile-list--open' : ''}`}>
          {h2s.map((s) => (
            <button
              key={s.heading}
              className={active === slugify(s.heading) ? 'otp-active' : ''}
              onClick={() => handleSelect(s.heading)}
            >
              {sentenceCaseHeading(s.heading)}
            </button>
          ))}
        </div>
        <button className="otp-mobile-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="listbox">
          <span className="otp-mobile-label">{activeLabel}</span>
          <svg
            className={`otp-mobile-chevron${!open ? ' otp-mobile-chevron--up' : ''}`}
            width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── PageView ────────────────────────────────────────────────────────────── */
export default function PageView({ node, onBack, onImageClick, onComparisonClick, onNavigate, siblings, isLightbox, zIndex, skipLayoutTransition, isActive = true }) {
  const { content } = node;
  const tone            = node.tone || 'base';
  const isImagePage     = content.type === 'image';
  const isComparisonPage = content.type === 'comparison';
  const isEmbedPage     = content.type === 'embed';
  const isProject       = content.type === 'project';
  const hasHero     = isProject && ('heroImage' in content);

  // Move keyboard focus into this overlay when it becomes the active (topmost) layer
  const shellRef = useRef(null);
  useEffect(() => {
    if (isActive) shellRef.current?.focus();
  }, [isActive]);

  // Lightbox carousel state — only meaningful when node.lbImages is set
  const lbImages = node.lbImages || null;
  const lbCount  = lbImages?.length ?? 0;
  const [lbIdx, setLbIdx] = useState(node.lbIdx ?? 0);
  const lightboxTrackRef = useRef(null);
  const lbGo = useCallback(
    (n) => setLbIdx(((n % lbCount) + lbCount) % lbCount),
    [lbCount],
  );
  const lightboxSwipe = useSwipeNavigation({
    enabled: isImagePage && lbCount > 1,
    onPrevious: () => lbGo(lbIdx - 1),
    onNext: () => lbGo(lbIdx + 1),
    trackRef: lightboxTrackRef,
  });
  const activeCaption = lbImages ? lbImages[lbIdx].caption : content.caption;
  useAdjacentImagePreload(lbImages, lbIdx);
  const motionShell = isLightbox
    ? { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 } }
    : skipLayoutTransition
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : { layoutId: `item-${node.id}` };

  const overlayTone = content.type === 'contact' ? 'base' : (isImagePage || isComparisonPage || isEmbedPage) ? 'image' : tone;
  const shellClass = [
    'overlay-shell page-overlay',
    `card-${overlayTone}`,
    hasHero                         ? 'page-overlay--hero'     : '',
    isLightbox                      ? 'page-overlay--lightbox' : '',
    (isImagePage || isComparisonPage) ? 'page-overlay--img'    : '',
    isEmbedPage                     ? 'page-overlay--embed'    : '',
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      ref={shellRef}
      className={shellClass}
      style={{ zIndex, ...(isImagePage && node.bg ? { background: node.bg } : {}) }}
      tabIndex={-1}
      aria-hidden={!isActive || undefined}
      inert={!isActive || undefined}
      {...motionShell}
      exit={{ opacity: 0, scale: 0.97, transition: T }}
      transition={isLightbox ? SPRING_SLOW : T}
    >
      {/* Dismiss button — on lightbox, image, and embed pages */}
      {(isLightbox || isImagePage || isEmbedPage) && (
        <button className="lightbox-dismiss" onClick={onBack} aria-label="Close" title="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="11" y1="1" x2="1"  y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {isEmbedPage ? (
        <div className="embed-page-body">
          <iframe
            key={content.src}
            src={asset(content.src)}
            title={node.label}
            className="embed-page-frame"
            loading="lazy"
          />
          {(content.title || content.caption || content.description) && (
            <div className="img-page-caption-bar img-page-caption-bar--stacked">
              <span className="img-page-caption-title">{content.title || content.caption || node.label}</span>
              {content.description && (
                <span className="img-page-caption-text">{content.description}</span>
              )}
            </div>
          )}
        </div>
      ) : isComparisonPage ? (
        <div className="img-page-body">
          <div className="img-page-scroll">
            <div className="cs-lb-wrap">
              <ComparisonSlider before={content.before} after={content.after} />
            </div>
          </div>
        </div>
      ) : isImagePage ? (
        <>
          <div className="img-page-body">
            <div className="img-page-scroll">
              <div
                ref={lightboxTrackRef}
                className="lightbox-swipe-track"
                data-swipe-enabled={lbCount > 1 || undefined}
                aria-label={lbCount > 1 ? 'Image lightbox. Swipe left or right to browse.' : undefined}
                {...lightboxSwipe.handlers}
              >
                {(lbCount > 1 ? [-1, 0, 1] : [0]).map((offset) => {
                  const sourceImages = lbImages || [{ src: content.src, caption: content.caption }];
                  const slide = sourceImages[((lbIdx + offset) % sourceImages.length + sourceImages.length) % sourceImages.length];
                  return (
                    <div
                      className="lightbox-swipe-slide"
                      key={offset}
                      style={{ transform: `translate3d(${offset * 100}%, 0, 0)` }}
                      aria-hidden={offset !== 0 || undefined}
                    >
                      <img
                        src={asset(slide.src)}
                        alt={offset === 0 ? slide.caption || '' : ''}
                        className={`img-page-img${node.fit === 'contain' ? ' img-page-img--contain' : ''}`}
                        loading="eager"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {activeCaption && (
              <motion.div
                className="img-page-caption-bar"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.1 }}
              >
                {lbCount > 1 && (
                  <span className="img-page-caption-counter">{lbIdx + 1} / {lbCount}</span>
                )}
                <span className="img-page-caption-text">{activeCaption}</span>
              </motion.div>
            )}
          </div>

          {/* Prev/next navigation for lightbox carousels */}
          {lbCount > 1 && (
            <>
              <button className="lb-nav lb-nav--prev" onClick={() => lightboxSwipe.navigate('previous', lightboxTrackRef.current?.clientWidth)} aria-label="Previous image" title="Previous image">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                  <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="lb-nav lb-nav--next" onClick={() => lightboxSwipe.navigate('next', lightboxTrackRef.current?.clientWidth)} aria-label="Next image" title="Next image">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                  <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="lb-dots">
                {lbImages.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot${i === lbIdx ? ' carousel-dot--active' : ''}`}
                    onClick={() => lbGo(i)}
                    aria-label={`Image ${i + 1}`}
                    title={`Image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className={`page-body${content.type === 'about' ? ' page-body--about' : ''}`}>
          {hasHero && (
            <div className={`project-hero-section${content.heroImage ? '' : ' project-hero-section--empty'}`}>
              {content.heroImage && (
                <>
                  <motion.img
                    src={asset(content.heroImage)}
                    alt={node.label}
                    className="project-hero-img"
                    initial={{ opacity: 0, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1.1, ease: EASE_HERO }}
                  />
                  <motion.img
                    src={asset(content.heroImage)}
                    alt=""
                    aria-hidden="true"
                    className="project-hero-img project-hero-img--progressive-blur"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.1, ease: EASE_HERO }}
                    draggable={false}
                  />
                </>
              )}
              <div className="project-hero-meta">
                <motion.h1
                  className="project-hero-title"
                  initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, delay: 0.18, ease: EASE_HERO }}
                >
                  {sentenceCaseHeading(node.label)}
                </motion.h1>
                <motion.p
                  className="project-hero-tagline"
                  initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, delay: 0.30, ease: EASE_HERO }}
                >
                  {content.tagline}
                </motion.p>
              </div>
            </div>
          )}

          <div className={`page-content${isProject ? ' page-content--project' : ''}${content.type === 'contact' ? ' page-content--contact' : ''}${content.type === 'about' ? ' page-content--about' : ''}`}>
            {content.type === 'hero'    && <HeroContent    node={node} content={content} />}
            {isProject                  && <ProjectContent node={node} content={content} hasHero={hasHero} onImageClick={onImageClick} onComparisonClick={onComparisonClick} siblings={siblings} onNavigate={onNavigate} />}
            {content.type === 'about'   && <AboutContent   node={node} content={content} />}
            {content.type === 'process' && <ProcessContent node={node} content={content} />}
            {content.type === 'contact' && <ContactContent node={node} content={content} />}
            {content.type === 'craft'   && <CraftContent   node={node} content={content} />}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Project section renderer ───────────────────────────────────────────── */
function BodyText({ text }) {
  if (!text) return null;
  return text.split('\n\n').filter(Boolean).map((p, i) => {
    const lines = p.split('\n');
    const isUnordered = lines.length > 0 && lines.every((line) => /^\s*(?:•|[-*])\s+/.test(line));
    const isOrdered = lines.length > 0 && lines.every((line) => /^\s*\d+[.)]\s+/.test(line));
    if (isUnordered) {
      return (
        <ul key={i} className="section-bullets">
          {lines.map((line, j) => <li key={j}>{line.replace(/^\s*(?:•|[-*])\s+/, '')}</li>)}
        </ul>
      );
    }
    if (isOrdered) {
      return (
        <ol key={i} className="section-numbered">
          {lines.map((line, j) => <li key={j}>{line.replace(/^\s*\d+[.)]\s+/, '')}</li>)}
        </ol>
      );
    }
    return <p key={i} className="section-body">{p}</p>;
  });
}

function ProjectSection({ s, onImageClick, onComparisonClick }) {
  const reduceMotion = useReducedMotion();
  // Scroll-triggered reveal (rather than all-at-once on mount) — plays once,
  // slightly before the section is fully in view so it feels responsive to scroll.
  const mp   = {
    custom: 0,
    variants: fadeUp,
    initial: 'hidden',
    whileInView: 'show',
    viewport: { once: true, margin: '0px 0px -10% 0px', amount: 0.15 },
  };
  const isH2 = s.level === 'h2';
  const cls  = `project-section${isH2 ? ' section--h2' : ''}`;
  const heading = <ProjectSectionHeading section={s} isH2={isH2} />;

  if (s.type === 'design-goal') {
    const goalLabel = sentenceCaseHeading(s.heading || 'Design goal');
    return (
      <motion.section className={`${cls} project-design-goal-card`} {...mp}>
        {isH2
          ? <h2 id={slugify(s.heading || 'Design goal')} className="project-design-goal-eyebrow">{goalLabel}</h2>
          : <h3 className="project-design-goal-eyebrow">{goalLabel}</h3>}
        {s.body && <div className="project-design-goal-copy"><BodyText text={s.body} /></div>}
        {s.src && (
          <ProjectImageWrap id={s.id} src={s.src} caption={s.caption} onImageClick={onImageClick}>
            <img src={asset(s.src)} alt={s.caption || goalLabel} className="section-image" loading="lazy" />
          </ProjectImageWrap>
        )}
        {s.showCaption && s.caption && <p className="section-caption">{s.caption}</p>}
      </motion.section>
    );
  }

  if (s.type === 'message-bubbles') {
    const bubble = {
      hidden: (side) => reduceMotion
        ? { opacity: 1 }
        : { opacity: 0, x: side === 'left' ? '-110%' : '110%', filter: 'blur(5px)' },
      show: {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        transition: { duration: reduceMotion ? 0 : 0.62, ease: [0.32, 0.72, 0, 1] },
      },
    };
    return (
      <motion.section className={`${cls} project-message-bubbles`} {...mp}>
        {heading}
        {s.body && <BodyText text={s.body} />}
        <motion.div
          className="project-message-thread"
          role="list"
        >
          {s.items.map((quote, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            return (
              <motion.div
                className={`project-message-slot project-message-slot--${side}`}
                initial={reduceMotion ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: false, amount: 0.42, margin: '0px 0px -6% 0px' }}
                role="listitem"
                key={quote.id || index}
              >
                <motion.blockquote
                  className={`project-message-bubble project-message-bubble--${side}`}
                  custom={side}
                  variants={bubble}
                >
                  <p>{quote.text}</p>
                </motion.blockquote>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>
    );
  }

  // ── narrative split (copy + local image/Lottie) ─────────────────────────
  if (s.type === 'split') {
    const media = s.mediaType === 'lottie'
      ? <ProjectLottie src={s.src} label={s.caption || s.heading} />
      : (
        <ProjectImageWrap id={s.id} src={s.src} caption={s.caption} onImageClick={onImageClick}>
          <img src={asset(s.src)} alt={s.caption || s.heading || ''} className="section-image" loading="lazy" />
        </ProjectImageWrap>
      );

    return (
      <motion.div className={`${cls} project-split project-split--media-${s.mediaSide === 'left' ? 'left' : 'right'}${s.mediaType === 'lottie' ? ' project-split--lottie' : ''}${s.mediaGroup ? ` project-split--${s.mediaGroup}` : ''}`} {...mp}>
        <div className="project-split-copy">
          {heading}
          {s.body && <BodyText text={s.body} />}
        </div>
        <div className="project-split-media">
          {media}
          {s.showCaption && s.caption && s.mediaType !== 'lottie' && <p className="section-caption">{s.caption}</p>}
        </div>
      </motion.div>
    );
  }

  // ── research / outcome quotes ───────────────────────────────────────────
  if (s.type === 'quotes') {
    return (
      <motion.div className={`${cls} project-quotes`} {...mp}>
        {heading}
        {s.body && <BodyText text={s.body} />}
        <div className={`project-quote-grid project-quote-grid--${s.items.length}`}>
          {s.items.map((quote, index) => (
            <blockquote className="project-quote" key={quote.id || index}>
              <p>{quote.text}</p>
              {quote.attribution && <footer>{quote.attribution}</footer>}
            </blockquote>
          ))}
        </div>
      </motion.div>
    );
  }

  if (s.type === 'insights') {
    return (
      <motion.div className={`${cls} project-insights`} {...mp}>
        {heading}
        {s.body && <BodyText text={s.body} />}
        <div className="project-insight-grid">
          {s.items.map((item, index) => (
            <article className="project-insight" key={item.id || index}>
              {item.value && <strong className="project-insight-value">{item.value}</strong>}
              <h3>{sentenceCaseHeading(item.heading)}</h3>
              <BodyText text={item.body} />
            </article>
          ))}
        </div>
      </motion.div>
    );
  }

  // ── metrics ───────────────────────────────────────────────────────────────
  if (s.type === 'metrics') {
    return (
      <motion.div className={cls} {...mp}>
        {heading}
        <div className={`section-metrics section-metrics--${s.items.length}`}>
          {s.items.map((m) => (
            <div key={m.label} className="metric-item">
              <span className="metric-value">
                <CountUp value={m.value} />
              </span>
              <span className="metric-label">{m.label}</span>
            </div>
          ))}
        </div>
        {s.body && <div className="section-body-after"><BodyText text={s.body} /></div>}
        {s.links?.length > 0 && (
          <div className="project-source-links" aria-label="Media coverage">
            <span className="project-source-links-label">Media coverage</span>
            <div className="project-source-links-list">
              {s.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-source-link"
                >
                  {link.label}<span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // ── single image ──────────────────────────────────────────────────────────
  if (s.type === 'image') {
    return (
      <motion.div className={cls} {...mp}>
        {heading}
        {s.body && <BodyText text={s.body} />}
        <ProjectImageWrap id={s.id} src={s.src} caption={s.caption} onImageClick={onImageClick}>
          <img src={asset(s.src)} alt={s.caption || s.heading || ''} className="section-image" loading="lazy" />
        </ProjectImageWrap>
        {s.showCaption && s.caption && <p className="section-caption">{s.caption}</p>}
      </motion.div>
    );
  }

  // ── gallery (carousel or bento grid) ─────────────────────────────────────
  if (s.type === 'gallery') {
    const count = s.images.length;
    return (
      <motion.div className={cls} {...mp}>
        {heading}
        {s.body && <BodyText text={s.body} />}
        {s.carousel ? (
          <ImageCarousel images={s.images} onImageClick={onImageClick} aspectRatio={s.aspectRatio} showCaption={s.showCaption} />
        ) : (
          <div className={`section-gallery section-gallery--${count <= 2 ? '2up' : count === 3 ? '3up' : '4up'}`}>
            {s.images.map((img) => (
              <ProjectImageWrap key={img.id} id={img.id} src={img.src} caption={img.caption} onImageClick={onImageClick}>
                <img src={asset(img.src)} alt={img.caption || ''} title={img.caption} className="section-gallery-img" loading="lazy" />
              </ProjectImageWrap>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  // ── multi-column cards (heading + body + image each) ─────────────────────
  if (s.type === 'columns') {
    return (
      <motion.div className={cls} {...mp}>
        {heading}
        {s.body && <BodyText text={s.body} />}
        <div className="section-columns">
          {s.items.map((item, i) => (
            <div key={item.id || i} className="section-column">
              {item.heading && <h3 className="section-h3">{sentenceCaseHeading(item.heading)}</h3>}
              {item.body && <BodyText text={item.body} />}
              {item.image && (
                <ProjectImageWrap id={item.id} src={item.image} caption={item.caption} onImageClick={onImageClick}>
                  <img src={asset(item.image)} alt={item.caption || item.heading || ''} className="section-image" loading="lazy" />
                </ProjectImageWrap>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // ── before/after slider ───────────────────────────────────────────────────
  if (s.type === 'comparison') {
    return (
      <motion.div className={cls} {...mp}>
        {heading}
        {s.body && <BodyText text={s.body} />}
        <div className="cs-outer">
          <ComparisonSlider before={s.before} after={s.after} />
          {onComparisonClick && (
            <button
              className="cs-expand-btn"
              onClick={() => onComparisonClick(s.before, s.after)}
              aria-label="Expand comparison"
              title="Expand comparison"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M9 1h4v4M5 13H1V9M13 9v4H9M1 5V1h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
        {s.showCaption && s.caption && <p className="section-caption">{s.caption}</p>}
      </motion.div>
    );
  }

  // ── video embed ────────────────────────────────────────────────────────────
  if (s.type === 'video') {
    return (
      <motion.div className={cls} {...mp}>
        {heading}
        {s.body && <BodyText text={s.body} />}
        <div className="section-video-wrap" style={{ '--video-ratio': s.aspectRatio || '16/9' }}>
          <iframe
            src={s.src}
            className="section-video"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={s.heading || 'Video'}
            loading="lazy"
          />
        </div>
        {s.showCaption && s.caption && <p className="section-caption">{s.caption}</p>}
      </motion.div>
    );
  }

  // ── default: heading + body text ──────────────────────────────────────────
  return (
    <motion.div className={cls} {...mp}>
      {heading}
      {s.body && <BodyText text={s.body} />}
      {s.link && (
        <a href={s.link.url} target="_blank" rel="noopener noreferrer" className="section-link-btn">
          {s.link.label || 'View Live Site'} <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </motion.div>
  );
}

/* ─── Prev/next project navigation ───────────────────────────────────────── */
function ProjectNavCard({ project, direction, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const previewImg = project.content?.heroImage || project.image;

  return (
    <div
      className={`pnav-card pnav-card--${direction}`}
      onClick={() => onNavigate(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate(project); } }}
      aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} project: ${project.label}`}
    >
      {previewImg && (
        <div className={`pnav-preview${hovered ? ' pnav-preview--visible' : ''}`} aria-hidden="true">
          <img src={asset(previewImg)} alt="" className="pnav-preview-img" loading="lazy" />
        </div>
      )}
      <span className="pnav-direction">
        {direction === 'prev' && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M7 2L3 6l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        <span>{direction === 'prev' ? 'Previous' : 'Next'}</span>
        {direction === 'next' && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span className="pnav-label">{project.label}</span>
    </div>
  );
}

function ProjectNav({ node, siblings, onNavigate }) {
  if (!siblings || siblings.length < 2 || !onNavigate) return null;
  const idx  = siblings.findIndex(s => s.id === node.id);
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length];
  const next = siblings[(idx + 1) % siblings.length];

  return (
    <motion.div
      className="project-nav"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.34, ease: [0.32, 0.72, 0, 1] }}
    >
      <ProjectNavCard project={prev} direction="prev" onNavigate={onNavigate} />
      <ProjectNavCard project={next} direction="next" onNavigate={onNavigate} />
    </motion.div>
  );
}

/* ─── Project page ────────────────────────────────────────────────────────── */
function ProjectContent({ node, content, hasHero, onImageClick, onComparisonClick, siblings, onNavigate }) {
  const metaFields = [
    ['Role',     content.role],
    ['Timeline', content.timeline],
    ['Team',     content.team],
    ...(content.tools ? [['Tools', content.tools]] : []),
  ];

  const h2Sections = (content.sections || []).filter(
    (s) => s.level === 'h2' && s.heading,
  );
  return (
    <div className="project-content">
      {!hasHero && (
        <motion.div className="project-header" custom={0} variants={fadeUp} initial="hidden" animate="show">
          <span className="project-year">{content.year}</span>
          <h1>{sentenceCaseHeading(node.label)}</h1>
          <p className="project-tagline">{content.tagline}</p>
        </motion.div>
      )}

      <motion.div className="project-meta" custom={hasHero ? 0 : 1} variants={fadeUp} initial="hidden" animate="show">
        {metaFields.map(([l, v]) => (
          <div key={l} className="meta-item">
            <span className="meta-label">{l}</span>
            <span className="meta-value">{v}</span>
          </div>
        ))}
      </motion.div>

      {content.overview && (
        <motion.p className="project-overview" custom={hasHero ? 1 : 2} variants={fadeUp} initial="hidden" animate="show">
          {content.overview}
        </motion.p>
      )}

      <div className="project-body-layout">
        <div className="project-sections">
          {content.sections.map((s, i) => (
            <ProjectSection key={i} s={s} onImageClick={onImageClick} onComparisonClick={onComparisonClick} />
          ))}
        </div>
        {/* Desktop: sticky right sidebar in whitespace */}
        <OnThisPage h2s={h2Sections} />
      </div>

      {/* Mobile: sticky bottom selector pill */}
      <OnThisPageMobile h2s={h2Sections} />

      <ProjectNav node={node} siblings={siblings} onNavigate={onNavigate} />
    </div>
  );
}

/* ─── Other page types ────────────────────────────────────────────────────── */
function HeroContent({ node, content }) {
  return (
    <div className="hero-content">
      <motion.h1 custom={0} variants={fadeUp} initial="hidden" animate="show">{sentenceCaseHeading(node.label)}</motion.h1>
      <motion.p className="hero-role" custom={1} variants={fadeUp} initial="hidden" animate="show">
        {content.role} — {content.location}
      </motion.p>
      <motion.p className="hero-bio" custom={2} variants={fadeUp} initial="hidden" animate="show">{content.bio}</motion.p>
      <motion.div className="tag-row" custom={3} variants={fadeUp} initial="hidden" animate="show">
        {content.tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </motion.div>
    </div>
  );
}

function AboutContent({ node, content }) {
  return <ResumeGlobe node={node} content={content} />;
}

function ProcessContent({ content }) {
  return (
    <div className="process-content">
      <motion.h1 custom={0} variants={fadeUp} initial="hidden" animate="show">Process</motion.h1>
      {content.steps.map((step, i) => (
        <motion.div key={step.number} className="process-step" custom={i + 1} variants={fadeUp} initial="hidden" animate="show">
          <span className="step-number">{step.number}</span>
          <div><h3>{sentenceCaseHeading(step.label)}</h3><p>{step.body}</p></div>
        </motion.div>
      ))}
    </div>
  );
}

function ContactContent({ content }) {
  const [form, setForm]   = useState({ name: '', email: '', topic: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sent

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Portfolio] ${form.topic || 'Message'} from ${form.name}`);
    const body    = encodeURIComponent(
      `Hi Chengchang,\n\nName: ${form.name}\nEmail: ${form.email}\nRe: ${form.topic}\n\n${form.message}`
    );
    window.open(`mailto:${content.email}?subject=${subject}&body=${body}`, '_blank');
    setStatus('sent');
  };

  return (
    <div className="contact-content">

      {/* ── Left ── */}
      <motion.div className="contact-left" custom={0} variants={fadeUp} initial="hidden" animate="show">
        <span className="contact-eyebrow">Get in touch</span>
        <h1 className="contact-heading">Let's build<br />something great.</h1>
        <p className="contact-desc">
          I'm a product designer based in the San Francisco Bay Area, currently at ServiceNow.
          Whether you have a role, a project, or just want to connect — I'd love to hear from you.
        </p>

        <ul className="contact-bullets">
          <li>Open to full-time product design roles</li>
          <li>Selected freelance &amp; consulting projects</li>
          <li>Design mentorship and collaboration</li>
        </ul>

        <div className="contact-direct">
          <a href={`mailto:${content.email}`} className="contact-direct-item">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M1 4.5l6.5 4.5L14 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {content.email}
          </a>
          <a href={content.linkedin} target="_blank" rel="noreferrer" className="contact-direct-item">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M4 6v5M4 4v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7.5 11V8.5c0-1.38.5-2.5 2-2.5s2 1.12 2 2.5V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 6v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </motion.div>

      {/* ── Right — form ── */}
      <motion.div className="contact-right" custom={1} variants={fadeUp} initial="hidden" animate="show">
        {status === 'sent' ? (
          <div className="contact-sent">
            <span className="contact-sent-icon">✓</span>
            <p className="contact-sent-title">Message sent</p>
            <p className="contact-sent-sub">Your email client should have opened. I'll reply within 24–48h.</p>
            <button className="contact-sent-reset" onClick={() => { setForm({ name:'', email:'', topic:'', message:'' }); setStatus('idle'); }}>
              Send another
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="cf-name">Name</label>
              <input id="cf-name" type="text" required placeholder="Your name" value={form.name} onChange={set('name')} />
            </div>
            <div className="contact-field">
              <label htmlFor="cf-email">Email</label>
              <input id="cf-email" type="email" required placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>
            <div className="contact-field">
              <label htmlFor="cf-topic">I'm reaching out about</label>
              <select id="cf-topic" value={form.topic} onChange={set('topic')}>
                <option value="">Select a topic</option>
                <option value="Full-time opportunity">Full-time opportunity</option>
                <option value="Freelance project">Freelance project</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Just saying hi">Just saying hi</option>
              </select>
            </div>
            <div className="contact-field">
              <label htmlFor="cf-msg">Message</label>
              <textarea id="cf-msg" required rows={7} placeholder="Tell me about your project or opportunity…" value={form.message} onChange={set('message')} />
            </div>
            <button type="submit" className="contact-submit">
              Send message
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        )}
      </motion.div>

    </div>
  );
}

function CraftContent({ content }) {
  return (
    <div className="craft-content">
      <motion.div className="craft-image-wrap" custom={0} variants={fadeUp} initial="hidden" animate="show">
        <img src={asset(content.image)} alt={content.title} className="craft-image" />
      </motion.div>
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
        <span className="craft-subtitle">{content.subtitle}</span>
        <h1>{sentenceCaseHeading(content.title)}</h1>
        <p className="craft-description">{content.description}</p>
      </motion.div>
      {content.works && (
        <motion.div className="craft-works" custom={2} variants={fadeUp} initial="hidden" animate="show">
          {content.works.map((w) => <span key={w} className="craft-work-tag">{w}</span>)}
        </motion.div>
      )}
    </div>
  );
}
