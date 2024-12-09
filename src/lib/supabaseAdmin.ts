import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://ypoytjkykgscwsojogze.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwb3l0amt5a2dzY3dzb2pvZ3plIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzc1NzEzMSwiZXhwIjoyMDQ5MzMzMTMxfQ.dH6ssnBDaR5AVzPWcKchhcGlPkOCQ0nG0dPQgcQyYhI';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase admin credentials');
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  }
);

export async function initializeAdmin() {
  try {
    // Create admin user if it doesn't exist
    const { data: existingUser, error: checkError } = await supabaseAdmin.auth.admin.getUserByEmail(
      'williamdeval@gmail.com'
    );

    if (checkError) {
      console.error('Error checking for existing user:', checkError);
      return;
    }

    if (!existingUser) {
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: 'williamdeval@gmail.com',
        password: 'adminpassword',
        email_confirm: true,
      });

      if (createError) {
        console.error('Error creating admin user:', createError);
        return;
      }

      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error in initializeAdmin:', error);
  }
}