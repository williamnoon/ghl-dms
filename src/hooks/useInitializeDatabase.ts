import { useEffect, useState } from 'react';
import { initializeDatabase } from '../lib/supabase';
import { seedData } from '../utils/seedData';
import { toast } from 'react-hot-toast';

export function useInitializeDatabase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        const result = await initializeDatabase();
        
        if (result.success) {
          await seedData();
          setIsInitialized(true);
          toast.success(result.message);
        } else {
          setError(result.message);
          toast.error(result.message);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize database';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, []);

  return { isInitialized, isLoading, error };
}