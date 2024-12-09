import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://ypoytjkykgscwsojogze.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwb3l0amt5a2dzY3dzb2pvZ3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NTcxMzEsImV4cCI6MjA0OTMzMzEzMX0.dH6ssnBDaR5AVzPWcKchhcGlPkOCQ0nG0dPQgcQyYhI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Create vehicles table directly with SQL
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS vehicles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        price NUMERIC NOT NULL,
        condition TEXT NOT NULL CHECK (condition IN ('new', 'used', 'certified')),
        status TEXT NOT NULL CHECK (status IN ('available', 'sold', 'pending')),
        description TEXT,
        specifications JSONB DEFAULT '{}'::jsonb,
        images TEXT[] DEFAULT ARRAY[]::TEXT[],
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );

      -- Enable RLS
      ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

      -- Create policies
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies WHERE tablename = 'vehicles' AND policyname = 'Anyone can view vehicles'
        ) THEN
          CREATE POLICY "Anyone can view vehicles" ON vehicles FOR SELECT USING (true);
        END IF;

        IF NOT EXISTS (
          SELECT FROM pg_policies WHERE tablename = 'vehicles' AND policyname = 'Anyone can manage vehicles'
        ) THEN
          CREATE POLICY "Anyone can manage vehicles" ON vehicles FOR ALL USING (true);
        END IF;
      END $$;

      -- Create updated_at trigger
      CREATE OR REPLACE FUNCTION handle_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Create trigger
      DROP TRIGGER IF EXISTS set_updated_at ON vehicles;
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON vehicles
        FOR EACH ROW
        EXECUTE FUNCTION handle_updated_at();
    `;

    const { error: createError } = await supabase.rpc('run_sql', { query: createTableQuery });
    
    if (createError) {
      // If run_sql function doesn't exist, create it first
      if (createError.code === 'PGRST202') {
        const createRunSqlQuery = `
          CREATE OR REPLACE FUNCTION run_sql(query text)
          RETURNS void
          LANGUAGE plpgsql
          SECURITY DEFINER
          SET search_path = public
          AS $$
          BEGIN
            EXECUTE query;
          END;
          $$;

          GRANT EXECUTE ON FUNCTION run_sql(text) TO authenticated;
        `;

        const { error: runSqlError } = await supabase.rpc('run_sql', { query: createRunSqlQuery });
        if (runSqlError) throw runSqlError;

        // Retry creating the vehicles table
        const { error: retryError } = await supabase.rpc('run_sql', { query: createTableQuery });
        if (retryError) throw retryError;
      } else {
        throw createError;
      }
    }

    // Check if we need to seed initial data
    const { data: existingVehicles, error: checkError } = await supabase
      .from('vehicles')
      .select('id')
      .limit(1);

    if (checkError) throw checkError;

    if (!existingVehicles?.length) {
      const { error: seedError } = await supabase
        .from('vehicles')
        .insert([
          {
            make: 'Toyota',
            model: 'Camry',
            year: 2023,
            price: 28999,
            condition: 'new',
            status: 'available',
            description: 'Brand new Toyota Camry with advanced safety features.',
            specifications: {
              'Engine': '2.5L 4-Cylinder',
              'Transmission': '8-Speed Automatic'
            },
            images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb']
          },
          {
            make: 'Honda',
            model: 'CR-V',
            year: 2022,
            price: 32500,
            condition: 'certified',
            status: 'available',
            description: 'Certified pre-owned Honda CR-V with low mileage.',
            specifications: {
              'Engine': '1.5L Turbo',
              'Transmission': 'CVT'
            },
            images: ['https://images.unsplash.com/photo-1568844293986-8d0400bd4745']
          }
        ]);

      if (seedError) throw seedError;
    }

    return { success: true, message: 'Database initialized successfully' };
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to initialize database'
    };
  }
}