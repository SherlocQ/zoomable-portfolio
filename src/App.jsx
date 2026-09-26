import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import GridView       from './components/GridView';
import GridOverlay    from './components/GridOverlay';
import PageView       from './components/PageView';
import AppHeader      from './components/AppHeader';
import NotFoundPage   from './components/NotFoundPage';
import { portfolioData, getNodeByPath, getBreadcrumbs } from './data/portfolio';
import { LIGHTBOX_CLOSE_MS } from './transitions';
import './App.css';

const BASE = import.meta.env.BASE_URL; // '/zoomable-portfolio/' in prod, '/' in dev
const BASE_STRIPPED = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE; // '/zoomable-portfolio'
const getLightboxCloseDuration = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : LIGHTBOX_CLOSE_MS;
const clearLightboxReturnSources = () => {
  document.querySelectorAll('.lightbox-return-source').forEach((element) => {
    element.classList.remove('lightbox-return-source');
  });
};

const pathToUrl = (p) => BASE + (p.length > 0 ? p.join('/') : '');
const urlToPath = () =>
  window.location.pathname
    .slice(BASE_STRIPPED.length)
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean);

const THEME_KEY = 'theme-preference';
const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return getSystemTheme();
};

export default function App() {
  const [path, setPath]           = useState(() => urlToPath());
  const [theme, setTheme]         = useState(getInitialTheme);
  const [lightboxNode, setLightbox] = useState(null);
  const [closingRouteMedia, setClosingRouteMedia] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute('content', theme === 'dark' ? '#010102' : '#ffffff');
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const followSystemTheme = (event) => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(event.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', followSystemTheme);
    return () => media.removeEventListener('change', followSystemTheme);
  }, []);

  // Seed the initial history entry so popstate always has state
  useEffect(() => {
    window.history.replaceState({ path: urlToPath() }, '');
  }, []);

  // Browser back / forward → sync React state
  useEffect(() => {
    const onPopState = (e) => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
      setSkipTransition(false);
      setPath(e.state?.path ?? urlToPath());
      setLightbox(null);
      setClosingRouteMedia(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  }, []);

  const navigateTo = useCallback((item) => {
    clearLightboxReturnSources();
    setSkipTransition(false);
    const next = [...path, item.id];
    setPath(next);
    window.history.pushState({ path: next }, '', pathToUrl(next));
  }, [path]);

  // Replace the last path segment (used for project-to-project navigation)
  const navigateReplace = useCallback((item) => {
    setSkipTransition(true);
    const next = [...path.slice(0, -1), item.id];
    setPath(next);
    window.history.pushState({ path: next }, '', pathToUrl(next));
  }, [path]);

  const navigateToDepth = useCallback((i) => {
    setSkipTransition(false);
    setLightbox(null);
    setClosingRouteMedia(false);
    const next = path.slice(0, i);
    setPath(next);
    window.history.pushState({ path: next }, '', pathToUrl(next));
  }, [path]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const overlayStack = path
    .map((_, i) => ({
      node:   getNodeByPath(portfolioData, path.slice(0, i + 1)),
      zIndex: 10 + i * 5,
    }))
    .filter(({ node }) => node != null); // guard against invalid URLs

  const isNotFound = path.length > 0 && overlayStack.length < path.length;

  // Back: close lightbox first (no URL change), otherwise use browser history
  const navigateBack = useCallback(() => {
    if (closeTimerRef.current) return;

    if (lightboxNode) {
      setLightbox((current) => current ? { ...current, isClosing: true } : current);
      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null;
        setLightbox(null);
      }, getLightboxCloseDuration());
      return;
    }

    const activeNode = getNodeByPath(portfolioData, path);
    const isRouteMedia = activeNode?.content?.type === 'image' || activeNode?.content?.type === 'comparison';
    if (isRouteMedia && !closingRouteMedia) {
      setClosingRouteMedia(true);
      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null;
        window.history.back();
      }, getLightboxCloseDuration());
      return;
    }

    window.history.back();
  }, [closingRouteMedia, lightboxNode, path]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') navigateBack(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navigateBack]);

  const openLightbox = useCallback((id, src, caption, images, imgIdx) => {
    clearLightboxReturnSources();
    setLightbox({
      id:       `img-${id}`,
      sourceId: id,
      type:     'page',
      tone:     'image',
      content:  { type: 'image', src, caption },
      lbImages: images && images.length > 1 ? images : null,
      lbIdx:    imgIdx ?? 0,
    });
  }, []);

  const openComparisonLightbox = useCallback((before, after) => {
    clearLightboxReturnSources();
    const sourceId = before.id || before.src;
    setLightbox({
      id:      `comparison-${sourceId}`,
      sourceId,
      type:    'page',
      tone:    'image',
      content: { type: 'comparison', before, after },
    });
  }, []);

  const topZ = 10 + overlayStack.length * 5 + 5;
  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <AppHeader
        breadcrumbs={getBreadcrumbs(portfolioData, path)}
        onNavigate={navigateToDepth}
        onBack={navigateBack}
        theme={theme}
        onToggleTheme={toggleTheme}
        canGoBack={path.length > 0 || Boolean(lightboxNode)}
        isNotFound={isNotFound}
        onGoHome={() => navigateToDepth(0)}
      />

      <main id="main-content">
        {isNotFound && <NotFoundPage onGoHome={() => navigateToDepth(0)} />}

        <LayoutGroup>
          <GridView node={portfolioData} onItemClick={navigateTo} isHidden={overlayStack.length > 0 || isNotFound} />

          <AnimatePresence>
            {!isNotFound && overlayStack.map(({ node, zIndex }, idx) => {
              const isTop = idx === overlayStack.length - 1;
              if (node.type === 'grid') {
                return <GridOverlay key={node.id} node={node} onItemClick={navigateTo} zIndex={zIndex} isActive={isTop} />;
              }
              const parentNode = idx > 0 ? overlayStack[idx - 1]?.node : null;
              const siblings = parentNode?.type === 'grid'
                ? (parentNode.items?.filter(i => i.type === 'page' && i.content?.type === 'project') ?? null)
                : null;
              return (
                <PageView
                  key={node.id}
                  node={node}
                  onBack={navigateBack}
                  onImageClick={openLightbox}
                  onComparisonClick={openComparisonLightbox}
                  onNavigate={navigateReplace}
                  siblings={siblings}
                  zIndex={zIndex}
                  skipLayoutTransition={isTop && skipTransition}
                  isActive={isTop && !lightboxNode}
                  isClosing={isTop && closingRouteMedia}
                />
              );
            })}

            {lightboxNode && (
              <PageView
                key={lightboxNode.id}
                node={lightboxNode}
                onBack={navigateBack}
                isLightbox
                isClosing={Boolean(lightboxNode.isClosing)}
                zIndex={topZ}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </main>
    </div>
  );
}
