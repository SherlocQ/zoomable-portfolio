import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Layout } from 'lucide-react';

interface ControlsProps {
  width: number;
  onWidthChange: (width: number, animated?: boolean) => void;
  showGrid: boolean;
  onGridToggle: (show: boolean) => void;
  visibleRange?: { start: number; end: number } | null; // set when the canvas overflows
}

const breakpoints = [
  { name: 'XS', value: 320 },
  { name: 'SM', value: 576 },
  { name: 'MD', value: 768 },
  { name: 'LG', value: 1024 },
  { name: 'LG-EXT', value: 1280 },
  { name: 'XL-EXT', value: 1440 },
  { name: 'XXL', value: 1680 },
];

export function Controls({ width, onWidthChange, showGrid, onGridToggle, visibleRange }: ControlsProps) {
  const [inputValue, setInputValue] = useState(width.toString());

  useEffect(() => {
    setInputValue(width.toString());
  }, [width]);

  const getCurrentBreakpoint = () => {
    for (let i = breakpoints.length - 1; i >= 0; i--) {
      if (width >= breakpoints[i].value) {
        return breakpoints[i];
      }
    }
    return breakpoints[0];
  };

  const currentBreakpoint = getCurrentBreakpoint();

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue > 0) {
      onWidthChange(Math.min(Math.max(numValue, 280), 1920), false);
    } else {
      setInputValue(width.toString());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
    if (e.key === 'Escape') {
      setInputValue(width.toString());
    }
  };


  const handleResetClick = () => {
    // Reset to the opening width: 1440, or the widest that fits the viewport.
    const pad = window.innerWidth < 640 ? 16 : 32;
    onWidthChange(Math.max(320, Math.min(1440, window.innerWidth - pad * 2)), true);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <Button
          onClick={() => onGridToggle(!showGrid)}
          variant={showGrid ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2"
        >
          <Layout className="w-4 h-4" />
          Product layout
        </Button>
        {visibleRange && (
          <span className="text-xs text-gray-500 font-mono">
            Showing {visibleRange.start}–{visibleRange.end} of {width}px
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {/* Breakpoint selector — shows the breakpoint the current width falls
            in (custom widths included); picking one jumps to its width. */}
        <Select
          value={currentBreakpoint.value.toString()}
          onValueChange={(value) => onWidthChange(parseInt(value), true)}
        >
          <SelectTrigger size="sm" className="w-auto gap-2" aria-label="Breakpoint">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {breakpoints.map((bp) => (
              <SelectItem key={bp.value} value={bp.value.toString()}>
                <span className="font-medium text-gray-900">{bp.name}</span>
                <span className="text-gray-500">({bp.value}px+)</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Width Input - Chrome DevTools style */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Width:</span>
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="w-20 h-8 text-sm font-mono text-center border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Width"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              px
            </span>
          </div>
        </div>

        <Button
          onClick={handleResetClick}
          variant="outline"
          size="sm"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}