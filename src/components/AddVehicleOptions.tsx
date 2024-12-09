import React, { useState } from 'react';
import { Camera, FileSpreadsheet, Plus, Loader2 } from 'lucide-react';
import { VinScanner } from './VinScanner';
import { BulkUpload } from './BulkUpload';
import { Vehicle } from '../types/inventory';
import { decodeVIN } from '../services/vinDecoder';
import { toast } from 'react-hot-toast';

interface AddVehicleOptionsProps {
  onVehicleData: (data: Partial<Vehicle>) => void;
  onBulkUpload: (vehicles: Partial<Vehicle>[]) => void;
  onManualAdd: () => void;
}

export function AddVehicleOptions({ onVehicleData, onBulkUpload, onManualAdd }: AddVehicleOptionsProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [vinInput, setVinInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVinSubmit = async () => {
    if (vinInput.length !== 17) {
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    setIsLoading(true);
    try {
      const vehicleData = await decodeVIN(vinInput);
      if (!vehicleData.make || !vehicleData.model) {
        throw new Error('Invalid VIN or vehicle not found');
      }
      onVehicleData(vehicleData);
      toast.success('Vehicle information retrieved successfully');
    } catch (error) {
      toast.error('Failed to decode VIN. Please try again or enter details manually');
      console.error('Error decoding VIN:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            value={vinInput}
            onChange={(e) => setVinInput(e.target.value.toUpperCase())}
            placeholder="Enter VIN manually"
            className="w-full pl-4 pr-24 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            maxLength={17}
            disabled={isLoading}
          />
          <button
            onClick={handleVinSubmit}
            disabled={vinInput.length !== 17 || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md disabled:bg-gray-400 transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading
              </>
            ) : (
              'Lookup'
            )}
          </button>
        </div>

        <button
          onClick={() => setShowScanner(true)}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Camera className="w-5 h-5" />
          Scan VIN
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-white text-sm text-gray-500">Or</span>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={() => setShowBulkUpload(true)}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Bulk Upload from CSV/Excel
        </button>

        <button
          onClick={onManualAdd}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle Manually
        </button>
      </div>

      {showScanner && (
        <VinScanner
          onVinDetected={async (vin) => {
            setIsLoading(true);
            try {
              const vehicleData = await decodeVIN(vin);
              if (!vehicleData.make || !vehicleData.model) {
                throw new Error('Invalid VIN or vehicle not found');
              }
              onVehicleData(vehicleData);
              toast.success('Vehicle information retrieved successfully');
            } catch (error) {
              toast.error('Failed to decode VIN. Please try again or enter details manually');
              console.error('Error decoding VIN:', error);
            } finally {
              setIsLoading(false);
              setShowScanner(false);
            }
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showBulkUpload && (
        <BulkUpload
          onUpload={(vehicles) => {
            onBulkUpload(vehicles);
            toast.success(`Successfully processed ${vehicles.length} vehicles`);
          }}
          onClose={() => setShowBulkUpload(false)}
        />
      )}
    </div>
  );
}