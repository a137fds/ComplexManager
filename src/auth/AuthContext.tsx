import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AppRole =
  | 'admin'
  | 'management_company'
  | 'chairman'
  | 'board_member'
  | 'financial_controller'
  | 'site_staff'
  | 'user';

export type UserLanguage = 'en' | 'ru' | 'tr' | 'fr' | 'da' | 'sv' | 'pl';

export interface UserProfile {
  id: string;
  role: AppRole;
  resident_id: number | null;
  default_language: UserLanguage;
}

interface AuthContextValue {
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProfile = async (currentSession: Session | null) => {
      if (!currentSession) {
        if (active) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, role, resident_id, default_language')
        .eq('id', currentSession.user.id)
        .single();

      if (!active) return;

      if (error) {
        console.error('Failed to load user profile:', error);
        setProfile(null);
      } else {
        setProfile({
          ...(data as UserProfile),
          default_language: data.default_language || 'en',
        });
      }
      setLoading(false);
    };

    void supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!active) return;
      setSession(currentSession);
      void loadProfile(currentSession);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      void loadProfile(currentSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({
    session,
    profile,
    loading,
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  }), [session, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
