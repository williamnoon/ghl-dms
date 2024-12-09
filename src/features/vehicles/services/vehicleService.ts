import { supabase } from '../../../lib/supabase';
import { Vehicle } from '../types/vehicle';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'vehicle_inventory';

// Local storage helpers
const getLocalVehicles = (): Vehicle[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const setLocalVehicles = (vehicles: Vehicle[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

// Check if online
const isOnline = () => navigator.onLine;

export async function fetchVehicles() {
  try {
    if (isOnline()) {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('updatedAt', { ascending: false });

      if (error) throw error;
      
      // Update local storage with latest data
      setLocalVehicles(data as Vehicle[]);
      return data as Vehicle[];
    } else {
      // Fallback to local storage when offline
      toast.info('Working in offline mode');
      return getLocalVehicles();
    }
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    toast.error('Failed to fetch vehicles, using local data');
    return getLocalVehicles();
  }
}

export async function createVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const newVehicle = {
      ...vehicle,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isOnline()) {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([newVehicle])
        .select()
        .single();

      if (error) throw error;

      // Update local storage
      const localVehicles = getLocalVehicles();
      setLocalVehicles([data as Vehicle, ...localVehicles]);
      
      toast.success('Vehicle added successfully');
      return data as Vehicle;
    } else {
      // Store locally when offline
      const localVehicles = getLocalVehicles();
      setLocalVehicles([newVehicle as Vehicle, ...localVehicles]);
      
      toast.success('Vehicle added locally');
      return newVehicle as Vehicle;
    }
  } catch (error) {
    console.error('Error adding vehicle:', error);
    toast.error('Failed to add vehicle');
    throw error;
  }
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>) {
  try {
    const updatedVehicle = {
      ...updates,
      id,
      updatedAt: new Date()
    };

    if (isOnline()) {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updatedVehicle)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update local storage
      const localVehicles = getLocalVehicles();
      setLocalVehicles(
        localVehicles.map(v => v.id === id ? data as Vehicle : v)
      );
      
      toast.success('Vehicle updated successfully');
      return data as Vehicle;
    } else {
      // Update locally when offline
      const localVehicles = getLocalVehicles();
      const existingVehicle = localVehicles.find(v => v.id === id);
      
      if (!existingVehicle) {
        throw new Error('Vehicle not found');
      }

      const updated = {
        ...existingVehicle,
        ...updatedVehicle
      };

      setLocalVehicles(
        localVehicles.map(v => v.id === id ? updated : v)
      );
      
      toast.success('Vehicle updated locally');
      return updated;
    }
  } catch (error) {
    console.error('Error updating vehicle:', error);
    toast.error('Failed to update vehicle');
    throw error;
  }
}

export async function deleteVehicle(id: string) {
  try {
    if (isOnline()) {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }

    // Always update local storage
    const localVehicles = getLocalVehicles();
    setLocalVehicles(localVehicles.filter(v => v.id !== id));
    
    toast.success(isOnline() ? 'Vehicle deleted successfully' : 'Vehicle deleted locally');
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    toast.error('Failed to delete vehicle');
    throw error;
  }
}

// Sync local changes when coming back online
window.addEventListener('online', async () => {
  try {
    const { data: serverVehicles, error } = await supabase
      .from('vehicles')
      .select('*');

    if (error) throw error;

    const localVehicles = getLocalVehicles();
    
    // Simple sync strategy: use most recent version
    const mergedVehicles = [...serverVehicles, ...localVehicles]
      .reduce((acc, vehicle) => {
        const existing = acc.find(v => v.id === vehicle.id);
        if (!existing || new Date(existing.updatedAt) < new Date(vehicle.updatedAt)) {
          return [...acc.filter(v => v.id !== vehicle.id), vehicle];
        }
        return acc;
      }, [] as Vehicle[]);

    // Update both local storage and server
    setLocalVehicles(mergedVehicles);
    
    const { error: syncError } = await supabase
      .from('vehicles')
      .upsert(mergedVehicles);

    if (syncError) throw syncError;
    
    toast.success('Data synchronized successfully');
  } catch (error) {
    console.error('Error syncing data:', error);
    toast.error('Failed to sync data');
  }
});

// Update offline status
window.addEventListener('offline', () => {
  toast.info('Working in offline mode');
});