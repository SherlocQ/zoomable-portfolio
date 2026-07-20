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
}

const presetWidths = [
  { name: 'XS - Mobile', value: 320 },
  { name: 'SM - Mobile Large', value: 576 },
  { name: 'MD - Tablet', value: 768 },
  { name: 'LG - Desktop', value: 1024 },
  { name: 'LG-EXT - Large Extended', value: 1280 },
  { name: 'XL-EXT - Extra Large Extended', value: 1440 },
  { name: 'XXL - Ultra Wide', value: 1680 },
];

const breakpoints = [
  { name: 'XS', value: 320 },
  { name: 'SM', value: 576 },
  { name: 'MD', value: 768 },
  { name: 'LG', value: 1024 },
  { name: 'LG-EXT', value: 1280 },
  { name: 'XL-EXT', value: 1440 },
  { name: 'XXL', value: 1680 },
];

export function Controls({ width, onWidthChange, showGrid, onGridToggle }: ControlsProps) {
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

  const handlePresetChange = (value: string) => {
    const newWidth = parseInt(value);
    onWidthChange(newWidth, true); // Enable animation for preset changes
  };

  const handleResetClick = () => {
    onWidthChange(1440, true); // Enable animation for reset
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => onGridToggle(!showGrid)}
          variant={showGrid ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2"
        >
          <Layout className="w-4 h-4" />
          Product layout
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Preset:</span>
          <Select value={width.toString()} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select width" />
            </SelectTrigger>
            <SelectContent>
              {presetWidths.map((preset) => (
                <SelectItem key={preset.value} value={preset.value.toString()}>
                  {preset.name} ({preset.value}px)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Breakpoint Info */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-900">{currentBreakpoint.name}</span>
          <span className="text-gray-500">({currentBreakpoint.value}px+)</span>
        </div>

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