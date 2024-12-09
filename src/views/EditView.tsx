import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoryStore } from '../store/useInventoryStore';
import { SearchFilters } from '../components/SearchFilters';
import { VehicleList } from '../components/VehicleList';
import { VehicleForm } from '../components/VehicleForm';
import { AddVehicleOptions } from '../components/AddVehicleOptions';
import { Vehicle } from '../types/inventory';
import { Plus } from 'lucide-react';
import { IframeCodeGenerator } from '../components/IframeCodeGenerator';
import { filterVehicles } from '../utils/filterVehicles';

export default function EditView() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddOptionsOpen, setIsAddOptionsOpen] = useState(false);
  const [isCodeGeneratorOpen, setIsCodeGeneratorOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formInitialData, setFormInitialData] = useState<Partial<Vehicle> | undefined>();

  const { vehicles, filters, setFilters, addVehicle, updateVehicle, deleteVehicle } =
    useInventoryStore();

  const filteredVehicles = filterVehicles(vehicles, filters);

  const handleSubmit = (data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, data);
    } else {
      addVehicle(data);
    }
    setIsFormOpen(false);
    setIsAddOptionsOpen(false);
    setEditingVehicle(null);
    setFormInitialData(undefined);
  };

  const handleBulkUpload = (vehicles: Partial<Vehicle>[]) => {
    vehicles.forEach((vehicle) => {
      if (vehicle.make && vehicle.model) {
        addVehicle(vehicle as Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Inventory Management
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => setIsCodeGeneratorOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get Embed Code
            </button>
            <button
              onClick={() => setIsAddOptionsOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Vehicle
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <SearchFilters filters={filters} onFilterChange={setFilters} />

        {isAddOptionsOpen && (
          <AddVehicleOptions
            onVehicleData={(data) => {
              setFormInitialData(data);
              setIsAddOptionsOpen(false);
              setIsFormOpen(true);
            }}
            onBulkUpload={handleBulkUpload}
            onManualAdd={() => {
              setIsAddOptionsOpen(false);
              setIsFormOpen(true);
            }}
          />
        )}

        {isFormOpen && (
          <VehicleForm
            initialData={editingVehicle || formInitialData}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingVehicle(null);
              setFormInitialData(undefined);
            }}
          />
        )}

        {isCodeGeneratorOpen && (
          <IframeCodeGenerator onClose={() => setIsCodeGeneratorOpen(false)} />
        )}

        <VehicleList
          vehicles={filteredVehicles}
          onEdit={(vehicle) => {
            setEditingVehicle(vehicle);
            setIsFormOpen(true);
          }}
          onDelete={deleteVehicle}
        />
      </div>
    </div>
  );
}