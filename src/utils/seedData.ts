import { supabase } from '../lib/supabase';
import { sampleVehicles } from '../data/sampleVehicles';
import { toast } from 'react-hot-toast';

export async function seedData() {
  try {
    // Check if data already exists
    const { data: existingVehicles, error: checkError } = await supabase
      .from('vehicles')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing vehicles:', checkError);
      toast.error('Failed to check existing vehicles');
      return;
    }

    // Only seed if no vehicles exist
    if (!existingVehicles?.length) {
      const { error: seedError } = await supabase
        .from('vehicles')
        .insert(sampleVehicles);

      if (seedError) {
        console.error('Error seeding vehicles:', seedError);
        toast.error('Failed to seed initial data');
        return;
      }

      toast.success('Successfully seeded initial vehicle data');
    }
  } catch (error) {
    console.error('Error in seedData:', error);
    toast.error('Failed to seed data');
  }
}