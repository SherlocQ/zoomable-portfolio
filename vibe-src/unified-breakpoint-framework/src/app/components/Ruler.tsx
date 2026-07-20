import React, { useRef, useEffect, useState } from 'react';

interface RulerProps {
  width: number;
  canvasOffset: number; // Distance from left edge of viewport to canvas
  onWidthChange?: (width: number, animated?: boolean) => void; // Updated to support animation
  isTransitioning?: boolean; // New prop to control transitions
}

// Updated presets to match the new spacing system including XXL
const presetWidths = [
  { name: 'XS', value: 320 },
  { name: 'SM', value: 576 },
  { name: 'MD', value: 768 },
  { name: 'LG', value: 1024 },
  { name: 'LG-EXT', value: 1280 },
  { name: 'XL-EXT', value: 1440 },
  { name: 'XXL', value: 1680 },
];

export function Ruler({ width, canvasOffset, onWidthChange, isTransitioning = false }: RulerProps) {
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  // Always ensure ruler extends to at least include all presets and viewport
  const maxPresetValue = Math.max(...presetWidths.map(p => p.value));
  const minRulerWidth = Math.max(maxPresetValue + 200, 1920); // Add buffer beyond max preset
  const calculatedRulerWidth = viewportWidth > 0 ? viewportWidth - canvasOffset : minRulerWidth;
  const rulerWidth = Math.max(calculatedRulerWidth, minRulerWidth);

  // Generate tick marks every 10px with major marks every 100px
  const generateTicks = () => {
    const ticksMap = new Map();
    const maxTick = Math.max(rulerWidth, minRulerWidth);
    
    // Generate regular ticks every 10px
    for (let i = 0; i <= maxTick; i += 10) {
      const isMajor = i % 100 === 0;
      const isMinor = i % 50 === 0 && !isMajor;
      const isPreset = presetWidths.some(preset => preset.value === i);
      const presetInfo = presetWidths.find(preset => preset.value === i);
      
      ticksMap.set(i, {
        position: i,
        value: i,
        isMajor,
        isMinor,
        isPreset,
        presetInfo,
      });
    }
    
    // Ensure all preset values are included (even if they don't fall on 10px boundaries)
    presetWidths.forEach(preset => {
      if (!ticksMap.has(preset.value)) {
        ticksMap.set(preset.value, {
          position: preset.value,
          value: preset.value,
          isMajor: false,
          isMinor: false,
          isPreset: true,
          presetInfo: preset,
        });
      } else {
        // Update existing tick to mark it as preset
        const existingTick = ticksMap.get(preset.value);
        ticksMap.set(preset.value, {
          ...existingTick,
          isPreset: true,
          presetInfo: preset,
        });
      }
    });
    
    // Convert map to array and sort by position
    return Array.from(ticksMap.values()).sort((a, b) => a.position - b.position);
  };

  const ticks = generateTicks();

  const handlePresetClick = (presetValue: number) => {
    if (onWidthChange) {
      onWidthChange(presetValue, true); // Enable animation for ruler clicks
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Main Ruler */}
      <div 
        className={`relative h-6 bg-gray-600 overflow-visible ${
          isTransitioning ? 'ruler-offset-transition' : 'ruler-offset-transition-disabled'
        }`}
        style={{ 
          marginLeft: canvasOffset,
          width: rulerWidth
        }}
      >
        {/* Canvas width highlight range - similar to Figma's blue range with smooth transitions */}
        <div
          className={`absolute top-0 bottom-0 bg-blue-500 bg-opacity-40 ${
            isTransitioning ? 'ruler-highlight-transition' : 'ruler-highlight-transition-disabled'
          }`}
          style={{
            left: 0,
            width: width,
          }}
        />

        {/* Tick marks - always show preset markers */}
        {ticks.map((tick) => {
          // Always show preset markers, show regular ticks only within visible ruler width
          const shouldShow = tick.isPreset || tick.position <= Math.min(rulerWidth, viewportWidth - canvasOffset);
          if (!shouldShow) return null;
          
          const isActive = width === tick.value && tick.isPreset;
          
          // Determine tick height and color - presets always get full height
          let tickClass = '';
          if (tick.isPreset) {
            tickClass = isActive 
              ? 'border-orange-400 h-4' 
              : 'border-gray-100 group-hover:border-orange-300 h-4';
          } else if (tick.isMajor) {
            tickClass = 'border-gray-200 h-4';
          } else if (tick.isMinor) {
            tickClass = 'border-gray-300 h-3';
          } else {
            tickClass = 'border-gray-400 h-2';
          }
          
          return (
            <div
              key={tick.value}
              className={`absolute bottom-0 ${tick.isPreset ? 'group cursor-pointer z-10' : ''}`}
              style={{ left: tick.position }}
              onClick={tick.isPreset ? () => handlePresetClick(tick.value) : undefined}
            >
              {/* Clickable area for preset ticks - no hover background */}
              {tick.isPreset && (
                <div 
                  className="absolute -left-4 -right-4 -top-6 -bottom-6 transition-colors rounded"
                  title={`Click to set width to ${tick.value}px (${tick.presetInfo?.name})`}
                />
              )}
              
              {/* Tick mark line */}
              <div
                className={`border-l ${tickClass} transition-colors`}
                style={{ width: '0.5px' }}
              />
              
              {/* Preset label below the tick mark */}
              {tick.isPreset && (
                <div 
                  className={`absolute top-4 -translate-x-1/2 text-xs px-1.5 py-0.5 rounded border transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-orange-100 bg-orange-600 border-orange-500 shadow-md'
                      : 'text-orange-200 bg-gray-700 border-orange-400 group-hover:bg-orange-600 group-hover:text-orange-100 group-hover:border-orange-500 group-hover:shadow-md'
                  }`}
                  style={{ fontSize: '9px', lineHeight: '1.2' }}
                >
                  {tick.presetInfo?.name}
                </div>
              )}
              
              {/* Value tooltip on hover for presets - vertically centered in ruler */}
              {tick.isPreset && (
                <div 
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white bg-gray-900 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20"
                  style={{ fontSize: '10px' }}
                >
                  {tick.value}px
                </div>
              )}
            </div>
          );
        })}

        {/* Numbers for major ticks (but not for presets since they have their own labels) */}
        {ticks
          .filter(tick => tick.isMajor && tick.position <= Math.min(rulerWidth, viewportWidth - canvasOffset) && !tick.isPreset)
          .map((tick) => (
            <div
              key={`label-${tick.value}`}
              className="absolute bottom-0 text-xs text-gray-200 leading-none pointer-events-none"
              style={{ 
                left: tick.position,
                transform: 'translateX(-50%)',
                fontSize: '10px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: '400'
              }}
            >
              <div className="pb-0.5">{tick.value}</div>
            </div>
          ))}
        
        {/* Current width end marker - white line at canvas edge with transition */}
        <div
          className={`absolute top-0 bottom-0 w-px bg-white opacity-90 ${
            isTransitioning ? 'ruler-highlight-transition' : 'ruler-highlight-transition-disabled'
          }`}
          style={{ left: width }}
        />

        {/* Current width text indicator - Figma style dark box with smooth positioning */}
        <div
          className={`absolute -top-7 flex items-center justify-center pointer-events-none z-10 ${
            isTransitioning ? 'ruler-highlight-transition' : 'ruler-highlight-transition-disabled'
          }`}
          style={{ 
            left: Math.max(20, Math.min(width - 20, rulerWidth - 40)),
            transform: 'translateX(-50%)'
          }}
        >
          <div 
            className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium shadow-lg border border-gray-700"
            style={{ 
              fontSize: '11px',
              lineHeight: '1.2',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              whiteSpace: 'nowrap'
            }}
          >
            {width}px
          </div>
        </div>

        {/* Zero marker at ruler start (canvas left edge) */}
        <div className="absolute bottom-0 left-0">
          <div className="w-px bg-gray-200 h-4" />
          <div 
            className="absolute bottom-0 text-xs text-gray-200 leading-none"
            style={{ 
              fontSize: '10px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: '400'
            }}
          >
            <div className="pb-0.5">0</div>
          </div>
        </div>
      </div>
    </div>
  );
}