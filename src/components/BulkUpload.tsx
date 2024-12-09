import React, { useRef } from 'react';
import { parse } from 'papaparse';
import { Vehicle } from '../types/inventory';
import { FileUp, AlertCircle } from 'lucide-react';

interface BulkUploadProps {
  onUpload: (vehicles: Partial<Vehicle>[]) => void;
  onClose: () => void;
}

export function BulkUpload({ onUpload, onClose }: BulkUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    parse(file, {
      header: true,
      complete: (results) => {
        const vehicles = results.data.map((row: any) => ({
          make: row.make,
          model: row.model,
          year: parseInt(row.year),
          price: parseFloat(row.price),
          condition: row.condition,
          status: row.status,
          description: row.description,
          specifications: {},
          images: [],
        }));
        onUpload(vehicles);
        onClose();
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Bulk Upload Vehicles</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <FileUp className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV files only</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-400" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">
                  CSV Format Requirements
                </h4>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Required columns:</p>
                  <ul className="list-disc list-inside">
                    <li>make</li>
                    <li>model</li>
                    <li>year</li>
                    <li>price</li>
                    <li>condition (new/used/certified)</li>
                    <li>status (available/sold/pending)</li>
                    <li>description</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Select CSV File
          </button>
        </div>
      </div>
    </div>
  );
}