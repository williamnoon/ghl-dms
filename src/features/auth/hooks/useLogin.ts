import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import type { LoginFormData } from '../types/auth';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginFormData, onSuccess: () => void) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      toast.success('Successfully logged in');
      onSuccess();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, login };
}