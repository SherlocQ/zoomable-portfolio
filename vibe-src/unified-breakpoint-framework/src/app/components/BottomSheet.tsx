import React, { useState } from 'react';
import { Layout } from 'lucide-react';
import { Button } from './ui/button';

interface Layout {
  id: string;
  name: string;
  thumbnail: React.ReactNode;
}

interface BottomSheetProps {
  selectedLayout: string;
  onLayoutChange: (layoutId: string) => void;
}

// Layout thumbnail components
const DashboardThumbnail = () => (
  <div className="w-full h-full bg-gray-100 rounded border border-gray-200 p-2">
    <div className="h-full flex flex-col gap-1">
      {/* Header */}
      <div className="h-2 bg-blue-900 rounded-sm"></div>
      <div className="h-2 bg-white border border-gray-200 rounded-sm"></div>
      
      {/* Content area with cards */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-sm p-1">
        <div className="grid grid-cols-3 gap-1 h-full">
          {/* Column 1 */}
          <div className="flex flex-col gap-1">
            <div className="h-6 bg-white rounded-sm border border-gray-200"></div>
            <div className="h-4 bg-white rounded-sm border border-gray-200"></div>
          </div>
          {/* Column 2 */}
          <div className="flex flex-col gap-1">
            <div className="h-3 bg-white rounded-sm border border-gray-200"></div>
            <div className="h-4 bg-white rounded-sm border border-gray-200"></div>
            <div className="h-3 bg-white rounded-sm border border-gray-200"></div>
          </div>
          {/* Column 3 */}
          <div className="flex flex-col gap-1">
            <div className="h-4 bg-white rounded-sm border border-gray-200"></div>
            <div className="h-3 bg-white rounded-sm border border-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TwoColumnThumbnail = () => (
  <div className="w-full h-full bg-gray-100 rounded border border-gray-200 p-2">
    <div className="h-full flex flex-col gap-1">
      {/* Header */}
      <div className="h-2 bg-blue-900 rounded-sm"></div>
      
      {/* Content area - White background to match simplified layout */}
      <div className="flex-1 bg-white rounded-sm p-1">
        <div className="grid grid-cols-2 gap-1 h-full">
          {/* Column 1 - Dashed border container with diagonal pattern */}
          <div className="relative border border-dashed border-gray-400 rounded-sm overflow-hidden">
            {/* Diagonal pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="thumbnail-pattern-2col-1" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M-1 5 5-1M-1 1 1-1M3 5 5 3" stroke="#6b7280" strokeWidth="0.5"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#thumbnail-pattern-2col-1)"></rect>
            </svg>
          </div>
          {/* Column 2 - Dashed border container with diagonal pattern */}
          <div className="relative border border-dashed border-gray-400 rounded-sm overflow-hidden">
            {/* Diagonal pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="thumbnail-pattern-2col-2" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M-1 5 5-1M-1 1 1-1M3 5 5 3" stroke="#6b7280" strokeWidth="0.5"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#thumbnail-pattern-2col-2)"></rect>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="h-2 bg-white border-t border-gray-200 rounded-sm"></div>
    </div>
  </div>
);

const ThreeColumnThumbnail = () => (
  <div className="w-full h-full bg-gray-100 rounded border border-gray-200 p-2">
    <div className="h-full flex flex-col gap-1">
      {/* Header */}
      <div className="h-2 bg-blue-900 rounded-sm"></div>
      
      {/* Content area - White background to match simplified layout */}
      <div className="flex-1 bg-white rounded-sm p-1">
        <div className="grid grid-cols-3 gap-1 h-full">
          {/* Column 1 - Dashed border container with diagonal pattern */}
          <div className="relative border border-dashed border-gray-400 rounded-sm overflow-hidden">
            {/* Diagonal pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="thumbnail-pattern-3col-1" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M-1 5 5-1M-1 1 1-1M3 5 5 3" stroke="#6b7280" strokeWidth="0.5"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#thumbnail-pattern-3col-1)"></rect>
            </svg>
          </div>
          {/* Column 2 - Dashed border container with diagonal pattern */}
          <div className="relative border border-dashed border-gray-400 rounded-sm overflow-hidden">
            {/* Diagonal pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="thumbnail-pattern-3col-2" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M-1 5 5-1M-1 1 1-1M3 5 5 3" stroke="#6b7280" strokeWidth="0.5"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#thumbnail-pattern-3col-2)"></rect>
            </svg>
          </div>
          {/* Column 3 - Dashed border container with diagonal pattern */}
          <div className="relative border border-dashed border-gray-400 rounded-sm overflow-hidden">
            {/* Diagonal pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="thumbnail-pattern-3col-3" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M-1 5 5-1M-1 1 1-1M3 5 5 3" stroke="#6b7280" strokeWidth="0.5"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#thumbnail-pattern-3col-3)"></rect>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="h-2 bg-white border-t border-gray-200 rounded-sm"></div>
    </div>
  </div>
);

const layouts: Layout[] = [
  {
    id: 'dashboard',
    name: 'Dashboard Layout',
    thumbnail: <DashboardThumbnail />
  },
  {
    id: 'two-column',
    name: '2 Column Layout',
    thumbnail: <TwoColumnThumbnail />
  },
  {
    id: 'three-column',
    name: '3 Column Layout',
    thumbnail: <ThreeColumnThumbnail />
  }
];

export function BottomSheet({ selectedLayout, onLayoutChange }: BottomSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLayoutSelect = (layoutId: string) => {
    onLayoutChange(layoutId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button - Center aligned, stays connected to bottom sheet */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className={`fixed left-1/2 transform -translate-x-1/2 z-[80] transition-all duration-300 flex items-center gap-2 rounded-t-md rounded-b-none ${
          isOpen 
            ? 'bottom-[280px]' // Position above the open sheet
            : 'bottom-0' // Position at bottom edge
        }`}
        aria-label="Select a layout"
      >
        <Layout className="w-4 h-4" />
        Select a layout
      </Button>

      {/* Bottom Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 z-[75] bg-white border-t border-gray-200 shadow-2xl transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`} style={{ height: '280px' }}>
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Close Button - Top Right */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Layout Grid - Show all 3 layouts */}
          <div className="flex justify-center">
            <div className="flex space-x-6">
              {layouts.map((layout) => {
                const isSelected = layout.id === selectedLayout;
                
                return (
                  <button
                    key={layout.id}
                    onClick={() => handleLayoutSelect(layout.id)}
                    className={`group relative flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-32 h-24 mb-3 relative">
                      {layout.thumbnail}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className={`text-sm font-medium text-center ${
                      isSelected ? 'text-primary' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {layout.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[70] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}