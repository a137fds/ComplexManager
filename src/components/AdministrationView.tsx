import React, { useEffect, useState } from 'react';
import { ShieldCheck, Check, History, Search, Save } from 'lucide-react';
import { UserRole, Language, AuditLog } from '../types';
import { translations } from '../i18n/translations';
import { supabase } from '../lib/supabase';

interface Props { auditLogs: AuditLog[]; currentRole: UserRole; onRoleChange: (role: UserRole) => void; currentLang: Language; }
interface Role { id: number; code: string; name: string; }
interface Permission { id: number; code: string; name: string; }

type Matrix = Record<string, Record<number, boolean>>;

export const AdministrationView: React.FC<Props> = ({ auditLogs, currentLang }) => {
  const t = translations[currentLang];
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [matrix, setMatrix] = useState<Matrix>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [logFilter, setLogFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      const [{ data: r }, { data: p }, { data: rp }] = await Promise.all([
        supabase.from('roles').select('id,code,name').order('id'),
        supabase.from('permissions').select('id,code,name').order('id'),
        supabase.from('role_permissions').select('role_id,permission_id'),
      ]);
      const roleList = (r || []) as Role[]; const permissionList = (p || []) as Permission[];
      const next: Matrix = {};
      roleList.forEach(role => { next[role.code] = {}; permissionList.forEach(permission => { next[role.code][permission.id] = (rp || []).some((item: any) => item.role_id === role.id && item.permission_id === permission.id); }); });
      setRoles(roleList); setPermissions(permissionList); setMatrix(next); setLoading(false);
    };
    void load();
  }, []);

  const toggle = (roleCode: string, permissionId: number) => setMatrix(prev => ({ ...prev, [roleCode]: { ...prev[roleCode], [permissionId]: !prev[roleCode]?.[permissionId] } }));

  const save = async () => {
    setSaving(true); setMessage('');
    try {
      for (const role of roles) {
        const selected = permissions.filter(p => matrix[role.code]?.[p.id]).map(p => ({ role_id: role.id, permission_id: p.id }));
        const { error: delError } = await supabase.from('role_permissions').delete().eq('role_id', role.id);
        if (delError) throw delError;
        if (selected.length) { const { error } = await supabase.from('role_permissions').insert(selected); if (error) throw error; }
      }
      setMessage('Permissions saved.');
    } catch (error) { console.error(error); setMessage('Could not save permissions.'); }
    finally { setSaving(false); }
  };

  const filteredLogs = auditLogs.filter(log => `${log.userName} ${log.action} ${log.details} ${log.userRole}`.toLowerCase().includes(logFilter.toLowerCase()));

  return <div className="space-y-6">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
      <div><h2 className="text-xl font-bold text-slate-900">Settings</h2><p className="text-xs text-slate-500 mt-1">Roles and permissions</p></div>
      <button onClick={save} disabled={saving || loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-700 text-white text-sm font-semibold disabled:opacity-50"><Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}</button>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden p-6 space-y-4">
      <div><h3 className="font-bold text-slate-900 text-base flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-teal-600" />{t.rolePermissionMatrix}</h3><p className="text-xs text-slate-500 mt-1">Click a checkbox to grant or revoke a permission. Changes apply to the selected role.</p></div>
      {message && <div className="px-3 py-2 rounded-lg bg-slate-50 text-xs text-slate-700">{message}</div>}
      {loading ? <div className="text-sm text-slate-500">Loading permissions...</div> : <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-slate-50 border-y border-slate-200"><tr><th className="px-4 py-3">Permission</th>{roles.map(role => <th key={role.id} className="px-3 py-3 text-center whitespace-nowrap">{role.name}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{permissions.map(permission => <tr key={permission.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-semibold text-slate-900">{permission.name}</td>{roles.map(role => <td key={role.id} className="px-3 py-3 text-center"><button type="button" aria-label={`${role.name}: ${permission.name}`} onClick={() => toggle(role.code, permission.id)} className={`inline-flex items-center justify-center w-6 h-6 rounded-md border ${matrix[role.code]?.[permission.id] ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-white border-slate-300 text-transparent'}`}><Check className="w-4 h-4" /></button></td>)}</tr>)}</tbody></table></div>}
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden p-6 space-y-4"><div className="flex items-center justify-between"><h3 className="font-bold text-slate-900 text-base flex items-center"><History className="w-5 h-5 mr-2 text-teal-600" />{t.auditTrail}</h3><div className="relative w-64"><Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={logFilter} onChange={e => setLogFilter(e.target.value)} placeholder="Search audit trail..." className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" /></div></div><div className="divide-y divide-slate-100">{filteredLogs.map(log => <div key={log.id} className="py-3 text-xs"><b>{log.action}</b> <span className="text-slate-500">{log.userName} • {log.timestamp}</span><p className="text-slate-600">{log.details}</p></div>)}</div></div>
  </div>;
};
