import React, { useState } from 'react';

interface GridOverlayProps {
  width: number;
}

const getGridConfig = (width: number) => {
  // Updated specification: XS:16px, SM:24px, MD:32px, XL:40px, XXL:48px
  // Cap grid at 1680px and center when canvas is wider
  if (width >= 1680) {
    return { gutter: 48, margin: 48, maxWidth: 1680, centered: true };
  } else if (width >= 1366) {
    return { gutter: 40, margin: 40, maxWidth: width, centered: false };
  } else if (width >= 768) {
    return { gutter: 32, margin: 32, maxWidth: width, centered: false };
  } else if (width >= 576) {
    return { gutter: 24, margin: 24, maxWidth: width, centered: false };
  } else {
    return { gutter: 16, margin: 16, maxWidth: width, centered: false };
  }
};

interface SpacingTooltipProps {
  value: number;
  type: 'margin' | 'gutter';
  position: { x: number; y: number };
  show: boolean;
}

function SpacingTooltip({ value, type, position, show }: SpacingTooltipProps) {
  if (!show) return null;
  
  return (
    <div
      className="fixed z-50 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
      style={{
        left: position.x,
        top: position.y - 30,
        transform: 'translateX(-50%)'
      }}
    >
      {type}: {value}px
    </div>
  );
}

export function GridOverlay({ width }: GridOverlayProps) {
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    value: number;
    type: 'margin' | 'gutter';
    position: { x: number; y: number };
  }>({
    show: false,
    value: 0,
    type: 'margin',
    position: { x: 0, y: 0 }
  });

  const config = getGridConfig(width);
  const { gutter, margin, maxWidth, centered } = config;
  
  const contentWidth = maxWidth - (margin * 2);
  const columnWidth = (contentWidth - (gutter * 11)) / 12;

  const handleMouseEnter = (
    event: React.MouseEvent,
    value: number,
    type: 'margin' | 'gutter'
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      value,
      type,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top
      }
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-30" style={{ opacity: 0.4 }}>
        <div 
          className="h-full" 
          style={{ 
            width: maxWidth,
            ...(centered ? { 
              position: 'absolute',
              left: '50%', 
              transform: 'translateX(-50%)'
            } : {})
          }}
        >
          {/* Left margin */}
          <div
            className="absolute top-0 bottom-0 bg-pink-400 border border-pink-500 hover:bg-pink-500 transition-colors cursor-pointer pointer-events-auto"
            style={{
              left: 0,
              width: margin,
            }}
            onMouseEnter={(e) => handleMouseEnter(e, margin, 'margin')}
            onMouseLeave={handleMouseLeave}
          />

          {/* Right margin */}
          <div
            className="absolute top-0 bottom-0 bg-pink-400 border border-pink-500 hover:bg-pink-500 transition-colors cursor-pointer pointer-events-auto"
            style={{
              right: 0,
              width: margin,
            }}
            onMouseEnter={(e) => handleMouseEnter(e, margin, 'margin')}
            onMouseLeave={handleMouseLeave}
          />

          {/* Grid columns and gutters */}
          <div className="h-full relative" style={{ marginLeft: margin, marginRight: margin }}>
            {Array.from({ length: 12 }).map((_, index) => (
              <React.Fragment key={index}>
                {/* Column */}
                <div
                  className="absolute top-0 bottom-0 bg-blue-300 border border-blue-400"
                  style={{
                    left: index * (columnWidth + gutter),
                    width: columnWidth,
                  }}
                >
                  <div className="text-xs text-blue-700 p-1 font-mono font-medium opacity-80">
                    {index + 1}
                  </div>
                </div>

                {/* Gutter (except after last column) */}
                {index < 11 && (
                  <div
                    className="absolute top-0 bottom-0 bg-orange-400 border border-orange-500 hover:bg-orange-500 transition-colors cursor-pointer pointer-events-auto"
                    style={{
                      left: index * (columnWidth + gutter) + columnWidth,
                      width: gutter,
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, gutter, 'gutter')}
                    onMouseLeave={handleMouseLeave}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Spacing Information Panel */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-95 backdrop-blur border border-gray-200 rounded-lg p-3 text-xs font-mono pointer-events-auto z-40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-400 border border-pink-500 rounded"></div>
            <span>Margin: {margin}px</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 border border-orange-500 rounded"></div>
            <span>Gutter: {gutter}px</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-300 border border-blue-400 rounded"></div>
            <span>Column: {Math.round(columnWidth)}px</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 text-gray-600">
          <div>Grid: {maxWidth}px {centered && '(centered)'}</div>
          <div>Content: {Math.round(contentWidth)}px</div>
          {width > 1680 && <div>Canvas: {width}px</div>}
        </div>
      </div>

      <SpacingTooltip
        value={tooltip.value}
        type={tooltip.type}
        position={tooltip.position}
        show={tooltip.show}
      />
    </>
  );
}