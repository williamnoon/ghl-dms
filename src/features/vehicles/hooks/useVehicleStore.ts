import { create } from 'zustand';
import { Vehicle, InventoryFilters } from '../types/vehicle';
import * as vehicleService from '../services/vehicleService';

interface VehicleState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  filters: InventoryFilters;
  setFilters: (filters: Partial<InventoryFilters>) => void;
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
}

const initialFilters: InventoryFilters = {
  search: '',
  condition: [],
  status: [],
  minPrice: 0,
  maxPrice: 1000000,
  minYear: 1900,
  maxYear: new Date().getFullYear() + 1,
};

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  isLoading: false,
  error: null,
  filters: initialFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  fetchVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const vehicles = await vehicleService.fetchVehicles();
      set({ vehicles, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch vehicles', isLoading: false });
    }
  },
  addVehicle: async (vehicle) => {
    set({ isLoading: true, error: null });
    try {
      const newVehicle = await vehicleService.createVehicle(vehicle);
      set((state) => ({
        vehicles: [newVehicle, ...state.vehicles],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add vehicle', isLoading: false });
    }
  },
  updateVehicle: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedVehicle = await vehicleService.updateVehicle(id, updates);
      set((state) => ({
        vehicles: state.vehicles.map((v) =>
          v.id === id ? updatedVehicle : v
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update vehicle', isLoading: false });
    }
  },
  deleteVehicle: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await vehicleService.deleteVehicle(id);
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete vehicle', isLoading: false });
    }
  },
}));