import { useEffect } from 'react';
import { initializeAdmin, initializeDatabase } from '../lib/supabase';
import { seedInitialData } from '../utils/seedData';

export function useInitializeAdmin() {
  useEffect(() => {
    const init = async () => {
      await initializeDatabase();
      await initializeAdmin();
      await seedInitialData();
    };
    
    init();
  }, []);
}