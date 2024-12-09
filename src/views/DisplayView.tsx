import React, { useEffect } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { SearchFilters } from '../components/SearchFilters';
import { PublicVehicleList } from '../components/PublicVehicleList';
import { AdminLink } from '../components/AdminLink';
import { filterVehicles } from '../utils/filterVehicles';
import { Loader2 } from 'lucide-react';

export default function DisplayView() {
  const { vehicles, filters, setFilters, fetchVehicles, isLoading } = useInventoryStore();
  const filteredVehicles = filterVehicles(vehicles, filters);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Vehicles</h1>
      </div>

      <div className="space-y-6">
        <SearchFilters filters={filters} onFilterChange={setFilters} />
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No vehicles found</p>
          </div>
        ) : (
          <PublicVehicleList vehicles={filteredVehicles} />
        )}
      </div>
      <AdminLink />
    </div>
  );
}