import React, { useState, useEffect, useRef } from 'react';
import { Ruler } from './components/Ruler';
import { ResizableContainer } from './components/ResizableContainer';
import { ProductLayout } from './components/ProductLayout';
import { Controls } from './components/Controls';
import { GridOverlay } from './components/GridOverlay';
import { SpacingInspector } from './components/SpacingInspector';
import { BottomSheet } from './components/BottomSheet';

export default function App() {
  const [width, setWidth] = useState(1440);
  const [showGrid, setShowGrid] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState(0);
  const [targetCanvasOffset, setTargetCanvasOffset] = useState(0); // For smooth transitions
  const [isHoveringLeftEdge, setIsHoveringLeftEdge] = useState(false);
  const [isHoveringRightEdge, setIsHoveringRightEdge] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('dashboard');
  const canvasRef = useRef<HTMLDivElement>(null);
  const maxWidth = 1920;
  const canvasHeight = 810; // Fixed canvas height

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
    const containerPadding = 64; // 8 * 8 = 64px (p-8 padding)
    const availableWidth = viewportWidth - containerPadding;
    const offset = Math.max(0, (availableWidth - newWidth) / 2) + 32; // 32px is half the container padding
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

  // Exact measurements with no gaps
  const headerHeight = 80; // Exact content height with internal padding only
  const controlsHeight = 52; // Exact content height with internal padding only  
  const rulerHeight = 24; // h-6 = 24px exact
  const totalFixedHeight = headerHeight + controlsHeight + rulerHeight;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header - On top of everything */}
      <div className="fixed top-0 left-0 right-0 z-[70] bg-white" style={{ height: `${headerHeight}px` }}>
        <div className="px-4 h-full flex items-center">
          <div className="mx-auto w-full" style={{ maxWidth: '1440px' }}>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1 leading-tight">Product Layout Inspector</h1>
            <p className="text-base font-normal text-gray-500 leading-relaxed">
              Test your layouts across different breakpoints. Drag the edges to resize, use presets, or enter a custom width. Hover over elements to inspect spacing.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Controls - On top of everything */}
      <div 
        className="fixed left-0 right-0 z-[70] bg-white"
        style={{ 
          top: `${headerHeight}px`,
          height: `${controlsHeight}px`
        }}
      >
        <div className="px-4 h-full flex items-center">
          <div className="mx-auto w-full" style={{ maxWidth: '1440px' }}>
            <Controls
              width={width}
              onWidthChange={handleWidthChange}
              showGrid={showGrid}
              onGridToggle={setShowGrid}
            />
          </div>
        </div>
      </div>

      {/* Fixed Ruler - On top of grid but below controls */}
      <div 
        className="fixed left-0 right-0 z-[60]"
        style={{ 
          top: `${headerHeight + controlsHeight}px`,
          height: `${rulerHeight}px`
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
          <div className="flex justify-center p-8 bg-gray-100" style={{ height: `calc(100vh - ${totalFixedHeight}px)` }}>
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