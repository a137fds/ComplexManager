import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AppRole = 'admin' | 'management_company' | 'chairman' | 'board_member' | 'financial_controller' | 'site_staff' | 'user';
export type UserLanguage = 'en' | 'ru' | 'tr' | 'fr' | 'da' | 'sv' | 'pl';
export interface UserProfile { id: string; role: AppRole; default_language: UserLanguage; }
interface AuthContextValue { session: Session | null; profile: UserProfile | null; permissions: string[]; hasPermission: (code: string) => boolean; loading: boolean; signOut: () => Promise<void>; }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const loadedUserId = useRef<string | null>(null);
  const checkingSession = useRef(false);

  const clearAuth = () => {
    setSession(null);
    setProfile(null);
    setPermissions([]);
    loadedUserId.current = null;
    setLoading(false);
  };

  const loadProfile = async (currentSession: Session) => {
    const userId = currentSession.user.id;
    if (loadedUserId.current === userId) {
      setSession(currentSession);
      return;
    }

    setLoading(true);
    const { data: owner, error: ownerError } = await supabase.from('owners').select('id, default_language').eq('id', userId).single();
    if (ownerError || !owner) {
      console.error('Failed to load owner profile:', ownerError);
      clearAuth();
      return;
    }

    const { data: userRole, error: roleError } = await supabase.from('user_roles').select('role_id, roles!inner(code)').eq('user_id', userId).maybeSingle();
    if (roleError || !userRole) {
      console.error('Failed to load user role:', roleError);
      clearAuth();
      return;
    }

    const roleCode = (userRole as any).roles?.code as AppRole;
    if (!roleCode) {
      clearAuth();
      return;
    }

    const { data: rolePermissions, error: permissionError } = await supabase.from('role_permissions').select('permission_id').eq('role_id', userRole.role_id);
    if (permissionError) {
      console.error('Failed to load role permissions:', permissionError);
      setSession(currentSession);
      setProfile({ id: owner.id, role: roleCode, default_language: owner.default_language || 'en' });
      setPermissions([]);
      loadedUserId.current = userId;
      setLoading(false);
      return;
    }

    const permissionIds = (rolePermissions || []).map(row => row.permission_id);
    let permissionCodes: string[] = [];
    if (permissionIds.length > 0) {
      const { data: permissionRows, error: permissionsError } = await supabase.from('permissions').select('code').in('id', permissionIds);
      if (permissionsError) console.error('Failed to load permissions:', permissionsError);
      permissionCodes = (permissionRows || []).map(row => row.code);
    }

    setSession(currentSession);
    setProfile({ id: owner.id, role: roleCode, default_language: owner.default_language || 'en' });
    setPermissions(permissionCodes);
    loadedUserId.current = userId;
    setLoading(false);
  };

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      if (!active || checkingSession.current) return;
      checkingSession.current = true;
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error || !currentSession) {
          clearAuth();
          return;
        }
        setSession(currentSession);
        await loadProfile(currentSession);
      } finally {
        checkingSession.current = false;
      }
    };

    void checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'SIGNED_OUT' || !currentSession) {
        clearAuth();
        return;
      }
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        void loadProfile(currentSession);
      } else {
        setSession(currentSession);
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void checkSession();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      active = false;
      listener.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const value = useMemo(() => ({ session, profile, permissions, hasPermission: (code: string) => permissions.includes(code), loading, signOut: async () => { const { error } = await supabase.auth.signOut(); if (error) throw error; } }), [session, profile, permissions, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export function useAuth(): AuthContextValue { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
