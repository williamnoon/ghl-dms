import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';

interface IframeCodeGeneratorProps {
  onClose: () => void;
}

export function IframeCodeGenerator({ onClose }: IframeCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'display' | 'edit'>('display');
  const [height, setHeight] = useState('800');
  const [theme, setTheme] = useState('light');
  const [borderRadius, setBorderRadius] = useState('8');
  const [shadow, setShadow] = useState('md');

  const baseUrl = window.location.origin;
  const iframeCode = `<iframe
  src="${baseUrl}?mode=${mode}&theme=${theme}"
  width="100%"
  height="${height}px"
  style="border: none; border-radius: ${borderRadius}px; box-shadow: ${
    shadow === 'none'
      ? 'none'
      : shadow === 'sm'
      ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      : shadow === 'md'
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  }"
  allow="camera"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Get Embed Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'display' | 'edit')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="display">Display View</option>
              <option value="edit">Edit View</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (px)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius (px)
            </label>
            <input
              type="number"
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shadow
            </label>
            <select
              value={shadow}
              onChange={(e) => setShadow(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Embed Code
            </label>
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
                {iframeCode}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}