import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import GridView       from './components/GridView';
import GridOverlay    from './components/GridOverlay';
import PageView       from './components/PageView';
import AppHeader      from './components/AppHeader';
import NotFoundPage   from './components/NotFoundPage';
import { portfolioData, getNodeByPath, getBreadcrumbs } from './data/portfolio';
import './App.css';

const BASE = import.meta.env.BASE_URL; // '/zoomable-portfolio/' in prod, '/' in dev
const BASE_STRIPPED = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE; // '/zoomable-portfolio'

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
  const [skipTransition, setSkipTransition] = useState(false);

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
      setPath(e.state?.path ?? urlToPath());
      setLightbox(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = useCallback((item) => {
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
    setLightbox(null);
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
    if (lightboxNode) { setLightbox(null); }
    else              { window.history.back(); }
  }, [lightboxNode]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') navigateBack(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navigateBack]);

  const openLightbox = useCallback((id, src, caption, images, imgIdx) => {
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
                />
              );
            })}

            {lightboxNode && (
              <PageView
                key={lightboxNode.id}
                node={lightboxNode}
                onBack={navigateBack}
                isLightbox
                zIndex={topZ}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </main>
    </div>
  );
}
