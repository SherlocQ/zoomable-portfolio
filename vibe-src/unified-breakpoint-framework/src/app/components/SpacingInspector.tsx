import React, { useState, useRef, useEffect } from 'react';

interface SpacingInspectorProps {
  width: number;
  children: React.ReactNode;
}

interface InspectionData {
  element: string;
  margin: number;
  gutter: number;
  x: number;
  y: number;
  elementWidth: number;
  elementHeight: number;
}

const getLayoutConfig = (width: number) => {
  // Updated specification: XS:16px, SM:24px, MD:32px, XL:40px, XXL:48px
  if (width >= 1680) {
    return { gutter: 48, margin: 48, breakpoint: 'XXL' };
  } else if (width >= 1366) {
    return { gutter: 40, margin: 40, breakpoint: 'XL' };
  } else if (width >= 768) {
    return { gutter: 32, margin: 32, breakpoint: 'MD' };
  } else if (width >= 576) {
    return { gutter: 24, margin: 24, breakpoint: 'SM' };
  } else {
    return { gutter: 16, margin: 16, breakpoint: 'XS' };
  }
};

export function SpacingInspector({ width, children }: SpacingInspectorProps) {
  const [inspectionData, setInspectionData] = useState<InspectionData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const config = getLayoutConfig(width);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleElementHover = (elementType: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      setInspectionData({
        element: elementType,
        margin: config.margin,
        gutter: config.gutter,
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        elementWidth: rect.width,
        elementHeight: rect.height,
      });
    }
  };

  const handleMouseLeave = () => {
    setInspectionData(null);
  };

  return (
    <div ref={containerRef} className="relative" onMouseLeave={handleMouseLeave}>
      {/* Clone children and add hover handlers */}
      <div className="relative">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onMouseEnter: (e: React.MouseEvent) => {
                const elementType = (e.currentTarget as HTMLElement).dataset.inspectType || 'Element';
                handleElementHover(elementType, e);
              },
            });
          }
          return child;
        })}
      </div>

      {/* Spacing Overlay */}
      {inspectionData && (
        <>
          {/* Margin indicators */}
          <div
            className="absolute border-2 border-orange-400 bg-orange-100/30 pointer-events-none"
            style={{
              left: 0,
              top: inspectionData.y,
              width: inspectionData.margin,
              height: inspectionData.elementHeight,
            }}
          />
          <div
            className="absolute border-2 border-orange-400 bg-orange-100/30 pointer-events-none"
            style={{
              right: 0,
              top: inspectionData.y,
              width: inspectionData.margin,
              height: inspectionData.elementHeight,
            }}
          />

          {/* Element highlight */}
          <div
            className="absolute border-2 border-blue-400 bg-blue-100/20 pointer-events-none"
            style={{
              left: inspectionData.x,
              top: inspectionData.y,
              width: inspectionData.elementWidth,
              height: inspectionData.elementHeight,
            }}
          />

          {/* Inspection tooltip - follows mouse */}
          <div
            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-mono pointer-events-none z-50 shadow-lg"
            style={{
              left: mousePosition.x - (containerRef.current?.getBoundingClientRect().left || 0) + 10,
              top: mousePosition.y - (containerRef.current?.getBoundingClientRect().top || 0) - 10,
            }}
          >
            <div className="space-y-1">
              <div className="font-medium text-blue-300">{inspectionData.element}</div>
              <div className="text-orange-300">Margin: {inspectionData.margin}px</div>
              <div className="text-green-300">Gutter: {inspectionData.gutter}px</div>
              <div className="text-gray-300">
                {inspectionData.elementWidth} × {inspectionData.elementHeight}
              </div>
              <div className="text-purple-300 text-xs">
                Breakpoint: {config.breakpoint}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}