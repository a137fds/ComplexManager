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

// Preserve the useful JSON error returned by our Edge Functions instead of
// exposing only the generic FunctionsHttpError message to the application.
const originalInvoke = supabase.functions.invoke.bind(supabase.functions);
supabase.functions.invoke = (async (functionName: string, options?: any) => {
  const result = await originalInvoke(functionName, options);
  if (!result.error) return result;

  const response = (result.error as any)?.context;
  let message = (result.error as any)?.message || 'Edge Function request failed';

  if (response && typeof response.clone === 'function') {
    try {
      const body = await response.clone().json();
      if (typeof body?.error === 'string' && body.error.trim()) message = body.error.trim();
      else if (typeof body?.message === 'string' && body.message.trim()) message = body.message.trim();
    } catch {
      // Keep the original error message when the response is not JSON.
    }
  }

  return { data: result.data, error: new Error(message) } as any;
}) as typeof supabase.functions.invoke;
