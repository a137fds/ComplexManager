import { supabase } from './supabase';

export const auth = supabase;
export const googleAuthProvider = { provider: 'google' as const };

export type User = { uid: string; email: string | null };

function toUser(user: { id: string; email?: string | null } | null): User | null {
  return user ? { uid: user.id, email: user.email ?? null } : null;
}

export async function signInWithPopup(_auth: typeof supabase, provider: typeof googleAuthProvider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider.provider,
    options: { redirectTo: window.location.origin + window.location.pathname },
  });
  if (error) throw error;
  return data;
}

export async function signOut(_auth: typeof supabase) {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function onAuthStateChanged(_auth: typeof supabase, callback: (user: User | null) => void) {
  let active = true;
  supabase.auth.getUser().then(({ data }) => { if (active) callback(toUser(data.user)); });
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    if (active) callback(toUser(session?.user ?? null));
  });
  return () => { active = false; data.subscription.unsubscribe(); };
}
