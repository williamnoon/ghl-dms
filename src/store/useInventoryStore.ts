import { create } from 'zustand';
import { Vehicle, InventoryFilters } from '../types/inventory';
import { sampleVehicles } from '../data/sampleVehicles';
import { toast } from 'react-hot-toast';

interface InventoryState {
  vehicles: Vehicle[];
  filters: InventoryFilters;
  isLoading: boolean;
  error: string | null;
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

const STORAGE_KEY = 'vehicle_inventory';

// Initialize with sample data if no stored data exists
const getInitialVehicles = (): Vehicle[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.map(v => ({
        ...v,
        createdAt: new Date(v.createdAt),
        updatedAt: new Date(v.updatedAt)
      })) : [];
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  // Return sample vehicles if no stored data
  return sampleVehicles.map(vehicle => ({
    ...vehicle,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date()
  }));
};

const saveToStorage = (vehicles: Vehicle[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    toast.error('Failed to save changes');
  }
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  vehicles: getInitialVehicles(),
  filters: initialFilters,
  isLoading: false,
  error: null,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  fetchVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const vehicles = getInitialVehicles();
      set({ vehicles, isLoading: false });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      set({ error: 'Failed to fetch vehicles', isLoading: false });
      toast.error('Failed to fetch vehicles');
    }
  },
  addVehicle: async (vehicle) => {
    set({ isLoading: true, error: null });
    try {
      const newVehicle: Vehicle = {
        ...vehicle,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => {
        const updatedVehicles = [newVehicle, ...state.vehicles];
        saveToStorage(updatedVehicles);
        return {
          vehicles: updatedVehicles,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      set({ error: 'Failed to add vehicle', isLoading: false });
      toast.error('Failed to add vehicle');
    }
  },
  updateVehicle: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      set((state) => {
        const updatedVehicles = state.vehicles.map((v) =>
          v.id === id
            ? { ...v, ...updates, updatedAt: new Date() }
            : v
        );
        saveToStorage(updatedVehicles);
        return {
          vehicles: updatedVehicles,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error('Error updating vehicle:', error);
      set({ error: 'Failed to update vehicle', isLoading: false });
      toast.error('Failed to update vehicle');
    }
  },
  deleteVehicle: async (id) => {
    set({ isLoading: true, error: null });
    try {
      set((state) => {
        const updatedVehicles = state.vehicles.filter((v) => v.id !== id);
        saveToStorage(updatedVehicles);
        return {
          vehicles: updatedVehicles,
          isLoading: false,
        };
      });
      toast.success('Vehicle deleted successfully');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      set({ error: 'Failed to delete vehicle', isLoading: false });
      toast.error('Failed to delete vehicle');
    }
  },
}));