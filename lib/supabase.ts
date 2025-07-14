import { createClient } from '@supabase/supabase-js';
import { Profile, User } from '@/types';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
console.log('supabaseUrl', supabaseUrl);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient('https://eqeuiciirnlujvtqkzmk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZXVpY2lpcm5sdWp2dHFrem1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjYzODQsImV4cCI6MjA2Nzk0MjM4NH0.5wOAxR9-Uqhr3HoLFMpHNuOs01z1nPSWmW7w-mM16D0');

// Create admin client for server-side operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const supabaseAdmin = createClient('https://eqeuiciirnlujvtqkzmk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZXVpY2lpcm5sdWp2dHFrem1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjYzODQsImV4cCI6MjA2Nzk0MjM4NH0.5wOAxR9-Uqhr3HoLFMpHNuOs01z1nPSWmW7w-mM16D0');


// Profile management functions
export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getProfile:', error);
    return null;
  }
};

export const createProfile = async (user: User): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createProfile:', error);
    return null;
  }
};

export const updateProfile = async (
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return null;
  }
};

export const updateStripeCustomerId = async (
  userId: string,
  stripeCustomerId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        stripe_customer_id: stripeCustomerId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating Stripe customer ID:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateStripeCustomerId:', error);
    return false;
  }
};

// Authentication helper functions
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

// Database schema setup (run this once to create the profiles table)
export const setupDatabase = async () => {
  // This would typically be done via Supabase migrations
  // For now, we'll create the table structure here
  const createProfilesTable = `
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      stripe_customer_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: createProfilesTable,
    });

    if (error) {
      console.error('Error setting up database:', error);
    }
  } catch (error) {
    console.error('Error in setupDatabase:', error);
  }
}; 