import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import GridView       from './components/GridView';
import GridOverlay    from './components/GridOverlay';
import PageView       from './components/PageView';
import AppHeader      from './components/AppHeader';
import BackgroundGrid from './components/BackgroundGrid';
import { portfolioData, getNodeByPath, getBreadcrumbs } from './data/portfolio';
import './App.css';

const pathToUrl = (p) => p.length > 0 ? '/' + p.join('/') : '/';
const urlToPath = () =>
  window.location.pathname.replace(/^\//, '').split('/').filter(Boolean);

export default function App() {
  const [path, setPath]           = useState(() => urlToPath());
  const [theme, setTheme]         = useState('dark');
  const [lightboxNode, setLightbox] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Seed the initial history entry so popstate always has state
  useEffect(() => {
    window.history.replaceState({ path: urlToPath() }, '');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    const next = [...path, item.id];
    setPath(next);
    window.history.pushState({ path: next }, '', pathToUrl(next));
  }, [path]);

  const navigateToDepth = useCallback((i) => {
    const next = path.slice(0, i);
    setPath(next);
    window.history.pushState({ path: next }, '', pathToUrl(next));
  }, [path]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  );

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
      type:     'page',
      tone:     'image',
      content:  { type: 'image', src, caption },
      lbImages: images && images.length > 1 ? images : null,
      lbIdx:    imgIdx ?? 0,
    });
  }, []);

  const openComparisonLightbox = useCallback((before, after) => {
    setLightbox({
      id:      `comparison-${before.src}`,
      type:    'page',
      tone:    'image',
      content: { type: 'comparison', before, after },
    });
  }, []);

  const overlayStack = path
    .map((_, i) => ({
      node:   getNodeByPath(portfolioData, path.slice(0, i + 1)),
      zIndex: 10 + i * 5,
    }))
    .filter(({ node }) => node != null); // guard against invalid URLs

  const topZ = 10 + overlayStack.length * 5 + 5;

  return (
    <div className="app">
      <BackgroundGrid theme={theme} />

      <AppHeader
        breadcrumbs={getBreadcrumbs(portfolioData, path)}
        onNavigate={navigateToDepth}
        onBack={navigateBack}
        theme={theme}
        onToggleTheme={toggleTheme}
        canGoBack={path.length > 0 || Boolean(lightboxNode)}
      />

      <LayoutGroup>
        <GridView node={portfolioData} onItemClick={navigateTo} />

        <AnimatePresence>
          {overlayStack.map(({ node, zIndex }) =>
            node.type === 'grid' ? (
              <GridOverlay key={node.id} node={node} onItemClick={navigateTo} zIndex={zIndex} />
            ) : (
              <PageView
                key={node.id}
                node={node}
                onBack={navigateBack}
                onImageClick={openLightbox}
                onComparisonClick={openComparisonLightbox}
                zIndex={zIndex}
              />
            )
          )}

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
    </div>
  );
}
