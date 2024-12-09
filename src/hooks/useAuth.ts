import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-login as admin
    const signInAsAdmin = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'williamdeval@gmail.com',
        password: 'adminpassword'
      });

      if (error) {
        console.error('Error signing in:', error);
      } else {
        setUser(data.user);
      }
    };

    signInAsAdmin();
  }, []);

  return { user, loading };
}