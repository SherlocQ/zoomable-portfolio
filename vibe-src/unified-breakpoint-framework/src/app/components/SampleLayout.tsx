import React from 'react';

interface SampleLayoutProps {
  width: number;
}

export function SampleLayout({ width }: SampleLayoutProps) {
  return (
    <div className="min-h-96 bg-white p-8">
      <div className="text-center text-gray-500 py-16">
        <div className="text-sm mb-2">Sample Layout</div>
        <div className="text-xs text-gray-400">
          Current width: {width}px
        </div>
        <div className="mt-8 text-xs text-gray-400">
          Replace this with your actual layout content
        </div>
      </div>
    </div>
  );
}