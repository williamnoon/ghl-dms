import { useEffect } from 'react';
import { useVehicleStore } from './useVehicleStore';
import { filterVehicles } from '../utils/filterVehicles';

export function useVehicles() {
  const {
    vehicles,
    filters,
    isLoading,
    error,
    setFilters,
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicleStore();

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const filteredVehicles = filterVehicles(vehicles, filters);

  return {
    vehicles: filteredVehicles,
    isLoading,
    error,
    filters,
    setFilters,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
}