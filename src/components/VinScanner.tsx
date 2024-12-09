import React, { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Camera, X } from 'lucide-react';

interface VinScannerProps {
  onVinDetected: (vin: string) => void;
  onClose: () => void;
}

export function VinScanner({ onVinDetected, onClose }: VinScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    async function startScanning() {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          throw new Error('No camera devices found');
        }

        if (videoRef.current) {
          await codeReader.decodeFromVideoDevice(
            undefined,
            videoRef.current,
            (result) => {
              if (result) {
                const vin = result.getText();
                if (vin.length === 17) { // Standard VIN length
                  onVinDetected(vin);
                  onClose();
                }
              }
            }
          );
        }
      } catch (error) {
        setError('Failed to access camera. Please ensure camera permissions are granted.');
      }
    }

    startScanning();

    return () => {
      codeReader.reset();
    };
  }, [onVinDetected, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scan VIN</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {error ? (
          <div className="text-red-600 text-center p-4">{error}</div>
        ) : (
          <>
            <div className="relative aspect-video mb-4">
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Position the VIN barcode within the frame to scan
            </p>
          </>
        )}
      </div>
    </div>
  );
}