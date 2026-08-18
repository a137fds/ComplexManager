import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
    let active = true;
    let checking = false;

    const clearAuth = () => {
      if (!active) return;
      setSession(null);
      setProfile(null);
      setPermissions([]);
      setLoading(false);
    };

    const loadProfile = async (currentSession: Session | null) => {
      if (!currentSession) { clearAuth(); return; }
      const { data: owner, error: ownerError } = await supabase.from('owners').select('id, default_language').eq('id', currentSession.user.id).single();
      if (!active) return;
      if (ownerError || !owner) { console.error('Failed to load owner profile:', ownerError); setProfile(null); setPermissions([]); setLoading(false); return; }

      const { data: userRole, error: roleError } = await supabase.from('user_roles').select('role_id, roles!inner(code)').eq('user_id', currentSession.user.id).maybeSingle();
      if (!active) return;
      if (roleError || !userRole) { console.error('Failed to load user role:', roleError); setProfile(null); setPermissions([]); setLoading(false); return; }
      const roleCode = (userRole as any).roles?.code as AppRole;
      if (!roleCode) { setProfile(null); setPermissions([]); setLoading(false); return; }

      const { data: rolePermissions, error: permissionError } = await supabase.from('role_permissions').select('permission_id').eq('role_id', userRole.role_id);
      if (!active) return;
      if (permissionError) { console.error('Failed to load role permissions:', permissionError); setProfile({ id: owner.id, role: roleCode, default_language: owner.default_language || 'en' }); setPermissions([]); setLoading(false); return; }
      const permissionIds = (rolePermissions || []).map(row => row.permission_id);
      if (permissionIds.length === 0) { setProfile({ id: owner.id, role: roleCode, default_language: owner.default_language || 'en' }); setPermissions([]); setLoading(false); return; }
      const { data: permissionRows, error: permissionsError } = await supabase.from('permissions').select('code').in('id', permissionIds);
      if (!active) return;
      if (permissionsError) console.error('Failed to load permissions:', permissionsError);
      setProfile({ id: owner.id, role: roleCode, default_language: owner.default_language || 'en' });
      setPermissions((permissionRows || []).map(row => row.code));
      setLoading(false);
    };

    const checkSession = async () => {
      if (checking || !active) return;
      checking = true;
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
        checking = false;
      }
    };

    void checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'SIGNED_OUT' || !currentSession) {
        clearAuth();
        return;
      }
      setSession(currentSession);
      void loadProfile(currentSession);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void checkSession();
    };
    const handleFocus = () => { void checkSession(); };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      active = false;
      listener.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const value = useMemo(() => ({ session, profile, permissions, hasPermission: (code: string) => permissions.includes(code), loading, signOut: async () => { const { error } = await supabase.auth.signOut(); if (error) throw error; } }), [session, profile, permissions, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export function useAuth(): AuthContextValue { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
