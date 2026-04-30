import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { T, fadeUp, SPRING_SLOW } from '../transitions';

const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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

  return (
    <div className="cs-wrap" ref={wrapRef} role="application" aria-label={`Before/after comparison: ${before.label} vs ${after.label}`}>
      <img src={after.src}  alt={after.label}  className="cs-img" />
      <img src={before.src} alt={before.label} className="cs-img cs-img--over"
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

/* ─── Image carousel ─────────────────────────────────────────────────────── */
function ImageCarousel({ images, onImageClick, aspectRatio }) {
  const [idx, setIdx] = useState(0);
  const count = images.length;
  const img   = images[idx];
  const go    = useCallback((n) => setIdx(((n % count) + count) % count), [count]);
  const ratio = aspectRatio || '4/3';

  return (
    <div className="img-carousel">
      {/* Fixed-ratio stage — images positioned absolute to fill it */}
      <div className="img-carousel-stage" style={{ '--carousel-ratio': ratio }}>
        <AnimatePresence initial={false}>
          <motion.img
            key={img.src}
            src={img.src}
            alt={img.caption || ''}
            className="img-carousel-img"
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            /* onClick on the img itself prevents misclick via arrow buttons */
            onClick={onImageClick && img.id
              ? () => onImageClick(img.id, img.src, img.caption, images, idx)
              : undefined}
            style={{ cursor: onImageClick && img.id ? 'zoom-in' : 'default' }}
          />
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              className="img-carousel-arrow img-carousel-arrow--prev"
              onClick={() => go(idx - 1)}
              aria-label="Previous image"
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="img-carousel-arrow img-carousel-arrow--next"
              onClick={() => go(idx + 1)}
              aria-label="Next image"
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {img.caption && <p className="section-caption">{img.caption}</p>}
      {count > 1 && (
        <div className="img-carousel-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === idx ? ' carousel-dot--active' : ''}`}
              onClick={() => go(i)}
              aria-label={`Image ${i + 1}`}
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
    const obs = new IntersectionObserver(
      (entries) => {
        // Ignore intermediate sections while a click-triggered scroll is in flight
        if (isProgrammaticScroll.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
      },
      { root: container, rootMargin: '-8% 0px -55% 0px', threshold: 0 },
    );
    h2s.forEach((s) => {
      const el = document.getElementById(slugify(s.heading));
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
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
      <span className="otp-heading">On this page</span>
      <ul>
        {h2s.map((s) => (
          <li key={s.heading}>
            <button
              className={`otp-link${active === slugify(s.heading) ? ' otp-link--active' : ''}`}
              onClick={() => scrollTo(s.heading)}
            >
              {s.heading}
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

  const activeLabel = h2s.find((s) => slugify(s.heading) === active)?.heading
    ?? h2s[0].heading;

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
              {s.heading}
            </button>
          ))}
        </div>
        <button className="otp-mobile-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="listbox">
          <span className="otp-mobile-prefix">On this page</span>
          <span className="otp-mobile-label">{activeLabel}</span>
          <svg
            className={`otp-mobile-chevron${open ? ' otp-mobile-chevron--up' : ''}`}
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
export default function PageView({ node, onBack, onImageClick, onComparisonClick, isLightbox, zIndex }) {
  const { content } = node;
  const tone            = node.tone || 'base';
  const isImagePage     = content.type === 'image';
  const isComparisonPage = content.type === 'comparison';
  const isProject       = content.type === 'project';
  const hasHero     = isProject && Boolean(content.heroImage);

  // Lightbox carousel state — only meaningful when node.lbImages is set
  const lbImages = node.lbImages || null;
  const lbCount  = lbImages?.length ?? 0;
  const [lbIdx, setLbIdx] = useState(node.lbIdx ?? 0);
  const lbGo = useCallback(
    (n) => setLbIdx(((n % lbCount) + lbCount) % lbCount),
    [lbCount],
  );
  const activeSrc     = lbImages ? lbImages[lbIdx].src     : content.src;
  const activeCaption = lbImages ? lbImages[lbIdx].caption : content.caption;

  const motionShell = isLightbox
    ? { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 } }
    : { layoutId: `item-${node.id}` };

  const overlayTone = content.type === 'contact' ? 'base' : (isImagePage || isComparisonPage) ? 'image' : tone;
  const shellClass = [
    'overlay-shell page-overlay',
    `card-${overlayTone}`,
    hasHero                         ? 'page-overlay--hero'     : '',
    isLightbox                      ? 'page-overlay--lightbox' : '',
    (isImagePage || isComparisonPage) ? 'page-overlay--img'    : '',
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={shellClass}
      style={{ zIndex }}
      {...motionShell}
      exit={{ opacity: 0, scale: 0.97, transition: T }}
      transition={isLightbox ? SPRING_SLOW : T}
    >
      {/* Drag handle — only on non-hero, non-lightbox, non-image pages */}
      {!hasHero && !isLightbox && !isImagePage && (
        <button className="page-handle" onClick={onBack} aria-label="Close">
          <span />
        </button>
      )}

      {/* Dismiss button — on lightbox and all image pages */}
      {(isLightbox || isImagePage) && (
        <button className="lightbox-dismiss" onClick={onBack} aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="11" y1="1" x2="1"  y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {isComparisonPage ? (
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
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeSrc}
                  src={activeSrc}
                  alt={activeCaption || ''}
                  className="img-page-img"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.20 }}
                />
              </AnimatePresence>
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
              <button className="lb-nav lb-nav--prev" onClick={() => lbGo(lbIdx - 1)} aria-label="Previous image">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="lb-nav lb-nav--next" onClick={() => lbGo(lbIdx + 1)} aria-label="Next image">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
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
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="page-body">
          {hasHero && (
            <div className="project-hero-section">
              <img src={content.heroImage} alt={node.label} className="project-hero-img" />
              <div className="project-hero-meta">
                <motion.h1 className="project-hero-title" custom={0} variants={fadeUp} initial="hidden" animate="show">
                  {node.label}
                </motion.h1>
                <motion.p className="project-hero-tagline" custom={1} variants={fadeUp} initial="hidden" animate="show">
                  {content.tagline}
                </motion.p>
              </div>
              <div className="project-hero-scroll-hint" aria-hidden="true"><span /></div>
            </div>
          )}

          <div className={`page-content${isProject ? ' page-content--project' : ''}${content.type === 'contact' ? ' page-content--contact' : ''}`}>
            {content.type === 'hero'    && <HeroContent    node={node} content={content} />}
            {isProject                  && <ProjectContent node={node} content={content} hasHero={hasHero} onImageClick={onImageClick} onComparisonClick={onComparisonClick} />}
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
    if (lines.length > 1 && lines.every(l => l.trimStart().startsWith('•'))) {
      return (
        <ul key={i} className="section-bullets">
          {lines.map((l, j) => <li key={j}>{l.replace(/^\s*•\s*/, '')}</li>)}
        </ul>
      );
    }
    return <p key={i} className="section-body">{p}</p>;
  });
}

function ProjectSection({ s, index, onImageClick, onComparisonClick }) {
  const mp   = { custom: 4 + index, variants: fadeUp, initial: 'hidden', animate: 'show' };
  const isH2 = s.level === 'h2';
  const cls  = `project-section${isH2 ? ' section--h2' : ''}`;

  const Heading = () => {
    if (!s.heading) return null;
    return isH2
      ? <h2 id={slugify(s.heading)} className="section-h2">{s.heading}</h2>
      : <h3 className="section-h3">{s.heading}</h3>;
  };

  const ImgWrap = ({ id, src, caption, children }) => (
    <motion.div
      className={`section-img-wrap${onImageClick ? ' section-img-wrap--clickable' : ''}`}
      layoutId={id ? `item-img-${id}` : undefined}
      role={id && onImageClick ? 'button' : undefined}
      tabIndex={id && onImageClick ? 0 : undefined}
      aria-label={id && onImageClick ? (caption || 'View image') : undefined}
      onClick={id && onImageClick ? () => onImageClick(id, src, caption) : undefined}
      onKeyDown={id && onImageClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onImageClick(id, src, caption); } } : undefined}
      whileHover={id && onImageClick ? { scale: 1.01, transition: { duration: 0.15 } } : {}}
    >
      {children}
    </motion.div>
  );

  // ── metrics ───────────────────────────────────────────────────────────────
  if (s.type === 'metrics') {
    return (
      <motion.div className={cls} {...mp}>
        <Heading />
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
        {s.body && <p className="section-body-after">{s.body}</p>}
      </motion.div>
    );
  }

  // ── single image ──────────────────────────────────────────────────────────
  if (s.type === 'image') {
    return (
      <motion.div className={cls} {...mp}>
        <Heading />
        {s.body && <BodyText text={s.body} />}
        <ImgWrap id={s.id} src={s.src} caption={s.caption}>
          <img src={s.src} alt={s.caption || s.heading || ''} className="section-image" loading="lazy" />
        </ImgWrap>
        {s.caption && <p className="section-caption">{s.caption}</p>}
      </motion.div>
    );
  }

  // ── gallery (carousel or bento grid) ─────────────────────────────────────
  if (s.type === 'gallery') {
    const count = s.images.length;
    return (
      <motion.div className={cls} {...mp}>
        <Heading />
        {s.body && <BodyText text={s.body} />}
        {s.carousel ? (
          <ImageCarousel images={s.images} onImageClick={onImageClick} aspectRatio={s.aspectRatio} />
        ) : (
          <div className={`section-gallery section-gallery--${count <= 2 ? '2up' : count === 3 ? '3up' : '4up'}`}>
            {s.images.map((img) => (
              <ImgWrap key={img.id} id={img.id} src={img.src} caption={img.caption}>
                <img src={img.src} alt={img.caption || ''} title={img.caption} className="section-gallery-img" loading="lazy" />
              </ImgWrap>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  // ── before/after slider ───────────────────────────────────────────────────
  if (s.type === 'comparison') {
    return (
      <motion.div className={cls} {...mp}>
        <Heading />
        {s.body && <BodyText text={s.body} />}
        <div className="cs-outer">
          <ComparisonSlider before={s.before} after={s.after} />
          {onComparisonClick && (
            <button
              className="cs-expand-btn"
              onClick={() => onComparisonClick(s.before, s.after)}
              aria-label="Expand comparison"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M9 1h4v4M5 13H1V9M13 9v4H9M1 5V1h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
        {s.caption && <p className="section-caption">{s.caption}</p>}
      </motion.div>
    );
  }

  // ── video embed ────────────────────────────────────────────────────────────
  if (s.type === 'video') {
    return (
      <motion.div className={cls} {...mp}>
        <Heading />
        {s.body && <BodyText text={s.body} />}
        <div className="section-video-wrap">
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
        {s.caption && <p className="section-caption">{s.caption}</p>}
      </motion.div>
    );
  }

  // ── default: heading + body text ──────────────────────────────────────────
  return (
    <motion.div className={cls} {...mp}>
      <Heading />
      {s.body && <BodyText text={s.body} />}
      {s.link && (
        <a href={s.link.url} target="_blank" rel="noopener noreferrer" className="section-link-btn">
          {s.link.label || 'View Live Site'} ↗
        </a>
      )}
    </motion.div>
  );
}

/* ─── Project page ────────────────────────────────────────────────────────── */
function ProjectContent({ node, content, hasHero, onImageClick, onComparisonClick }) {
  const metaFields = [
    ['Role',     content.role],
    ['Timeline', content.timeline],
    ['Team',     content.team],
    ...(content.tools ? [['Tools', content.tools]] : []),
  ];

  const h2Sections = (content.sections || []).filter(
    (s) => s.level === 'h2' && s.heading,
  );
  const hasOtp = h2Sections.length >= 2;

  return (
    <div className={`project-content${hasOtp ? '' : ' project-content--no-otp'}`}>
      {!hasHero && (
        <motion.div className="project-header" custom={0} variants={fadeUp} initial="hidden" animate="show">
          <span className="project-year">{content.year}</span>
          <h1>{node.label}</h1>
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
            <ProjectSection key={i} s={s} index={i} onImageClick={onImageClick} onComparisonClick={onComparisonClick} />
          ))}
        </div>
        {/* Desktop: sticky right sidebar in whitespace */}
        <OnThisPage h2s={h2Sections} />
      </div>

      {/* Mobile: sticky bottom selector pill */}
      <OnThisPageMobile h2s={h2Sections} />
    </div>
  );
}

/* ─── Other page types ────────────────────────────────────────────────────── */
function HeroContent({ node, content }) {
  return (
    <div className="hero-content">
      <motion.h1 custom={0} variants={fadeUp} initial="hidden" animate="show">{node.label}</motion.h1>
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

function TimelineEntry({ exp, index }) {
  return (
    <motion.div
      className="timeline-entry"
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...SPRING_SLOW, delay: index * 0.06 }}
    >
      <div className="timeline-dot" />
      <div className="timeline-body">
        <div className="timeline-header">
          <span className="timeline-company">{exp.company}</span>
          <span className="timeline-period">{exp.period}</span>
        </div>
        <p className="timeline-role">{exp.role} · {exp.location}</p>
        <p className="timeline-desc">{exp.description}</p>
      </div>
    </motion.div>
  );
}

function AboutContent({ node, content }) {
  return (
    <div className="about-content">
      {/* Bio */}
      <motion.div className="about-intro" custom={0} variants={fadeUp} initial="hidden" animate="show">
        <h1>{content.name}</h1>
        <p className="about-role-line">{content.role} · {content.location}</p>
      </motion.div>

      <motion.div className="about-bio" custom={1} variants={fadeUp} initial="hidden" animate="show">
        {content.bio.split('\n\n').filter(Boolean).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </motion.div>

      {/* Resume download */}
      <motion.a
        href={content.resumeUrl}
        download
        className="about-resume-btn"
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path d="M6.5 1v8M3 6.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 11h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Download Résumé
      </motion.a>

      {/* Experience timeline */}
      <motion.div className="about-section-head" custom={3} variants={fadeUp} initial="hidden" animate="show">
        <span className="about-section-label">Experience</span>
      </motion.div>

      <div className="timeline-track">
        <div className="timeline-line" aria-hidden="true" />
        {content.experience.map((exp, i) => (
          <TimelineEntry key={exp.id} exp={exp} index={i} />
        ))}
      </div>

      {/* Education */}
      <motion.div
        className="about-section-head"
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={SPRING_SLOW}
      >
        <span className="about-section-label">Education</span>
      </motion.div>

      <div className="timeline-track timeline-track--edu">
        <div className="timeline-line" aria-hidden="true" />
        {content.education.map((edu, i) => (
          <motion.div
            key={i}
            className="timeline-entry"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ ...SPRING_SLOW, delay: i * 0.07 }}
          >
            <div className="timeline-dot" />
            <div className="timeline-body">
              <div className="timeline-header">
                <span className="timeline-company">{edu.school}</span>
                <span className="timeline-period">{edu.period}</span>
              </div>
              <p className="timeline-role">{edu.degree}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProcessContent({ node, content }) {
  return (
    <div className="process-content">
      <motion.h1 custom={0} variants={fadeUp} initial="hidden" animate="show">Process</motion.h1>
      {content.steps.map((step, i) => (
        <motion.div key={step.number} className="process-step" custom={i + 1} variants={fadeUp} initial="hidden" animate="show">
          <span className="step-number">{step.number}</span>
          <div><h3>{step.label}</h3><p>{step.body}</p></div>
        </motion.div>
      ))}
    </div>
  );
}

function ContactContent({ node, content }) {
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
          I'm a product designer based in the San Francisco Bay Area, currently at LinkedIn.
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

function CraftContent({ node, content }) {
  return (
    <div className="craft-content">
      <motion.div className="craft-image-wrap" custom={0} variants={fadeUp} initial="hidden" animate="show">
        <img src={content.image} alt={content.title} className="craft-image" />
      </motion.div>
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
        <span className="craft-subtitle">{content.subtitle}</span>
        <h1>{content.title}</h1>
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
