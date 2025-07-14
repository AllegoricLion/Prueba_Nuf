import { createClient } from '@supabase/supabase-js';
import { Profile, User } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const createProfile = async (user: User): Promise<Profile | null> => {
  try {
    const { data, error } = await supabaseAdmin
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
    const { data, error } = await supabaseAdmin
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
    const { error } = await supabaseAdmin
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

// Database schema setup (run this once to create the profiles table)
export const setupDatabase = async () => {
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