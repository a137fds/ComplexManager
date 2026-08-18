import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tntoxgpemvitpqkjxdki.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabasePublishableKey) {
  console.warn('VITE_SUPABASE_PUBLISHABLE_KEY is not configured. Supabase authentication will not work until it is provided.');
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey || 'missing-publishable-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  },
);
