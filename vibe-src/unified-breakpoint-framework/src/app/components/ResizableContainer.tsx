import React, { useRef, useEffect, useState } from 'react';
import { Resizable } from 're-resizable';

interface ResizableContainerProps {
  width: number;
  onResize: (width: number) => void;
  onOffsetChange: (offset: number) => void;
  children: React.ReactNode;
  maxWidth: number;
}

const snapPoints = [320, 576, 768, 1024, 1280, 1440, 1680];
const snapThreshold = 20; // pixels

const findNearestSnapPoint = (width: number): number => {
  for (const snapPoint of snapPoints) {
    if (Math.abs(width - snapPoint) <= snapThreshold) {
      return snapPoint;
    }
  }
  return width;
};

// Chrome DevTools-style drag handle component
const DragHandle = ({ isVisible }: { isVisible: boolean }) => (
  <div className={`flex flex-col items-center justify-center gap-px transition-all duration-200 ${
    isVisible ? 'opacity-100' : 'opacity-0'
  }`}>
    {/* Three thin vertical lines */}
    <div className="w-px h-4 bg-gray-600"></div>
    <div className="w-px h-4 bg-gray-600"></div>
    <div className="w-px h-4 bg-gray-600"></div>
  </div>
);

export function ResizableContainer({ width, onResize, onOffsetChange, children, maxWidth }: ResizableContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updateOffset = () => {
      if (wrapperRef.current && typeof wrapperRef.current.getBoundingClientRect === 'function') {
        try {
          const rect = wrapperRef.current.getBoundingClientRect();
          onOffsetChange(rect.left);
        } catch (error) {
          console.warn('Error getting bounding rect:', error);
        }
      }
    };

    // Initial offset calculation with multiple attempts
    const calculateInitialOffset = () => {
      updateOffset();
      
      // Try again after a short delay to ensure DOM is ready
      setTimeout(updateOffset, 10);
      
      // And once more with requestAnimationFrame
      requestAnimationFrame(updateOffset);
    };

    calculateInitialOffset();
    
    window.addEventListener('resize', updateOffset);
    window.addEventListener('scroll', updateOffset);
    
    return () => {
      window.removeEventListener('resize', updateOffset);
      window.removeEventListener('scroll', updateOffset);
    };
  }, [onOffsetChange]);

  // Also update offset when width changes
  useEffect(() => {
    const updateOffset = () => {
      if (wrapperRef.current && typeof wrapperRef.current.getBoundingClientRect === 'function') {
        try {
          const rect = wrapperRef.current.getBoundingClientRect();
          onOffsetChange(rect.left);
        } catch (error) {
          console.warn('Error getting bounding rect:', error);
        }
      }
    };

    // Small delay to allow layout to settle
    const timer = setTimeout(updateOffset, 0);
    return () => clearTimeout(timer);
  }, [width, onOffsetChange]);

  return (
    <div className="flex justify-center p-8 bg-gray-100 min-h-screen" ref={containerRef}>
      <div 
        ref={wrapperRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative group"
      >
        <Resizable
          size={{ width, height: 'auto' }}
          onResizeStart={() => setIsDragging(true)}
          onResize={(e, direction, ref) => {
            const newWidth = parseInt(ref.style.width);
            const snappedWidth = findNearestSnapPoint(newWidth);
            
            // Update the size to the snapped width if different
            if (snappedWidth !== newWidth) {
              ref.style.width = `${snappedWidth}px`;
            }

            // Update offset during resize using wrapper ref
            if (wrapperRef.current && typeof wrapperRef.current.getBoundingClientRect === 'function') {
              try {
                const rect = wrapperRef.current.getBoundingClientRect();
                onOffsetChange(rect.left);
              } catch (error) {
                console.warn('Error getting bounding rect during resize:', error);
              }
            }
          }}
          onResizeStop={(e, direction, ref) => {
            setIsDragging(false);
            const newWidth = parseInt(ref.style.width);
            const snappedWidth = findNearestSnapPoint(newWidth);
            onResize(snappedWidth);
            
            // Final offset update using wrapper ref
            if (wrapperRef.current && typeof wrapperRef.current.getBoundingClientRect === 'function') {
              try {
                const rect = wrapperRef.current.getBoundingClientRect();
                onOffsetChange(rect.left);
              } catch (error) {
                console.warn('Error getting bounding rect on resize stop:', error);
              }
            }
          }}
          minWidth={280}
          maxWidth={maxWidth}
          enable={{
            right: true,
            left: true,
            top: false,
            bottom: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          handleStyles={{
            right: {
              background: 'transparent',
              width: '20px',
              cursor: 'ew-resize',
              borderRadius: '0',
            },
            left: {
              background: 'transparent',
              width: '20px',
              cursor: 'ew-resize',
              borderRadius: '0',
            },
          }}
          className="border border-gray-300 bg-white shadow-lg relative"
        >
          <div className="h-full overflow-hidden relative">
            {children}
          </div>
        </Resizable>

        {/* Chrome-style drag handles on edges */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transition-opacity duration-200 ${
          isHovering || isDragging ? 'opacity-100' : 'opacity-40'
        }`} />
        <div className={`absolute right-0 top-0 bottom-0 w-1 bg-blue-500 transition-opacity duration-200 ${
          isHovering || isDragging ? 'opacity-100' : 'opacity-40'
        }`} />
        
        {/* Chrome DevTools-style drag handles */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-gray-200 rounded px-1 py-2 pointer-events-none">
          <DragHandle isVisible={isHovering || isDragging} />
        </div>
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 bg-gray-200 rounded px-1 py-2 pointer-events-none">
          <DragHandle isVisible={isHovering || isDragging} />
        </div>
        

      </div>
    </div>
  );
}