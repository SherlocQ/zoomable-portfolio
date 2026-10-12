import React, { useState, useRef } from 'react';

interface SpacingInspectorProps {
  width: number;
  children: React.ReactNode;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface InspectionData {
  element: string;
  box: Box;
  gaps: Box[]; // gutters between this element and its inspectable siblings
  cursor: { x: number; y: number };
  flipX: boolean; // tooltip goes left of the cursor (near the right edge)
  flipY: boolean; // tooltip goes above the cursor (near the visible bottom)
}

const TOOLTIP_W = 210;
const TOOLTIP_H = 130;

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

// Elements opt in with `data-inspect-type`. Hover is found by delegation from
// the container, so the layout doesn't have to forward any handlers.
export function SpacingInspector({ width, children }: SpacingInspectorProps) {
  const [data, setData] = useState<InspectionData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const config = getLayoutConfig(width);

  // Mouse: follows hover. Touch has no hover, so a tap inspects the tapped
  // element, and tapping outside any element clears it.
  const inspect = (e: React.MouseEvent | React.PointerEvent) => {
    const container = containerRef.current;
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-inspect-type]');
    if (!container || !target || !container.contains(target)) {
      setData(null);
      return;
    }
    const origin = container.getBoundingClientRect();
    const toBox = (r: DOMRect): Box => ({ x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height });
    const box = toBox(target.getBoundingClientRect());

    // Gutters: the space between directly adjacent inspectable siblings, side
    // by side (vertical band) or stacked (horizontal band). An untagged block
    // in between breaks the pair, so page sections never read as a gutter.
    const siblings = Array.from(target.parentElement?.children ?? []);
    const gaps: Box[] = [];
    for (let i = 0; i < siblings.length - 1; i++) {
      if (!siblings[i].hasAttribute('data-inspect-type') || !siblings[i + 1].hasAttribute('data-inspect-type')) continue;
      const a = toBox(siblings[i].getBoundingClientRect());
      const b = toBox(siblings[i + 1].getBoundingClientRect());
      if (b.x >= a.x + a.w) gaps.push({ x: a.x + a.w, y: Math.min(a.y, b.y), w: b.x - (a.x + a.w), h: Math.max(a.h, b.h) });
      else if (b.y >= a.y + a.h) gaps.push({ x: Math.min(a.x, b.x), y: a.y + a.h, w: Math.max(a.w, b.w), h: b.y - (a.y + a.h) });
    }

    // Keep the tooltip inside what's visible: the canvas clips at its right
    // edge and its scroll area at the bottom.
    const view = (container.parentElement ?? container).getBoundingClientRect();
    setData({
      element: target.dataset.inspectType || 'Element',
      box,
      gaps: gaps.filter((g) => g.w > 0 && g.h > 0),
      cursor: { x: e.clientX - origin.left, y: e.clientY - origin.top },
      flipX: e.clientX + 12 + TOOLTIP_W > view.right,
      flipY: e.clientY + 12 + TOOLTIP_H > view.bottom,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => inspect(e);
  // A tap (or click) inspects what's under it.
  const handlePointerUp = (e: React.PointerEvent) => inspect(e);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
      onPointerUp={handlePointerUp}
      onMouseLeave={() => setData(null)}
    >
      {children}

      {data && (
        <>
          {/* Page margins at the hovered element's row */}
          <div
            className="absolute border-2 border-orange-400 bg-orange-100/30 pointer-events-none z-40"
            style={{ left: 0, top: data.box.y, width: config.margin, height: data.box.h }}
          />
          <div
            className="absolute border-2 border-orange-400 bg-orange-100/30 pointer-events-none z-40"
            style={{ right: 0, top: data.box.y, width: config.margin, height: data.box.h }}
          />

          {/* Gutters between sibling columns / stacked blocks */}
          {data.gaps.map((g, i) => (
            <div
              key={i}
              className="absolute border border-green-500 bg-green-200/40 pointer-events-none z-40"
              style={{ left: g.x, top: g.y, width: g.w, height: g.h }}
            />
          ))}

          {/* Element highlight */}
          <div
            className="absolute border-2 border-blue-400 bg-blue-100/20 pointer-events-none z-40"
            style={{ left: data.box.x, top: data.box.y, width: data.box.w, height: data.box.h }}
          />

          {/* Inspection tooltip - follows the cursor */}
          <div
            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-mono pointer-events-none z-50 shadow-lg"
            style={{
              left: data.flipX ? data.cursor.x - 12 : data.cursor.x + 12,
              top: data.flipY ? data.cursor.y - 12 : data.cursor.y + 12,
              transform: `translate(${data.flipX ? '-100%' : '0'}, ${data.flipY ? '-100%' : '0'})`,
            }}
          >
            <div className="space-y-1">
              <div className="font-medium text-blue-300">{data.element}</div>
              <div className="text-orange-300">Margin: {config.margin}px</div>
              <div className="text-green-300">Gutter: {config.gutter}px</div>
              <div className="text-gray-300">
                {Math.round(data.box.w)} × {Math.round(data.box.h)}
              </div>
              <div className="text-purple-300 text-xs">Breakpoint: {config.breakpoint}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
