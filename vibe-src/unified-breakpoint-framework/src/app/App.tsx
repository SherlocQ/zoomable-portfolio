import React, { useState, useEffect, useRef } from 'react';
import { Ruler } from './components/Ruler';
import { ResizableContainer } from './components/ResizableContainer';
import { ProductLayout } from './components/ProductLayout';
import { Controls } from './components/Controls';
import { GridOverlay } from './components/GridOverlay';
import { SpacingInspector } from './components/SpacingInspector';
import { BottomSheet } from './components/BottomSheet';

// Side padding around the canvas: 16px on phones, 32px from 640px up.
const canvasPadding = () => (window.innerWidth < 640 ? 16 : 32);
// Open (and reset) at the default 1440 when it fits, otherwise at the widest
// width that fits the viewport, so the whole canvas is visible on arrival.
const fitWidth = () => Math.max(320, Math.min(1440, window.innerWidth - canvasPadding() * 2));

// Progressive blur at a scroll edge. Masked backdrop blurs are the usual
// technique, but Chromium drops `mask-image` on `backdrop-filter` inside an
// iframe (this page is embedded in one), which blurs the whole strip and
// leaves a hard seam. So: nested boxes anchored to the outer edge, each
// starting a little further out, no masks. Stacked backdrop blurs compound
// (each blurs what's beneath it), so the radius in each layer is chosen to
// make the combined blur climb evenly to 4px. A faint eased fade to the
// canvas backdrop (gray-100) lets content dissolve at the very edge.
const EDGE_BLUR_TOTALS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
const EDGE_BLUR_LAYERS = EDGE_BLUR_TOTALS.map((t, i) =>
  Math.sqrt(t * t - (i ? EDGE_BLUR_TOTALS[i - 1] ** 2 : 0)),
);

function EdgeBlur({ side, visible }: { side: 'left' | 'right'; visible: boolean }) {
  const to = side === 'left' ? 'to left' : 'to right';
  const n = EDGE_BLUR_LAYERS.length;
  const width = window.innerWidth < 640 ? 48 : 72;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 bottom-0 z-[45] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ [side]: 0, width }}
    >
      {EDGE_BLUR_LAYERS.map((blur, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0"
          style={{
            [side]: 0,
            width: `${(100 * (n - i)) / n}%`,
            backdropFilter: `blur(${blur.toFixed(2)}px)`,
            WebkitBackdropFilter: `blur(${blur.toFixed(2)}px)`,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${to}, rgb(243 244 246 / 0) 0%, rgb(243 244 246 / 0.08) 40%, rgb(243 244 246 / 0.3) 70%, rgb(243 244 246 / 0.7) 100%)`,
        }}
      />
    </div>
  );
}

export default function App() {
  const [width, setWidth] = useState(fitWidth);
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight);
  const [topHeight, setTopHeight] = useState(132);
  const topRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState(0);
  const [targetCanvasOffset, setTargetCanvasOffset] = useState(0); // For smooth transitions
  const [isHoveringLeftEdge, setIsHoveringLeftEdge] = useState(false);
  const [isHoveringRightEdge, setIsHoveringRightEdge] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('dashboard');
  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Wider-than-viewport widths scroll horizontally at 100%: which edges have
  // more canvas, and which slice of it is on screen.
  const [edges, setEdges] = useState({ left: false, right: false });
  const [visibleRange, setVisibleRange] = useState<{ start: number; end: number } | null>(null);
  const maxWidth = 1920;

  // The header wraps on narrow screens, so its height is measured, not fixed.
  useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTopHeight(el.offsetHeight));
    ro.observe(el);
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => { ro.disconnect(); window.removeEventListener('resize', onResize); };
  }, []);

  // Keeps the ruler, edge fades and visible-range readout in step with the
  // canvas's horizontal scroll. Runs on scroll, resize and width changes.
  const syncScroll = () => {
    const scroller = scrollerRef.current;
    const canvas = canvasRef.current;
    if (!scroller || !canvas) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    setEdges({ left: scroller.scrollLeft > 1, right: scroller.scrollLeft < max - 1 });
    const s = scroller.getBoundingClientRect();
    const c = canvas.getBoundingClientRect();
    const start = Math.max(0, Math.round(s.left - c.left));
    const end = Math.min(c.width, Math.round(s.right - c.left));
    setVisibleRange(end - start < c.width - 1 ? { start, end } : null);
    if (!isTransitioning) {
      setCanvasOffset(c.left);
      setTargetCanvasOffset(c.left);
    }
  };

  useEffect(() => {
    const id = requestAnimationFrame(syncScroll);
    window.addEventListener('resize', syncScroll);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', syncScroll); };
  }, [width, isTransitioning]);

  // Function to calculate canvas offset
  const calculateCanvasOffset = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      return rect.left;
    }
    return 0;
  };

  // Calculate target offset based on width and viewport
  const calculateTargetOffset = (newWidth: number) => {
    const viewportWidth = window.innerWidth;
    const pad = canvasPadding();
    const availableWidth = viewportWidth - pad * 2;
    const offset = Math.max(0, (availableWidth - newWidth) / 2) + pad;
    return offset;
  };

  // Update canvas offset when width changes during non-animated operations
  useEffect(() => {
    if (!isTransitioning && !isDragging) {
      const newOffset = calculateCanvasOffset();
      if (newOffset !== canvasOffset) {
        setCanvasOffset(newOffset);
        setTargetCanvasOffset(newOffset);
      }
    }
  }, [width, isTransitioning, isDragging]);

  // Update canvas offset during manual dragging
  useEffect(() => {
    if (isDragging && !isTransitioning) {
      const newOffset = calculateCanvasOffset();
      setCanvasOffset(newOffset);
      setTargetCanvasOffset(newOffset);
    }
  }, [width, isDragging, isTransitioning]);

  const handleWidthChange = (newWidth: number, animated: boolean = false) => {
    const finalWidth = Math.min(Math.max(newWidth, 320), maxWidth);
    
    if (animated && !isDragging) {
      // A preset / reset starts from the canvas's left edge, not mid-scroll.
      if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
      setIsTransitioning(true);
      
      // Calculate target offset for smooth animation
      const targetOffset = calculateTargetOffset(finalWidth);
      setTargetCanvasOffset(targetOffset);
      
      // Update width immediately for canvas animation
      setWidth(finalWidth);
      
      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        // Update actual offset to match target after transition
        const actualOffset = calculateCanvasOffset();
        setCanvasOffset(actualOffset);
        setTargetCanvasOffset(actualOffset);
      }, 350); // Slightly longer than transition duration
    } else {
      setWidth(finalWidth);
      
      // Immediate offset update for non-animated changes
      if (!isTransitioning) {
        setTimeout(() => {
          const newOffset = calculateCanvasOffset();
          setCanvasOffset(newOffset);
          setTargetCanvasOffset(newOffset);
        }, 0);
      }
    }
  };

  const handleOffsetChange = (offset: number) => {
    setCanvasOffset(offset);
    setTargetCanvasOffset(offset);
  };

  const handleLayoutChange = (layoutId: string) => {
    setSelectedLayout(layoutId);
  };

  // Enhanced cleanup function for drag end
  const cleanupDragState = () => {
    setIsDragging(false);
    // Force reset hover states after a small delay to ensure proper cleanup
    setTimeout(() => {
      setIsHoveringLeftEdge(false);
      setIsHoveringRightEdge(false);
    }, 50);
  };

  const rulerHeight = 24; // h-6 = 24px exact
  const totalFixedHeight = topHeight + rulerHeight;
  // The canvas fills the space under the ruler (less its padding).
  const canvasHeight = Math.max(360, viewportHeight - totalFixedHeight - canvasPadding() * 2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed header + controls - On top of everything. Natural height (it
          wraps on narrow screens), measured into topHeight. */}
      <div ref={topRef} className="fixed top-0 left-0 right-0 z-[70] bg-white border-b border-gray-200">
        <div className="px-4 sm:px-8 pt-5 pb-4 sm:pt-6">
          <div className="mx-auto w-full" style={{ maxWidth: '1440px' }}>
            {/* Only the title block needs to clear the host's close button. On
                phones the description hides: the Lightbox caption covers it. */}
            <div className="pr-12 mb-3 sm:mb-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 sm:mb-1.5 leading-tight">Product Layout Inspector</h1>
              <p className="hidden sm:block text-base font-normal text-gray-500 leading-relaxed">
                Test your layouts across different breakpoints. Pick a breakpoint, drag the edges, or enter a custom width. Hover or tap an element to inspect spacing.
              </p>
            </div>
            <Controls
              width={width}
              onWidthChange={handleWidthChange}
              showGrid={showGrid}
              onGridToggle={setShowGrid}
              visibleRange={visibleRange}
            />
          </div>
        </div>
      </div>

      {/* Fixed Ruler - On top of grid but below controls */}
      <div 
        className="fixed left-0 right-0 z-[60]"
        style={{ 
          top: `${topHeight}px`,
          height: `${rulerHeight}px`,
          overflowX: 'clip', // the ruler scrolls with the canvas; never widens the page
        }}
      >
        <Ruler 
          width={width} 
          canvasOffset={isTransitioning ? targetCanvasOffset : canvasOffset}
          onWidthChange={handleWidthChange}
          isTransitioning={isTransitioning}
        />
      </div>

      {/* Main Content - Positioned exactly at ruler bottom with no gap */}
      <div style={{ paddingTop: `${totalFixedHeight}px` }}>
        {/* Resizable Layout Container with Fixed Canvas Height */}
        <div className="relative bg-gray-100">
          {/* Edge blur: more canvas off-screen on that side. */}
          <EdgeBlur side="left" visible={edges.left} />
          <EdgeBlur side="right" visible={edges.right} />
          {/* "safe center": centered when the canvas fits, scrollable from its
              left edge when it is wider than the viewport. */}
          <div
            ref={scrollerRef}
            onScroll={syncScroll}
            className="flex p-4 sm:p-8 bg-gray-100 overflow-x-auto"
            style={{ height: `calc(100vh - ${totalFixedHeight}px)`, justifyContent: 'safe center' }}
          >
            <div 
              className="relative group"
              style={{ height: `${canvasHeight}px` }}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              ref={canvasRef}
            >
              {/* Main Canvas Container with Fixed Height and Smooth Transitions */}
              <div
                className={`border border-gray-300 bg-white shadow-lg relative overflow-hidden ${
                  isTransitioning && !isDragging ? 'canvas-transition' : 'canvas-transition-disabled'
                }`}
                style={{ 
                  width: `${width}px`, 
                  height: `${canvasHeight}px`
                }}
              >
                {/* Scrollable Content Area */}
                <div className="h-full overflow-y-auto relative">
                  <SpacingInspector width={width}>
                    <ProductLayout 
                      width={width} 
                      canvasOffset={isTransitioning ? targetCanvasOffset : canvasOffset}
                      layoutType={selectedLayout}
                    />
                  </SpacingInspector>
                </div>

                {/* Grid Overlay - On top of canvas content only */}
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none z-[55]">
                    <GridOverlay width={width} />
                  </div>
                )}
              </div>

              {/* Chrome-style drag handles on edges - Enhanced with hover zones */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-40 hover:opacity-100 transition-opacity duration-200" />
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500 opacity-40 hover:opacity-100 transition-opacity duration-200" />
              
              {/* Chrome DevTools-style drag handles - Centered in overlay areas - Moved outward by 3px */}
              <div className={`absolute left-[-15px] top-1/2 -translate-y-1/2 rounded px-1 py-2 pointer-events-none transition-all duration-200 w-3 ${
                isHoveringLeftEdge && !isDragging 
                  ? 'bg-blue-500/20 border border-blue-500' 
                  : isDragging
                  ? 'bg-blue-500/30 border border-blue-500'
                  : 'bg-gray-200'
              }`} style={{ height: '80px' }}>
                {/* Empty div - no vertical lines */}
              </div>
              <div className={`absolute right-[-15px] top-1/2 -translate-y-1/2 rounded px-1 py-2 pointer-events-none transition-all duration-200 w-3 ${
                isHoveringRightEdge && !isDragging 
                  ? 'bg-blue-500/20 border border-blue-500' 
                  : isDragging
                  ? 'bg-blue-500/30 border border-blue-500'
                  : 'bg-gray-200'
              }`} style={{ height: '80px' }}>
                {/* Empty div - no vertical lines */}
              </div>

              {/* Enhanced Right Resize Handle - Starts from edge and expands outward */}
              <div
                className={`absolute top-0 bottom-0 cursor-ew-resize transition-all duration-200 z-40 ${
                  isHoveringRightEdge || isDragging 
                    ? 'right-0 w-6 bg-blue-500/20 border-r-2 border-blue-500 translate-x-full' 
                    : 'right-0 w-4 bg-transparent'
                }`}
                onMouseEnter={() => !isDragging && setIsHoveringRightEdge(true)}
                onMouseLeave={() => !isDragging && setIsHoveringRightEdge(false)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                  setIsTransitioning(false); // Disable transitions during manual drag
                  const startX = e.clientX;
                  const startWidth = width;

                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaX = e.clientX - startX;
                    const newWidth = Math.min(Math.max(startWidth + deltaX, 320), maxWidth);
                    setWidth(newWidth);
                  };

                  const handleMouseUp = () => {
                    cleanupDragState();
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
              
              {/* Enhanced Left Resize Handle - Starts from edge and expands outward */}
              <div
                className={`absolute top-0 bottom-0 cursor-ew-resize transition-all duration-200 z-40 ${
                  isHoveringLeftEdge || isDragging 
                    ? 'left-0 w-6 bg-blue-500/20 border-l-2 border-blue-500 -translate-x-full' 
                    : 'left-0 w-4 bg-transparent'
                }`}
                onMouseEnter={() => !isDragging && setIsHoveringLeftEdge(true)}
                onMouseLeave={() => !isDragging && setIsHoveringLeftEdge(false)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                  setIsTransitioning(false); // Disable transitions during manual drag
                  const startX = e.clientX;
                  const startWidth = width;

                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaX = startX - e.clientX;
                    const newWidth = Math.min(Math.max(startWidth + deltaX, 320), maxWidth);
                    setWidth(newWidth);
                  };

                  const handleMouseUp = () => {
                    cleanupDragState();
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />

              {/* Hover Zone Extensions for Better UX */}
              <div
                className="absolute right-[-20px] top-0 bottom-0 w-8 bg-transparent cursor-ew-resize z-30"
                onMouseEnter={() => !isDragging && setIsHoveringRightEdge(true)}
                onMouseLeave={() => !isDragging && setIsHoveringRightEdge(false)}
              />
              <div
                className="absolute left-[-20px] top-0 bottom-0 w-8 bg-transparent cursor-ew-resize z-30"
                onMouseEnter={() => !isDragging && setIsHoveringLeftEdge(true)}
                onMouseLeave={() => !isDragging && setIsHoveringLeftEdge(false)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <BottomSheet 
        selectedLayout={selectedLayout}
        onLayoutChange={handleLayoutChange}
      />
    </div>
  );
}